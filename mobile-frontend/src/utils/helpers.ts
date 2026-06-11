// Shared formatting and validation helpers.

// Shorten an Ethereum address for display: 0x1234...abcd
export const formatAddress = (address?: string | null): string => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Format a raw token amount (base units) into a human-readable decimal.
// Trailing-zero trimming is applied ONLY to the fractional part so the
// integer part is never altered.
export const formatTokenAmount = (
  amount: bigint | string | number,
  decimals = 18,
): string => {
  try {
    const num = typeof amount === "bigint" ? amount : BigInt(amount);
    const divisor = BigInt(10) ** BigInt(decimals);
    const whole = num / divisor;
    const fraction = num % divisor;
    if (fraction === 0n) {
      return whole.toString();
    }
    const fractionStr = fraction
      .toString()
      .padStart(decimals, "0")
      .slice(0, 6)
      .replace(/0+$/, "");
    return fractionStr ? `${whole}.${fractionStr}` : whole.toString();
  } catch (error) {
    console.error("Error formatting token amount:", error);
    return "0";
  }
};

// Validate an Ethereum address (0x + 40 hex chars).
export const isValidAddress = (address?: string | null): boolean => {
  if (!address) return false;
  return /^0x[0-9a-fA-F]{40}$/.test(address);
};

// Format large numbers: 1.20M, 3.40K
export const formatLargeNumber = (num: number | string): string => {
  const n = Number(num);
  if (Number.isNaN(n)) return "0";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(2)}K`;
  return n.toString();
};

// Format a USD currency value.
export const formatCurrency = (value: number | string): string => {
  const num = Number(value);
  if (Number.isNaN(num)) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

// Percentage change between two values.
export const calcPercentChange = (
  current: number,
  previous: number,
): number => {
  if (!previous || previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

// Truncate text with an ellipsis.
export const truncateText = (text: string, maxLength = 50): string => {
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};
