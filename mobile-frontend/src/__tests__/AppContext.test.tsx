import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import React from "react";
import { AppProvider, useApp } from "../context/AppContext";
import { authAPI } from "../services/api";

jest.mock("../services/api", () => {
  const actual = jest.requireActual("../services/api");
  return {
    ...actual,
    authAPI: {
      login: jest.fn(),
      register: jest.fn(),
      getCurrentUser: jest.fn(),
    },
  };
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppProvider>{children}</AppProvider>
);

const mockedAuth = authAPI as jest.Mocked<typeof authAPI>;

describe("AppContext", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await AsyncStorage.clear();
    mockedAuth.getCurrentUser.mockRejectedValue(new Error("no token"));
  });

  it("starts unauthenticated", async () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it("logs in against the backend and persists the session", async () => {
    mockedAuth.login.mockResolvedValue({
      data: { access_token: "tok123", token_type: "Bearer" },
    } as never);
    mockedAuth.getCurrentUser.mockResolvedValue({
      data: { id: "1", email: "a@b.com", name: "A" },
    } as never);

    const { result } = renderHook(() => useApp(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));

    let ok = false;
    await act(async () => {
      ok = await result.current.login({ email: "a@b.com", password: "pw" });
    });

    expect(ok).toBe(true);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.email).toBe("a@b.com");
    expect(await AsyncStorage.getItem("chainfinity.token")).toBe("tok123");
  });

  it("supports demo login without a backend", async () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));

    let ok = false;
    await act(async () => {
      ok = await result.current.login({
        email: "guest@chainfinity.io",
        password: "anything",
      });
    });

    expect(ok).toBe(true);
    expect(result.current.user?.id).toBe("demo-user");
    expect(mockedAuth.login).not.toHaveBeenCalled();
  });

  it("sets error and returns false on failed login", async () => {
    mockedAuth.login.mockRejectedValue({
      response: { status: 401, data: { detail: "Bad credentials" } },
    });

    const { result } = renderHook(() => useApp(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));

    let ok = true;
    await act(async () => {
      ok = await result.current.login({ email: "x@x.com", password: "bad" });
    });

    expect(ok).toBe(false);
    expect(result.current.error?.message).toBe("Bad credentials");
    expect(result.current.isAuthenticated).toBe(false);
  });

  it("logout clears state and storage", async () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.login({
        email: "demo@chainfinity.io",
        password: "x",
      });
    });
    expect(result.current.isAuthenticated).toBe(true);

    await act(async () => {
      await result.current.logout();
    });
    expect(result.current.isAuthenticated).toBe(false);
    expect(await AsyncStorage.getItem("chainfinity.token")).toBeNull();
  });

  it("restores a cached session from storage", async () => {
    await AsyncStorage.setItem("chainfinity.token", "cached");
    await AsyncStorage.setItem(
      "chainfinity.user",
      JSON.stringify({ id: "9", email: "cached@b.com" }),
    );
    // Verification fails with a network error: cached session is kept.
    mockedAuth.getCurrentUser.mockRejectedValue({ request: {} });

    const { result } = renderHook(() => useApp(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.email).toBe("cached@b.com");
  });

  it("drops the session when verification returns 401", async () => {
    await AsyncStorage.setItem("chainfinity.token", "stale");
    await AsyncStorage.setItem(
      "chainfinity.user",
      JSON.stringify({ id: "9", email: "stale@b.com" }),
    );
    mockedAuth.getCurrentUser.mockRejectedValue({
      response: { status: 401, data: {} },
    });

    const { result } = renderHook(() => useApp(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));
    await waitFor(() => expect(result.current.isAuthenticated).toBe(false));
  });

  it("register returns success", async () => {
    mockedAuth.register.mockResolvedValue({ data: { id: "1" } } as never);
    const { result } = renderHook(() => useApp(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));

    let res: { success: boolean } = { success: false };
    await act(async () => {
      res = await result.current.register({
        email: "new@b.com",
        password: "Password1!",
      });
    });
    expect(res.success).toBe(true);
  });

  it("throws when useApp is used outside the provider", () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => useApp())).toThrow(
      "useApp must be used within an AppProvider",
    );
    spy.mockRestore();
  });
});
