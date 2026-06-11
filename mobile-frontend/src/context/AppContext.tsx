import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  ApiErrorInfo,
  authAPI,
  handleApiError,
  LoginCredentials,
  RegisterData,
  TOKEN_KEY,
  USER_KEY,
} from "../services/api";

export interface User {
  id: string;
  name?: string;
  email: string;
  wallet_address?: string;
}

interface AppContextValue {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: ApiErrorInfo | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (
    data: RegisterData,
  ) => Promise<{ success: boolean; error?: ApiErrorInfo }>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiErrorInfo | null>(null);

  const logout = useCallback(async () => {
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  // Restore the session from AsyncStorage on app start, then verify the
  // token with the backend. Verification failures other than an explicit
  // 401 keep the cached session (offline tolerance).
  useEffect(() => {
    const initAuth = async () => {
      try {
        const [token, storedUser] = await Promise.all([
          AsyncStorage.getItem(TOKEN_KEY),
          AsyncStorage.getItem(USER_KEY),
        ]);
        if (token && storedUser) {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
          try {
            const response = await authAPI.getCurrentUser();
            setUser(response.data);
            await AsyncStorage.setItem(USER_KEY, JSON.stringify(response.data));
          } catch (verifyErr) {
            const info = handleApiError(verifyErr);
            if (info.status === 401) {
              await logout();
            }
          }
        }
      } catch {
        await logout();
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, [logout]);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setLoading(true);
    setError(null);

    // Demo mode: allow exploring the app without a backend.
    const isDemo =
      credentials.email === "guest@chainfinity.io" ||
      credentials.email === "demo@chainfinity.io";
    if (isDemo) {
      const demoUser: User = {
        id: "demo-user",
        name: "Demo User",
        email: credentials.email,
        wallet_address: "0xDEMO1234567890abcdef1234567890abcdef1234",
      };
      await AsyncStorage.setItem(TOKEN_KEY, "demo-token");
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(demoUser));
      setUser(demoUser);
      setIsAuthenticated(true);
      setLoading(false);
      return true;
    }

    try {
      const response = await authAPI.login(credentials);
      const { access_token: accessToken } = response.data;
      await AsyncStorage.setItem(TOKEN_KEY, accessToken);

      const userResponse = await authAPI.getCurrentUser();
      setUser(userResponse.data);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(userResponse.data));

      setIsAuthenticated(true);
      setLoading(false);
      return true;
    } catch (err) {
      setError(handleApiError(err));
      setLoading(false);
      return false;
    }
  };

  const register = async (data: RegisterData) => {
    setLoading(true);
    setError(null);
    try {
      await authAPI.register(data);
      setLoading(false);
      return { success: true };
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError);
      setLoading(false);
      return { success: false, error: apiError };
    }
  };

  const clearError = () => setError(null);

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextValue => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

export default AppContext;
