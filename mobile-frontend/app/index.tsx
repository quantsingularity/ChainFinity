import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useApp } from "../src/context/AppContext";
import { colors } from "../src/theme/colors";

export default function HomeScreen() {
  const router = useRouter();
  const { isAuthenticated } = useApp();

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>ChainFinity</Text>
      <Text style={styles.tagline}>
        Cross-chain DeFi risk management in your pocket
      </Text>
      <Text style={styles.subtitle}>
        Track portfolios, monitor transactions, and manage risk across chains.
      </Text>

      {isAuthenticated ? (
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push("/dashboard")}
          accessibilityRole="button"
          accessibilityLabel="Go to dashboard"
        >
          <Text style={styles.primaryButtonText}>Go to Dashboard</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push("/login")}
            accessibilityRole="button"
            accessibilityLabel="Sign in"
          >
            <Text style={styles.primaryButtonText}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push("/register")}
            accessibilityRole="button"
            accessibilityLabel="Create account"
          >
            <Text style={styles.secondaryButtonText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  logo: {
    fontSize: 36,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 12,
  },
  tagline: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 32,
  },
  buttonRow: { width: "100%", gap: 12 },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    width: "100%",
  },
  primaryButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  secondaryButton: {
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    width: "100%",
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
});
