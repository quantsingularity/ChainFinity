import { useRouter } from "expo-router";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useApp } from "../src/context/AppContext";
import { formatAddress } from "../src/utils/helpers";
import { colors } from "../src/theme/colors";

export default function SettingsScreen() {
  const router = useRouter();
  const { user, logout } = useApp();

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/login");
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{user?.name || "Anonymous User"}</Text>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user?.email || "-"}</Text>
        <Text style={styles.label}>Wallet</Text>
        <Text style={styles.value}>
          {user?.wallet_address
            ? formatAddress(user.wallet_address)
            : "Not connected"}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
        accessibilityRole="button"
        accessibilityLabel="Sign out"
      >
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 20 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  label: { color: colors.textSecondary, fontSize: 12, marginTop: 12 },
  value: { color: colors.textPrimary, fontSize: 16, fontWeight: "600" },
  logoutButton: {
    borderColor: colors.error,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  logoutText: { color: colors.error, fontWeight: "600", fontSize: 16 },
});
