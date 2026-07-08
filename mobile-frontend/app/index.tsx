import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { AppText, Button, Card, Logo, Screen } from "../src/components/ui";
import { useApp } from "../src/context/AppContext";
import { useTheme } from "../src/theme/ThemeContext";
import { brand, radius, spacing } from "../src/theme/theme";

const FEATURES: { icon: string; title: string; body: string }[] = [
  {
    icon: "\u26D3",
    title: "Multi-chain tracking",
    body: "Monitor assets across 15+ networks in one unified portfolio.",
  },
  {
    icon: "\u26A1",
    title: "Real-time risk",
    body: "AI-driven scoring flags liquidation, bridge and volatility risk.",
  },
  {
    icon: "\uD83D\uDDF3",
    title: "On-chain governance",
    body: "Review proposals and cast votes straight from your phone.",
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { isAuthenticated } = useApp();
  const { theme } = useTheme();

  return (
    <Screen scroll padded={false} edges={["bottom"]}>
      <LinearGradient
        colors={
          theme.mode === "dark"
            ? ["#161628", theme.colors.background]
            : ["#eef1ff", theme.colors.background]
        }
        style={styles.hero}
      >
        <Logo size={30} />
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Cross-chain DeFi risk platform</Text>
        </View>
        <Text style={[styles.headline, { color: theme.colors.textPrimary }]}>
          Manage crypto risk across every chain
        </Text>
        <AppText color="secondary" style={styles.sub}>
          Track portfolios, monitor transactions and act on AI-powered risk
          insights, all from one place.
        </AppText>

        <View style={styles.ctaCol}>
          {isAuthenticated ? (
            <Button
              title="Go to Dashboard"
              onPress={() => router.push("/dashboard")}
            />
          ) : (
            <>
              <Button
                title="Create Account"
                onPress={() => router.push("/register")}
              />
              <Button
                title="Sign In"
                variant="outline"
                onPress={() => router.push("/login")}
                style={{ marginTop: spacing.md }}
              />
            </>
          )}
        </View>
      </LinearGradient>

      <View style={{ padding: spacing.xl }}>
        <View style={styles.statsRow}>
          {[
            { k: "15+", v: "Chains" },
            { k: "$100M+", v: "Tracked" },
            { k: "99.9%", v: "Uptime" },
          ].map((s) => (
            <Card key={s.v} style={styles.statCard}>
              <Text style={[styles.statK, { color: theme.colors.primary }]}>
                {s.k}
              </Text>
              <AppText variant="caption" color="secondary">
                {s.v}
              </AppText>
            </Card>
          ))}
        </View>

        <AppText
          variant="h2"
          style={{ marginTop: spacing.xl, marginBottom: spacing.md }}
        >
          Everything you need
        </AppText>
        {FEATURES.map((f) => (
          <Card key={f.title} style={{ marginBottom: spacing.md }}>
            <View style={styles.featureRow}>
              <View
                style={[
                  styles.featureIcon,
                  { backgroundColor: brand.primary + "22" },
                ]}
              >
                <Text style={{ fontSize: 20 }}>{f.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <AppText variant="bodyStrong">{f.title}</AppText>
                <AppText
                  variant="caption"
                  color="secondary"
                  style={{ marginTop: 2 }}
                >
                  {f.body}
                </AppText>
              </View>
            </View>
          </Card>
        ))}

        <Card
          style={{
            marginTop: spacing.sm,
            backgroundColor: theme.colors.surface,
          }}
        >
          <AppText variant="h3" center>
            Ready to get started?
          </AppText>
          <AppText
            color="secondary"
            center
            style={{ marginTop: spacing.xs, marginBottom: spacing.lg }}
          >
            Join thousands managing DeFi risk with ChainFinity.
          </AppText>
          <Button
            title={isAuthenticated ? "Open Dashboard" : "Get Started Free"}
            onPress={() =>
              router.push(isAuthenticated ? "/dashboard" : "/register")
            }
          />
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
  },
  badge: {
    alignSelf: "flex-start",
    marginTop: spacing.xl,
    backgroundColor: brand.primary + "22",
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  badgeText: { color: brand.primary, fontWeight: "700", fontSize: 12 },
  headline: {
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: -0.5,
    marginTop: spacing.md,
  },
  sub: { marginTop: spacing.md, fontSize: 15, lineHeight: 22 },
  ctaCol: { marginTop: spacing.xl },
  statsRow: { flexDirection: "row", gap: spacing.md },
  statCard: { flex: 1, alignItems: "center" },
  statK: { fontSize: 22, fontWeight: "800" },
  featureRow: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
});
