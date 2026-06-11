import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
import LoginScreen from "../../app/login";
import DashboardScreen from "../../app/dashboard";
import TransactionsScreen from "../../app/transactions";
import { AppProvider } from "../context/AppContext";

jest.mock("../services/api", () => {
  const actual = jest.requireActual("../services/api");
  return {
    ...actual,
    authAPI: {
      login: jest.fn(),
      register: jest.fn(),
      getCurrentUser: jest.fn().mockRejectedValue(new Error("no token")),
    },
    blockchainAPI: {
      getPortfolio: jest.fn().mockRejectedValue(new Error("offline")),
      getTransactions: jest.fn().mockRejectedValue(new Error("offline")),
    },
  };
});

const withProvider = (ui: React.ReactElement) => (
  <AppProvider>{ui}</AppProvider>
);

describe("LoginScreen", () => {
  it("renders email and password fields", () => {
    const { getByLabelText, getByText } = render(withProvider(<LoginScreen />));
    expect(getByLabelText("Email Address")).toBeTruthy();
    expect(getByLabelText("Password")).toBeTruthy();
    expect(getByText("Sign In")).toBeTruthy();
  });

  it("shows a validation error when submitting empty form", async () => {
    const { getByText, findByText } = render(withProvider(<LoginScreen />));
    fireEvent.press(getByText("Sign In"));
    expect(await findByText("Email and password are required")).toBeTruthy();
  });
});

describe("DashboardScreen", () => {
  it("prompts unauthenticated users to sign in", async () => {
    const { findByText } = render(withProvider(<DashboardScreen />));
    expect(
      await findByText("Please sign in to view your dashboard."),
    ).toBeTruthy();
  });
});

describe("TransactionsScreen", () => {
  it("renders mock transactions and filters by type", async () => {
    const { findAllByText, getByLabelText, queryByTestId } = render(
      withProvider(<TransactionsScreen />),
    );
    // Mock data loads after the API rejects.
    const sends = await findAllByText("SEND");
    expect(sends.length).toBeGreaterThan(0);

    fireEvent.press(getByLabelText("Filter receive"));
    await waitFor(() => {
      expect(queryByTestId("tx-0xabc1")).toBeNull(); // a send tx
    });
  });

  it("filters by search term", async () => {
    const { findAllByText, getByLabelText, queryByTestId } = render(
      withProvider(<TransactionsScreen />),
    );
    await findAllByText("SEND");
    fireEvent.changeText(getByLabelText("Search transactions"), "polygon");
    await waitFor(() => {
      expect(queryByTestId("tx-0xabc2")).toBeTruthy(); // polygon tx
      expect(queryByTestId("tx-0xabc1")).toBeNull(); // ethereum tx
    });
  });
});
