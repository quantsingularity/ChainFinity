import { BrowserProvider } from "ethers";
import { useEffect, useState } from "react";

// Configuration
const POLLING_INTERVAL = 15000;

/**
 * Returns an ethers v6 BrowserProvider for the injected wallet.
 *
 * Note: the previous version passed a `getLibrary` prop to
 * @web3-react/core's Web3ReactProvider. That prop only exists in
 * @web3-react v6; the installed v8 requires a `connectors` array instead,
 * so the old code would have thrown at runtime the moment it was mounted.
 * Since this app talks to the wallet through ethers directly, the wrapper
 * no longer depends on @web3-react at all.
 */
export function getProvider() {
  if (typeof window === "undefined" || !window.ethereum) {
    return null;
  }
  try {
    const provider = new BrowserProvider(window.ethereum);
    provider.pollingInterval = POLLING_INTERVAL;
    return provider;
  } catch (error) {
    console.error("Error initializing Web3 provider:", error);
    return null;
  }
}

/**
 * Wraps the app with wallet event handling.
 *
 * - `chainChanged` (the supported MetaMask event; `networkChanged` was
 *   removed years ago) surfaces a reconnect prompt, since providers must be
 *   re-created after a chain switch.
 * - `accountsChanged` is a normal user action (switching accounts), NOT an
 *   error; the previous version showed a "Network connection error" for it.
 */
export function Web3Wrapper({ children }) {
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!window.ethereum) return undefined;

    const handleChainChanged = () => {
      setError("Network changed. Please reconnect your wallet to continue.");
    };

    const handleAccountsChanged = (accounts) => {
      // Empty array means the wallet was disconnected/locked.
      if (!accounts || accounts.length === 0) {
        setError("Wallet disconnected. Please reconnect to continue.");
      }
    };

    window.ethereum.on("chainChanged", handleChainChanged);
    window.ethereum.on("accountsChanged", handleAccountsChanged);

    return () => {
      window.ethereum.removeListener("chainChanged", handleChainChanged);
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
    };
  }, []);

  if (error) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h3>Connection Error</h3>
        <p>{error}</p>
        <button onClick={() => setError(null)}>Try Again</button>
      </div>
    );
  }

  return children;
}
