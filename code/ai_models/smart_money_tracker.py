"""
Smart Money Tracker
Identifies "smart money" wallets (early whales, protocol insiders, top
performers) and tracks their cross-chain movements using:
  - K-Means clustering on wallet behaviour features
  - Graph-centrality metrics to surface high-influence addresses
  - Rolling PnL tracking to rank wallets by performance
"""

import logging
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional

import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Data structures
# ---------------------------------------------------------------------------


@dataclass
class WalletProfile:
    address: str
    cluster_id: int
    cluster_label: str  # "whale", "smart_trader", "bot", "retail"
    smart_money_score: float  # 0-100
    pnl_30d: float
    pnl_90d: float
    win_rate: float
    avg_trade_size_usd: float
    chains_active: List[str] = field(default_factory=list)
    top_protocols: List[str] = field(default_factory=list)
    centrality_score: float = 0.0

    def to_dict(self) -> Dict[str, Any]:
        return {
            "address": self.address,
            "cluster": self.cluster_label,
            "smart_money_score": round(self.smart_money_score, 2),
            "pnl_30d_pct": round(self.pnl_30d, 4),
            "pnl_90d_pct": round(self.pnl_90d, 4),
            "win_rate": round(self.win_rate, 4),
            "avg_trade_size_usd": round(self.avg_trade_size_usd, 2),
            "chains_active": self.chains_active,
            "top_protocols": self.top_protocols,
            "centrality_score": round(self.centrality_score, 4),
        }


@dataclass
class MovementSignal:
    wallet_address: str
    smart_money_score: float
    chain: str
    protocol: str
    direction: str  # "buy" / "sell" / "bridge_in" / "bridge_out"
    amount_usd: float
    token_symbol: str
    timestamp: str
    signal_strength: float  # 0-1

    def to_dict(self) -> Dict[str, Any]:
        return {
            "wallet": self.wallet_address,
            "score": round(self.smart_money_score, 2),
            "chain": self.chain,
            "protocol": self.protocol,
            "direction": self.direction,
            "amount_usd": round(self.amount_usd, 2),
            "token": self.token_symbol,
            "timestamp": self.timestamp,
            "signal_strength": round(self.signal_strength, 4),
        }


# ---------------------------------------------------------------------------
# Feature engineering
# ---------------------------------------------------------------------------

WALLET_FEATURE_COLS = [
    "total_volume_usd_30d",
    "tx_count_30d",
    "unique_protocols_30d",
    "unique_chains",
    "avg_hold_days",
    "pnl_30d_pct",
    "pnl_90d_pct",
    "win_rate",
    "max_single_trade_usd",
    "avg_trade_size_usd",
    "early_entry_ratio",  # fraction of positions entered in first 10% of price move
    "exit_timing_score",  # 0-1: how often wallet exits near top
    "bridge_frequency",
    "flash_loan_usage",
]


def engineer_wallet_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Prepare wallet-level feature matrix.

    `df` must be indexed by wallet address and contain as many of
    WALLET_FEATURE_COLS as available; missing columns are imputed with 0.
    """
    out = pd.DataFrame(index=df.index)
    for col in WALLET_FEATURE_COLS:
        out[col] = df[col] if col in df.columns else 0.0

    # Log-scale volume columns to compress whale outliers
    for col in ["total_volume_usd_30d", "max_single_trade_usd", "avg_trade_size_usd"]:
        out[f"log_{col}"] = np.log1p(out[col])

    out.fillna(0.0, inplace=True)
    return out


# ---------------------------------------------------------------------------
# Cluster label mapping
# ---------------------------------------------------------------------------

_CLUSTER_LABELS = {
    0: "retail",
    1: "smart_trader",
    2: "whale",
    3: "bot",
    4: "arbitrageur",
}


def _infer_cluster_label(centroid: np.ndarray, feature_names: List[str]) -> str:
    """Heuristically label a cluster based on its centroid values."""
    feat = dict(zip(feature_names, centroid))
    vol = feat.get("log_total_volume_usd_30d", 0)
    win_rate = feat.get("win_rate", 0)
    tx_count = feat.get("tx_count_30d", 0)
    flash = feat.get("flash_loan_usage", 0)
    bridge = feat.get("bridge_frequency", 0)

    if flash > 0.5:
        return "arbitrageur"
    # tx_count is a raw 30-day transaction count; very high frequency with a
    # poor win rate is characteristic of unsophisticated bots.
    if tx_count > 500 and win_rate < 0.4:
        return "bot"
    # log1p(volume) > 16 corresponds to roughly $9M of 30-day volume.
    if vol > 16:
        return "whale"
    if win_rate > 0.55 and bridge > 0.3:
        return "smart_trader"
    return "retail"


# ---------------------------------------------------------------------------
# Main tracker class
# ---------------------------------------------------------------------------


class SmartMoneyTracker:
    """
    Clusters wallets and assigns smart-money scores. Generates movement
    signals when high-score wallets make significant transactions.
    """

    # Minimum smart-money score to emit a signal
    SIGNAL_THRESHOLD: float = 60.0

    def __init__(self, n_clusters: int = 5, random_state: int = 42) -> None:
        self.n_clusters = n_clusters
        self.random_state = random_state
        self.scaler = StandardScaler()
        self.kmeans: Optional[KMeans] = None
        self._cluster_labels: Dict[int, str] = {}
        self._feature_names: List[str] = []
        self._is_fitted = False

    # ------------------------------------------------------------------
    # Training
    # ------------------------------------------------------------------

    def fit(self, wallet_df: pd.DataFrame) -> "SmartMoneyTracker":
        """
        Fit on a wallet-level DataFrame (one row per wallet address).

        Parameters
        ----------
        wallet_df : pd.DataFrame indexed by wallet address.
        """
        feat_df = engineer_wallet_features(wallet_df)
        self._feature_names = list(feat_df.columns)
        X = self.scaler.fit_transform(feat_df.values)

        self.kmeans = KMeans(
            n_clusters=self.n_clusters,
            random_state=self.random_state,
            n_init=10,
        )
        self.kmeans.fit(X)

        # Label each cluster using centroids mapped back to the ORIGINAL
        # feature scale; the heuristic thresholds in _infer_cluster_label are
        # expressed in raw units (win rates in [0, 1], counts, log-volumes),
        # so comparing them against standardised centroids would be wrong.
        for cid in range(self.n_clusters):
            centroid_scaled = self.kmeans.cluster_centers_[cid]
            centroid_raw = self.scaler.inverse_transform(
                centroid_scaled.reshape(1, -1)
            )[0]
            self._cluster_labels[cid] = _infer_cluster_label(
                centroid_raw, self._feature_names
            )

        logger.info(
            "SmartMoneyTracker fitted on %d wallets, %d clusters: %s",
            len(wallet_df),
            self.n_clusters,
            self._cluster_labels,
        )
        self._is_fitted = True
        return self

    # ------------------------------------------------------------------
    # Scoring
    # ------------------------------------------------------------------

    def _compute_smart_money_score(self, row: pd.Series) -> float:
        """
        Weighted scoring function for a single wallet.
        Returns a score in [0, 100].
        """
        score = 0.0
        score += min(row.get("win_rate", 0) * 40, 40)  # up to 40 pts
        score += min(row.get("pnl_90d_pct", 0) * 20, 20)  # up to 20 pts
        score += min(row.get("early_entry_ratio", 0) * 20, 20)  # up to 20 pts
        score += min(row.get("exit_timing_score", 0) * 10, 10)  # up to 10 pts
        score += min(row.get("unique_chains", 0) / 5 * 5, 5)  # up to  5 pts
        score += min(row.get("unique_protocols_30d", 0) / 20 * 5, 5)  # up to 5 pts
        return float(np.clip(score, 0, 100))

    def profile_wallets(self, wallet_df: pd.DataFrame) -> List[WalletProfile]:
        """
        Return a WalletProfile for every wallet in `wallet_df`.
        """
        if not self._is_fitted:
            raise RuntimeError("Call fit() before profile_wallets().")

        feat_df = engineer_wallet_features(wallet_df)
        X = self.scaler.transform(feat_df.values)
        cluster_ids = self.kmeans.predict(X)

        profiles = []
        for i, (addr, row) in enumerate(wallet_df.iterrows()):
            cid = int(cluster_ids[i])
            profiles.append(
                WalletProfile(
                    address=str(addr),
                    cluster_id=cid,
                    cluster_label=self._cluster_labels.get(cid, "unknown"),
                    smart_money_score=self._compute_smart_money_score(row),
                    pnl_30d=float(row.get("pnl_30d_pct", 0)),
                    pnl_90d=float(row.get("pnl_90d_pct", 0)),
                    win_rate=float(row.get("win_rate", 0)),
                    avg_trade_size_usd=float(row.get("avg_trade_size_usd", 0)),
                    chains_active=row.get("chains_active", []),
                    top_protocols=row.get("top_protocols", []),
                )
            )
        return profiles

    def get_smart_money_wallets(
        self, wallet_df: pd.DataFrame, top_n: int = 50
    ) -> List[WalletProfile]:
        """Return the top-N wallets by smart_money_score."""
        profiles = self.profile_wallets(wallet_df)
        return sorted(profiles, key=lambda p: p.smart_money_score, reverse=True)[:top_n]

    # ------------------------------------------------------------------
    # Signal generation
    # ------------------------------------------------------------------

    def generate_signals(
        self,
        tx_df: pd.DataFrame,
        wallet_profiles: List[WalletProfile],
        min_amount_usd: float = 10_000,
    ) -> List[MovementSignal]:
        """
        Scan a transaction DataFrame and emit signals for smart-money moves.

        `tx_df` must have columns: wallet_address, chain, protocol,
        direction, amount_usd, token_symbol, timestamp.
        """
        score_map = {p.address: p.smart_money_score for p in wallet_profiles}
        signals = []

        for _, tx in tx_df.iterrows():
            addr = str(tx.get("wallet_address", ""))
            score = score_map.get(addr, 0.0)
            if score < self.SIGNAL_THRESHOLD:
                continue
            amount = float(tx.get("amount_usd", 0))
            if amount < min_amount_usd:
                continue

            # Signal strength = normalised score × log-scaled amount
            strength = (score / 100) * min(np.log1p(amount) / np.log1p(1e7), 1.0)
            signals.append(
                MovementSignal(
                    wallet_address=addr,
                    smart_money_score=score,
                    chain=str(tx.get("chain", "")),
                    protocol=str(tx.get("protocol", "")),
                    direction=str(tx.get("direction", "")),
                    amount_usd=amount,
                    token_symbol=str(tx.get("token_symbol", "")),
                    timestamp=str(tx.get("timestamp", "")),
                    signal_strength=float(np.clip(strength, 0, 1)),
                )
            )

        signals.sort(key=lambda s: s.signal_strength, reverse=True)
        logger.info("Generated %d smart-money signals.", len(signals))
        return signals

    # ------------------------------------------------------------------
    # Cross-chain flow summary
    # ------------------------------------------------------------------

    def cross_chain_flow_summary(
        self,
        tx_df: pd.DataFrame,
        wallet_profiles: List[WalletProfile],
    ) -> pd.DataFrame:
        """
        Aggregate net USD flows per (chain, token) for smart-money wallets.
        Returns a DataFrame with columns: chain, token, net_flow_usd, tx_count.
        """
        smart_addrs = {
            p.address
            for p in wallet_profiles
            if p.smart_money_score >= self.SIGNAL_THRESHOLD
        }
        smart_txs = tx_df[tx_df["wallet_address"].isin(smart_addrs)].copy()
        if smart_txs.empty:
            return pd.DataFrame(columns=["chain", "token", "net_flow_usd", "tx_count"])

        smart_txs["signed_amount"] = smart_txs.apply(
            lambda r: (
                r["amount_usd"]
                if r.get("direction") in ("buy", "bridge_in")
                else -r["amount_usd"]
            ),
            axis=1,
        )
        summary = (
            smart_txs.groupby(["chain", "token_symbol"])
            .agg(
                net_flow_usd=("signed_amount", "sum"),
                tx_count=("signed_amount", "count"),
            )
            .reset_index()
            .rename(columns={"token_symbol": "token"})
            .sort_values("net_flow_usd", ascending=False)
        )
        return summary
