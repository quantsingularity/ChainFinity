import React, { useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  AllocationBar,
  ProgressBar,
  RiskRing,
  Sparkline,
} from "../src/components/charts";
import {
  AppText,
  Card,
  GradientCard,
  Screen,
  SectionHeader,
} from "../src/components/ui";
import {
  OVERALL_RISK_SCORE,
  PORTFOLIO_HISTORY,
  RISK_METRICS,
} from "../src/hooks/useGovernanceData";
import { usePortfolioData } from "../src/hooks/useProtocolData";
import { useTheme } from "../src/theme/ThemeContext";
import { radius, spacing } from "../src/theme/theme";
import { formatCurrency } from "../src/utils/helpers";

type Tab = "overview" | "assets" | "risk";
const TABS: { key: Tab; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "assets", label: "Assets" },
  { key: "risk", label: "Risk" },
];

export default function PortfolioScreen() {
  const { theme } = useTheme();
  const { portfolioData, loading, refreshPortfolio } = usePortfolioData();
  const [tab, setTab] = useState<Tab>("overview");

  if (loading && !portfolioData) {
    return (
      <Screen>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </Screen>
    );
  }

  const assets = portfolioData?.assets ?? [];
  const total = portfolioData?.total_value ?? 0;
  const slices = assets.map((a) => ({
    label: a.symbol,
    value: a.value,
    color: a.color,
  }));
  const best = [...assets].sort((a, b) => b.change_24h - a.change_24h)[0];
  const worst = [...assets].sort((a, b) => a.change_24h - b.change_24h)[0];

  return (
    <Screen scroll edges={["bottom"]}>
      <ScrollView
        scrollEnabled={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refreshPortfolio}
            tintColor={theme.colors.primary}
          />
        }
      >
        <GradientCard>
          <Text style={styles.totalLabel}>Portfolio Value</Text>
          <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
          <View style={{ marginTop: spacing.md }}>
            <Sparkline data={PORTFOLIO_HISTORY} color="#ffffff" height={48} />
          </View>
        </GradientCard>

        <View style={styles.tabRow}>
          {TABS.map((t) => {
            const active = tab === t.key;
            return (
              <TouchableOpacity
                key={t.key}
                onPress={() => setTab(t.key)}
                style={[
                  styles.tab,
                  active && { backgroundColor: theme.colors.primary },
                  !active && { backgroundColor: theme.colors.surfaceLight },
                ]}
              >
                <Text
                  style={{
                    color: active ? "#fff" : theme.colors.textSecondary,
                    fontWeight: active ? "700" : "500",
                  }}
                >
                  {t.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {tab === "overview" && (
          <View>
            <View style={styles.statRow}>
              <Card style={styles.statCard}>
                <AppText variant="caption" color="secondary">
                  Assets
                </AppText>
                <AppText variant="h2">{assets.length}</AppText>
              </Card>
              <Card style={styles.statCard}>
                <AppText variant="caption" color="secondary">
                  24h change
                </AppText>
                <AppText variant="h2" color="success">
                  +2.9%
                </AppText>
              </Card>
            </View>
            {best && worst && (
              <View style={styles.statRow}>
                <Card style={styles.statCard}>
                  <AppText variant="caption" color="secondary">
                    Top gainer
                  </AppText>
                  <AppText variant="bodyStrong">{best.symbol}</AppText>
                  <AppText variant="caption" color="success">
                    +{best.change_24h}%
                  </AppText>
                </Card>
                <Card style={styles.statCard}>
                  <AppText variant="caption" color="secondary">
                    Top loser
                  </AppText>
                  <AppText variant="bodyStrong">{worst.symbol}</AppText>
                  <AppText variant="caption" color="error">
                    {worst.change_24h}%
                  </AppText>
                </Card>
              </View>
            )}
            <Card style={{ marginTop: spacing.md }}>
              <SectionHeader title="Allocation" />
              <AllocationBar slices={slices} />
            </Card>
          </View>
        )}

        {tab === "assets" && (
          <Card
            padded={false}
            style={{ padding: spacing.xs, marginTop: spacing.xs }}
          >
            {assets.map((a, i) => (
              <View key={a.symbol}>
                <View style={styles.assetItem}>
                  <View
                    style={[styles.assetDot, { backgroundColor: a.color }]}
                  />
                  <View style={{ flex: 1 }}>
                    <AppText variant="bodyStrong">{a.name}</AppText>
                    <AppText variant="caption" color="secondary">
                      {a.balance} {a.symbol}
                    </AppText>
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <AppText variant="bodyStrong">
                      {formatCurrency(a.value)}
                    </AppText>
                    <Text
                      style={{
                        fontSize: 12,
                        marginTop: 2,
                        color:
                          a.change_24h >= 0
                            ? theme.colors.success
                            : theme.colors.error,
                      }}
                    >
                      {a.change_24h >= 0 ? "+" : ""}
                      {a.change_24h}%
                    </Text>
                  </View>
                </View>
                {i < assets.length - 1 && (
                  <View
                    style={[
                      styles.divider,
                      { backgroundColor: theme.colors.divider },
                    ]}
                  />
                )}
              </View>
            ))}
          </Card>
        )}

        {tab === "risk" && (
          <Card style={{ marginTop: spacing.xs }}>
            <View style={{ alignItems: "center", marginBottom: spacing.lg }}>
              <RiskRing score={OVERALL_RISK_SCORE} size={130} />
            </View>
            {RISK_METRICS.map((m) => (
              <View key={m.label} style={{ marginBottom: spacing.md }}>
                <View style={styles.metricLabelRow}>
                  <AppText variant="caption" color="secondary">
                    {m.label}
                  </AppText>
                  <AppText variant="caption" color="secondary">
                    {m.value}/100
                  </AppText>
                </View>
                <ProgressBar value={m.value} color={theme.colors[m.tone]} />
              </View>
            ))}
          </Card>
        )}

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  totalLabel: { color: "rgba(255,255,255,0.85)", fontSize: 13 },
  totalValue: { color: "#fff", fontSize: 32, fontWeight: "800", marginTop: 6 },
  tabRow: { flexDirection: "row", gap: spacing.sm, marginVertical: spacing.lg },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: radius.md,
  },
  statRow: { flexDirection: "row", gap: spacing.md, marginBottom: spacing.md },
  statCard: { flex: 1 },
  assetItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
  },
  assetDot: { width: 12, height: 12, borderRadius: 6, marginRight: 12 },
  divider: { height: StyleSheet.hairlineWidth, marginHorizontal: spacing.md },
  metricLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
});
