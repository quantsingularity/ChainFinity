import { useCallback, useEffect, useState } from "react";
import { useApp } from "../context/AppContext";
import { blockchainAPI } from "../services/api";

// ── Mock data used when the backend is not available ─────────────────────────

export interface PortfolioAsset {
  symbol: string;
  name: string;
  balance: number;
  value: number;
  change_24h: number;
  color: string;
}

export interface PortfolioData {
  total_value: number;
  assets: PortfolioAsset[];
}

export interface TransactionItem {
  id: string;
  hash: string;
  type: "send" | "receive" | "swap";
  from: string;
  to: string;
  amount: string;
  value: string;
  asset: string;
  network: string;
  timestamp: number;
  status: "confirmed" | "pending" | "failed";
  fee: string;
}

const MOCK_PORTFOLIO: PortfolioData = {
  total_value: 24850.42,
  assets: [
    {
      symbol: "ETH",
      name: "Ethereum",
      balance: 4.2,
      value: 12600,
      change_24h: 2.4,
      color: "#627eea",
    },
    {
      symbol: "BTC",
      name: "Bitcoin",
      balance: 0.18,
      value: 9720,
      change_24h: -0.8,
      color: "#f7931a",
    },
    {
      symbol: "LINK",
      name: "Chainlink",
      balance: 120,
      value: 1680,
      change_24h: 5.1,
      color: "#2a5ada",
    },
    {
      symbol: "UNI",
      name: "Uniswap",
      balance: 95,
      value: 850.42,
      change_24h: -2.3,
      color: "#ff007a",
    },
  ],
};

const now = Date.now();
const MOCK_TRANSACTIONS: TransactionItem[] = [
  {
    id: "0xabc1",
    hash: "0xabc1",
    type: "send",
    from: "0x1234...abcd",
    to: "0xefgh...5678",
    amount: "0.5",
    value: "$1,260",
    asset: "ETH",
    network: "ethereum",
    timestamp: (now - 3600000) / 1000,
    status: "confirmed",
    fee: "$4.20",
  },
  {
    id: "0xabc2",
    hash: "0xabc2",
    type: "receive",
    from: "0xefgh...5678",
    to: "0x1234...abcd",
    amount: "100",
    value: "$100",
    asset: "USDC",
    network: "polygon",
    timestamp: (now - 7200000) / 1000,
    status: "confirmed",
    fee: "$0.10",
  },
  {
    id: "0xabc3",
    hash: "0xabc3",
    type: "swap",
    from: "0x1234...abcd",
    to: "0x1234...abcd",
    amount: "1.0",
    value: "$3,000",
    asset: "ETH-LINK",
    network: "ethereum",
    timestamp: (now - 86400000) / 1000,
    status: "confirmed",
    fee: "$9.00",
  },
  {
    id: "0xabc4",
    hash: "0xabc4",
    type: "send",
    from: "0x1234...abcd",
    to: "0xaaaa...bbbb",
    amount: "0.1",
    value: "$252",
    asset: "ETH",
    network: "arbitrum",
    timestamp: (now - 172800000) / 1000,
    status: "pending",
    fee: "$0.90",
  },
  {
    id: "0xabc5",
    hash: "0xabc5",
    type: "receive",
    from: "0xcccc...dddd",
    to: "0x1234...abcd",
    amount: "50",
    value: "$700",
    asset: "LINK",
    network: "ethereum",
    timestamp: (now - 259200000) / 1000,
    status: "confirmed",
    fee: "$2.10",
  },
];

// ─────────────────────────────────────────────────────────────────────────────

export const usePortfolioData = (walletAddress?: string | null) => {
  const { user } = useApp();
  // Depend on the stable primitive, not the user object: a fresh user
  // reference on each render would otherwise cause an infinite re-fetch loop.
  const userWallet = user ? user.wallet_address : null;
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  const fetchPortfolio = useCallback(async () => {
    const address = walletAddress || userWallet;
    setLoading(true);
    try {
      if (address) {
        const response = await blockchainAPI.getPortfolio(address);
        setPortfolioData(response.data);
      } else {
        setPortfolioData(MOCK_PORTFOLIO);
      }
    } catch {
      // Backend not available: fall back to mock data so the UI stays usable.
      setPortfolioData(MOCK_PORTFOLIO);
    } finally {
      setLoading(false);
    }
  }, [walletAddress, userWallet]);

  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  return { portfolioData, loading, refreshPortfolio: fetchPortfolio };
};

export const useTransactionHistory = (walletAddress?: string | null) => {
  const { user } = useApp();
  const userWallet = user ? user.wallet_address : null;
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    const address = walletAddress || userWallet;
    setLoading(true);
    try {
      if (address) {
        const response = await blockchainAPI.getTransactions(address);
        setTransactions(response.data);
      } else {
        setTransactions(MOCK_TRANSACTIONS);
      }
    } catch {
      setTransactions(MOCK_TRANSACTIONS);
    } finally {
      setLoading(false);
    }
  }, [walletAddress, userWallet]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return { transactions, loading, refreshTransactions: fetchTransactions };
};
