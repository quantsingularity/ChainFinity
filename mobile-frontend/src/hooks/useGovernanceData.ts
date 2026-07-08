import { useCallback, useEffect, useState } from "react";

// Governance types mirror the web frontend's governance module so both apps
// present the same information.

export interface Proposal {
  id: string;
  title: string;
  description: string;
  status: "active" | "passed" | "rejected" | "pending";
  forVotes: number;
  againstVotes: number;
  abstainVotes: number;
  endsIn: string;
  proposer: string;
}

export interface GovernanceStats {
  votingPower: number;
  totalSupply: number;
  quorum: number;
  activeProposals: number;
  delegatedTo: string | null;
}

const MOCK_PROPOSALS: Proposal[] = [
  {
    id: "CFP-12",
    title: "Update AssetVault fee structure",
    description:
      "Adjust deposit and withdrawal fees in the AssetVault contract to improve capital efficiency across chains.",
    status: "active",
    forVotes: 2_500_000,
    againstVotes: 1_500_000,
    abstainVotes: 500_000,
    endsIn: "2 days",
    proposer: "0x1a2b...9f3c",
  },
  {
    id: "CFP-13",
    title: "Add Optimism to CrossChainManager",
    description:
      "Enable Optimism support in the CrossChainManager contract, expanding coverage to a 16th network.",
    status: "active",
    forVotes: 1_200_000,
    againstVotes: 300_000,
    abstainVotes: 120_000,
    endsIn: "5 days",
    proposer: "0x77aa...b1e0",
  },
  {
    id: "CFP-11",
    title: "Treasury diversification into stablecoins",
    description:
      "Allocate 20% of protocol treasury into a basket of blue-chip stablecoins to reduce volatility.",
    status: "passed",
    forVotes: 4_100_000,
    againstVotes: 900_000,
    abstainVotes: 200_000,
    endsIn: "Ended",
    proposer: "0xcccc...dddd",
  },
  {
    id: "CFP-10",
    title: "Reduce risk-oracle heartbeat to 30s",
    description:
      "Lower the risk oracle update interval from 60s to 30s for faster liquidation protection.",
    status: "rejected",
    forVotes: 800_000,
    againstVotes: 2_600_000,
    abstainVotes: 300_000,
    endsIn: "Ended",
    proposer: "0xefef...1212",
  },
];

const MOCK_STATS: GovernanceStats = {
  votingPower: 12_500,
  totalSupply: 10_000_000,
  quorum: 4_000_000,
  activeProposals: 2,
  delegatedTo: null,
};

export const useGovernanceData = () => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [stats, setStats] = useState<GovernanceStats | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    // No public governance endpoint yet: serve curated mock data so the
    // screen is fully explorable offline.
    await new Promise((r) => setTimeout(r, 250));
    setProposals(MOCK_PROPOSALS);
    setStats(MOCK_STATS);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { proposals, stats, loading, refresh: load };
};

// Portfolio history (7-day) used to draw a lightweight sparkline on the
// dashboard and portfolio screens.
export const PORTFOLIO_HISTORY: number[] = [
  22850, 23120, 22990, 23880, 24200, 24010, 24850,
];

export interface RiskMetric {
  label: string;
  value: number; // 0..100
  tone: "success" | "warning" | "error";
}

export const RISK_METRICS: RiskMetric[] = [
  { label: "Liquidation risk", value: 18, tone: "success" },
  { label: "Bridge exposure", value: 42, tone: "warning" },
  { label: "Volatility", value: 55, tone: "warning" },
  { label: "Concentration", value: 71, tone: "error" },
];

export const OVERALL_RISK_SCORE = 34; // lower is safer
