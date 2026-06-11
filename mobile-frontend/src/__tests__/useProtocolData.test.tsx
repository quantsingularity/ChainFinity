import { renderHook, waitFor } from "@testing-library/react-native";
import React from "react";
import {
  usePortfolioData,
  useTransactionHistory,
} from "../hooks/useProtocolData";
import { blockchainAPI } from "../services/api";

jest.mock("../context/AppContext", () => ({
  useApp: () => ({ user: { wallet_address: "0xUSER_WALLET" } }),
}));

jest.mock("../services/api", () => ({
  blockchainAPI: {
    getPortfolio: jest.fn(),
    getTransactions: jest.fn(),
  },
}));

const mocked = blockchainAPI as jest.Mocked<typeof blockchainAPI>;

describe("usePortfolioData", () => {
  beforeEach(() => jest.clearAllMocks());

  it("fetches with the provided wallet address", async () => {
    const data = { total_value: 5000, assets: [] };
    mocked.getPortfolio.mockResolvedValue({ data } as never);

    const { result } = renderHook(() => usePortfolioData("0xPROVIDED"));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(mocked.getPortfolio).toHaveBeenCalledWith("0xPROVIDED");
    expect(result.current.portfolioData).toEqual(data);
  });

  it("falls back to the user wallet when none is provided", async () => {
    mocked.getPortfolio.mockResolvedValue({
      data: { total_value: 1, assets: [] },
    } as never);

    const { result } = renderHook(() => usePortfolioData(null));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(mocked.getPortfolio).toHaveBeenCalledWith("0xUSER_WALLET");
  });

  it("falls back to mock data on API failure", async () => {
    mocked.getPortfolio.mockRejectedValue(new Error("network"));

    const { result } = renderHook(() => usePortfolioData("0xPROVIDED"));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.portfolioData).not.toBeNull();
    expect(result.current.portfolioData?.assets.length).toBeGreaterThan(0);
  });

  it("does not refetch in a loop (stable deps)", async () => {
    mocked.getPortfolio.mockResolvedValue({
      data: { total_value: 1, assets: [] },
    } as never);

    const { result } = renderHook(() => usePortfolioData("0xPROVIDED"));
    await waitFor(() => expect(result.current.loading).toBe(false));
    // A short settle window: the unstable-dependency bug in the original web
    // hook refetched on every render.
    await new Promise((r) => setTimeout(r, 50));
    expect(mocked.getPortfolio).toHaveBeenCalledTimes(1);
  });
});

describe("useTransactionHistory", () => {
  beforeEach(() => jest.clearAllMocks());

  it("fetches transactions", async () => {
    const txs = [{ id: "1", type: "send" }];
    mocked.getTransactions.mockResolvedValue({ data: txs } as never);

    const { result } = renderHook(() => useTransactionHistory("0xW"));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.transactions).toEqual(txs);
  });

  it("falls back to mock transactions on failure", async () => {
    mocked.getTransactions.mockRejectedValue(new Error("fail"));

    const { result } = renderHook(() => useTransactionHistory("0xW"));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.transactions.length).toBeGreaterThan(0);
  });
});
