import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  AppText,
  Button,
  Card,
  Divider,
  Screen,
  SectionHeader,
} from "../src/components/ui";
import { useApp } from "../src/context/AppContext";
import { useTheme } from "../src/theme/ThemeContext";
import { radius, spacing } from "../src/theme/theme";
import { formatAddress } from "../src/utils/helpers";

const Row = ({
  label,
  description,
  value,
  onValueChange,
}: {
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}) => {
  const { theme } = useTheme();
  return (
    <View style={styles.toggleRow}>
      <View style={{ flex: 1, paddingRight: spacing.md }}>
        <AppText variant="bodyStrong">{label}</AppText>
        {description ? (
          <AppText variant="caption" color="secondary" style={{ marginTop: 2 }}>
            {description}
          </AppText>
        ) : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{
          false: theme.colors.surfaceLight,
          true: theme.colors.primary,
        }}
        thumbColor="#fff"
      />
    </View>
  );
};

export default function SettingsScreen() {
  const router = useRouter();
  const { user, logout } = useApp();
  const { theme, isDark, toggleTheme } = useTheme();

  const [priceAlerts, setPriceAlerts] = useState(true);
  const [riskAlerts, setRiskAlerts] = useState(true);
  const [governanceAlerts, setGovernanceAlerts] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);
  const [biometrics, setBiometrics] = useState(false);

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

  const initial = (user?.name || user?.email || "U")[0].toUpperCase();

  return (
    <Screen scroll edges={["bottom"]}>
      <Card>
        <View style={styles.profileRow}>
          <View
            style={[styles.avatar, { backgroundColor: theme.colors.primary }]}
          >
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <AppText variant="h3">{user?.name || "Anonymous User"}</AppText>
            <AppText variant="caption" color="secondary">
              {user?.email || "-"}
            </AppText>
            <AppText variant="caption" color="muted" style={{ marginTop: 2 }}>
              {user?.wallet_address
                ? formatAddress(user.wallet_address)
                : "No wallet connected"}
            </AppText>
          </View>
        </View>
      </Card>

      <View style={{ marginTop: spacing.lg }}>
        <SectionHeader title="Appearance" />
        <Card>
          <Row
            label="Dark mode"
            description="Use a dark theme across the app"
            value={isDark}
            onValueChange={toggleTheme}
          />
        </Card>
      </View>

      <View style={{ marginTop: spacing.lg }}>
        <SectionHeader title="Notifications" />
        <Card>
          <Row
            label="Price alerts"
            description="Notify on significant price moves"
            value={priceAlerts}
            onValueChange={setPriceAlerts}
          />
          <Divider />
          <Row
            label="Risk alerts"
            description="Liquidation and volatility warnings"
            value={riskAlerts}
            onValueChange={setRiskAlerts}
          />
          <Divider />
          <Row
            label="Governance"
            description="New proposals and voting reminders"
            value={governanceAlerts}
            onValueChange={setGovernanceAlerts}
          />
        </Card>
      </View>

      <View style={{ marginTop: spacing.lg }}>
        <SectionHeader title="Security" />
        <Card>
          <Row
            label="Two-factor auth"
            description="Add an extra layer of protection"
            value={twoFactor}
            onValueChange={setTwoFactor}
          />
          <Divider />
          <Row
            label="Biometric unlock"
            description="Use Face ID or fingerprint"
            value={biometrics}
            onValueChange={setBiometrics}
          />
          <Divider />
          <TouchableOpacity
            style={styles.linkRow}
            onPress={() => router.push("/forgot-password")}
          >
            <AppText variant="bodyStrong">Change password</AppText>
            <AppText color="muted">{"\u203A"}</AppText>
          </TouchableOpacity>
        </Card>
      </View>

      <View style={{ marginTop: spacing.lg }}>
        <SectionHeader title="Account" />
        <Card>
          <TouchableOpacity
            style={styles.linkRow}
            onPress={() => router.push("/portfolio")}
          >
            <AppText variant="bodyStrong">Manage portfolio</AppText>
            <AppText color="muted">{"\u203A"}</AppText>
          </TouchableOpacity>
          <Divider />
          <TouchableOpacity
            style={styles.linkRow}
            onPress={() => router.push("/governance")}
          >
            <AppText variant="bodyStrong">Governance</AppText>
            <AppText color="muted">{"\u203A"}</AppText>
          </TouchableOpacity>
        </Card>
      </View>

      <Button
        title="Sign Out"
        variant="danger"
        onPress={handleLogout}
        accessibilityLabel="Sign out"
        style={{ marginTop: spacing.xl }}
      />

      <AppText
        variant="caption"
        color="muted"
        center
        style={{ marginTop: spacing.lg }}
      >
        ChainFinity v1.0.0
      </AppText>
      <View style={{ height: spacing.xl }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  profileRow: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  avatarText: { color: "#fff", fontSize: 22, fontWeight: "800" },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.md,
  },
});
