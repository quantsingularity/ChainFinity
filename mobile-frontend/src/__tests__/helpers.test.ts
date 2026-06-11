import {
  calcPercentChange,
  formatAddress,
  formatCurrency,
  formatLargeNumber,
  formatTokenAmount,
  isValidAddress,
  truncateText,
} from "../utils/helpers";

describe("helpers", () => {
  describe("formatAddress", () => {
    it("shortens a full address", () => {
      expect(formatAddress("0x1234567890abcdef1234567890abcdef12345678")).toBe(
        "0x1234...5678",
      );
    });
    it("returns empty string for falsy input", () => {
      expect(formatAddress(null)).toBe("");
      expect(formatAddress(undefined)).toBe("");
    });
  });

  describe("formatTokenAmount", () => {
    it("formats one whole token", () => {
      expect(formatTokenAmount(10n ** 18n)).toBe("1");
    });
    it("formats fractional values", () => {
      expect(formatTokenAmount(15n * 10n ** 17n)).toBe("1.5");
    });
    it("never mutates the integer part when trimming zeros", () => {
      expect(formatTokenAmount(100n * 10n ** 18n)).toBe("100");
      expect(formatTokenAmount(10n * 10n ** 18n)).toBe("10");
    });
    it("supports custom decimals", () => {
      expect(formatTokenAmount(123456n, 6)).toBe("0.123456");
    });
    it("returns 0 for invalid input", () => {
      const spy = jest.spyOn(console, "error").mockImplementation(() => {});
      expect(formatTokenAmount("not-a-number")).toBe("0");
      spy.mockRestore();
    });
  });

  describe("isValidAddress", () => {
    it("accepts a valid address", () => {
      expect(isValidAddress("0x" + "a".repeat(40))).toBe(true);
    });
    it("rejects malformed addresses", () => {
      expect(isValidAddress("0x123")).toBe(false);
      expect(isValidAddress("nonsense")).toBe(false);
      expect(isValidAddress(null)).toBe(false);
    });
  });

  describe("formatLargeNumber", () => {
    it("formats millions and thousands", () => {
      expect(formatLargeNumber(2500000)).toBe("2.50M");
      expect(formatLargeNumber(1500)).toBe("1.50K");
      expect(formatLargeNumber(999)).toBe("999");
    });
    it("handles invalid input", () => {
      expect(formatLargeNumber("abc")).toBe("0");
    });
  });

  describe("formatCurrency", () => {
    it("formats USD", () => {
      expect(formatCurrency(1234.5)).toBe("$1,234.50");
    });
    it("handles invalid input", () => {
      expect(formatCurrency("abc")).toBe("$0.00");
    });
  });

  describe("calcPercentChange", () => {
    it("computes percent change", () => {
      expect(calcPercentChange(110, 100)).toBeCloseTo(10);
    });
    it("returns 0 when previous is 0", () => {
      expect(calcPercentChange(100, 0)).toBe(0);
    });
  });

  describe("truncateText", () => {
    it("truncates long text", () => {
      expect(truncateText("a".repeat(60), 10)).toBe("a".repeat(10) + "...");
    });
    it("leaves short text untouched", () => {
      expect(truncateText("short", 10)).toBe("short");
    });
  });
});
