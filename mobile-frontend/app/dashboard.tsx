import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useApp } from "../src/context/AppContext";
import { PortfolioAsset, usePortfolioData } from "../src/hooks/useProtocolData";
import { formatCurrency } from "../src/utils/helpers";
import { colors } from "../src/theme/colors";

const AssetRow = ({ asset }: { asset: PortfolioAsset }) => {
  const positive = asset.change_24h >= 0;
  return (
    <View style={styles.assetRow} testID={`asset-${asset.symbol}`}>
      <View style={[styles.assetDot, { backgroundColor: asset.color }]} />
      <View style={styles.assetInfo}>
        <Text style={styles.assetSymbol}>{asset.symbol}</Text>
        <Text style={styles.assetName}>{asset.name}</Text>
      </View>
      <View style={styles.assetValues}>
        <Text style={styles.assetValue}>{formatCurrency(asset.value)}</Text>
        <Text
          style={[
            styles.assetChange,
            { color: positive ? colors.success : colors.error },
          ]}
        >
          {positive ? "+" : ""}
          {asset.change_24h}%
        </Text>
      </View>
    </View>
  );
};

export default function DashboardScreen() {
  const router = useRouter();
  const { user, isAuthenticated } = useApp();
  const { portfolioData, loading, refreshPortfolio } = usePortfolioData();

  if (!isAuthenticated) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>Please sign in to view your dashboard.</Text>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.replace("/login")}
        >
          <Text style={styles.primaryButtonText}>Go to Sign In</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading && !portfolioData) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={portfolioData?.assets ?? []}
      keyExtractor={(item) => item.symbol}
      renderItem={({ item }) => <AssetRow asset={item} />}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={refreshPortfolio}
          tintColor={colors.primary}
        />
      }
      ListHeaderComponent={
        <View>
          <Text style={styles.greeting}>
            Welcome{user?.name ? `, ${user.name}` : ""}
          </Text>
          <View style={styles.totalCard}>
            <Text style={styles.totalLabel}>Total Portfolio Value</Text>
            <Text style={styles.totalValue} testID="total-value">
              {formatCurrency(portfolioData?.total_value ?? 0)}
            </Text>
          </View>
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push("/transactions")}
              accessibilityRole="button"
              accessibilityLabel="View transactions"
            >
              <Text style={styles.actionText}>Transactions</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push("/settings")}
              accessibilityRole="button"
              accessibilityLabel="Open settings"
            >
              <Text style={styles.actionText}>Settings</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionTitle}>Assets</Text>
        </View>
      }
      ListEmptyComponent={
        <Text style={styles.muted}>No assets in this portfolio yet.</Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 40 },
  center: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 16,
  },
  greeting: {
    color: colors.textSecondary,
    fontSize: 16,
    marginBottom: 12,
  },
  totalCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  totalLabel: { color: colors.textSecondary, fontSize: 13, marginBottom: 6 },
  totalValue: { color: colors.textPrimary, fontSize: 32, fontWeight: "700" },
  actionsRow: { flexDirection: "row", gap: 12, marginBottom: 20 },
  actionButton: {
    flex: 1,
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  actionText: { color: colors.textPrimary, fontWeight: "600" },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  assetRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  assetDot: { width: 12, height: 12, borderRadius: 6, marginRight: 12 },
  assetInfo: { flex: 1 },
  assetSymbol: { color: colors.textPrimary, fontWeight: "700", fontSize: 15 },
  assetName: { color: colors.textSecondary, fontSize: 12 },
  assetValues: { alignItems: "flex-end" },
  assetValue: { color: colors.textPrimary, fontWeight: "600" },
  assetChange: { fontSize: 12, marginTop: 2 },
  muted: { color: colors.textSecondary, textAlign: "center" },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  primaryButtonText: { color: "#fff", fontWeight: "600" },
});
