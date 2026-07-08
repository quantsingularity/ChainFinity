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
  AppText,
  Badge,
  Button,
  Card,
  GradientCard,
  Input,
  Screen,
  SectionHeader,
} from "../src/components/ui";
import { Proposal, useGovernanceData } from "../src/hooks/useGovernanceData";
import { useTheme } from "../src/theme/ThemeContext";
import { radius, spacing } from "../src/theme/theme";
import { formatLargeNumber } from "../src/utils/helpers";

const statusTone = (s: Proposal["status"]) =>
  s === "active"
    ? "brand"
    : s === "passed"
      ? "success"
      : s === "rejected"
        ? "error"
        : "warning";

const ProposalCard = ({
  proposal,
  onVote,
}: {
  proposal: Proposal;
  onVote: (id: string, choice: "for" | "against") => void;
}) => {
  const { theme } = useTheme();
  const total =
    proposal.forVotes + proposal.againstVotes + proposal.abstainVotes || 1;
  const forPct = (proposal.forVotes / total) * 100;
  const againstPct = (proposal.againstVotes / total) * 100;

  return (
    <Card style={{ marginBottom: spacing.md }}>
      <View style={styles.propHeader}>
        <AppText variant="caption" color="muted">
          {proposal.id}
        </AppText>
        <Badge label={proposal.status} tone={statusTone(proposal.status)} />
      </View>
      <AppText variant="h3" style={{ marginTop: 4 }}>
        {proposal.title}
      </AppText>
      <AppText variant="caption" color="secondary" style={{ marginTop: 4 }}>
        {proposal.description}
      </AppText>

      <View style={{ marginTop: spacing.md }}>
        <View style={styles.voteLabelRow}>
          <AppText variant="caption" color="success">
            For {Math.round(forPct)}%
          </AppText>
          <AppText variant="caption" color="error">
            Against {Math.round(againstPct)}%
          </AppText>
        </View>
        <View
          style={[
            styles.voteTrack,
            { backgroundColor: theme.colors.surfaceLight },
          ]}
        >
          <View
            style={{
              width: `${forPct}%`,
              backgroundColor: theme.colors.success,
            }}
          />
          <View
            style={{
              width: `${againstPct}%`,
              backgroundColor: theme.colors.error,
            }}
          />
        </View>
        <AppText variant="caption" color="muted" style={{ marginTop: 6 }}>
          {formatLargeNumber(total)} votes {"\u2022"} {proposal.endsIn}
        </AppText>
      </View>

      {proposal.status === "active" && (
        <View style={styles.voteButtons}>
          <Button
            title="Vote For"
            onPress={() => onVote(proposal.id, "for")}
            variant="secondary"
            style={{ flex: 1 }}
          />
          <Button
            title="Vote Against"
            onPress={() => onVote(proposal.id, "against")}
            variant="danger"
            style={{ flex: 1, marginLeft: spacing.md }}
          />
        </View>
      )}
    </Card>
  );
};

export default function GovernanceScreen() {
  const { theme } = useTheme();
  const { proposals, stats, loading, refresh } = useGovernanceData();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const handleVote = (id: string, choice: "for" | "against") => {
    setFeedback(`Vote "${choice}" recorded for ${id}.`);
    setTimeout(() => setFeedback(null), 2500);
  };

  const handleCreate = () => {
    if (!title.trim()) return;
    setFeedback(`Proposal "${title.trim()}" submitted.`);
    setTitle("");
    setDesc("");
    setCreating(false);
    setTimeout(() => setFeedback(null), 2500);
  };

  if (loading && proposals.length === 0) {
    return (
      <Screen>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen scroll edges={["bottom"]}>
      <ScrollView
        scrollEnabled={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refresh}
            tintColor={theme.colors.primary}
          />
        }
      >
        <GradientCard>
          <Text style={styles.vpLabel}>Your Voting Power</Text>
          <Text style={styles.vpValue}>
            {formatLargeNumber(stats?.votingPower ?? 0)} CFY
          </Text>
          <View style={styles.vpRow}>
            <View style={styles.vpStat}>
              <Text style={styles.vpStatNum}>
                {stats?.activeProposals ?? 0}
              </Text>
              <Text style={styles.vpStatLabel}>Active</Text>
            </View>
            <View style={styles.vpStat}>
              <Text style={styles.vpStatNum}>
                {formatLargeNumber(stats?.quorum ?? 0)}
              </Text>
              <Text style={styles.vpStatLabel}>Quorum</Text>
            </View>
            <View style={styles.vpStat}>
              <Text style={styles.vpStatNum}>
                {stats?.delegatedTo ? "Yes" : "No"}
              </Text>
              <Text style={styles.vpStatLabel}>Delegated</Text>
            </View>
          </View>
        </GradientCard>

        {feedback && (
          <Card
            style={{
              marginTop: spacing.md,
              backgroundColor: theme.colors.success + "1A",
              borderColor: theme.colors.success,
            }}
          >
            <AppText color="success">{feedback}</AppText>
          </Card>
        )}

        <View style={{ marginTop: spacing.lg }}>
          <SectionHeader
            title="Proposals"
            action={creating ? "Close" : "New proposal"}
            onAction={() => setCreating((c) => !c)}
          />
        </View>

        {creating && (
          <Card style={{ marginBottom: spacing.md }}>
            <Input
              label="Title"
              placeholder="Proposal title"
              value={title}
              onChangeText={setTitle}
            />
            <Input
              label="Description"
              placeholder="Describe your proposal"
              value={desc}
              onChangeText={setDesc}
              multiline
              style={{ height: 90, textAlignVertical: "top" }}
            />
            <Button title="Submit Proposal" onPress={handleCreate} />
          </Card>
        )}

        {proposals.map((p) => (
          <ProposalCard key={p.id} proposal={p} onVote={handleVote} />
        ))}

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  vpLabel: { color: "rgba(255,255,255,0.85)", fontSize: 13 },
  vpValue: { color: "#fff", fontSize: 30, fontWeight: "800", marginTop: 6 },
  vpRow: { flexDirection: "row", marginTop: spacing.lg, gap: spacing.lg },
  vpStat: { flex: 1 },
  vpStatNum: { color: "#fff", fontSize: 18, fontWeight: "700" },
  vpStatLabel: { color: "rgba(255,255,255,0.75)", fontSize: 12 },
  propHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  voteLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  voteTrack: {
    flexDirection: "row",
    height: 10,
    borderRadius: radius.pill,
    overflow: "hidden",
  },
  voteButtons: { flexDirection: "row", marginTop: spacing.md },
});
