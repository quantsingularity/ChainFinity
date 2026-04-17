import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Box,
  Card,
  CardContent,
  Tab,
  Tabs,
  Typography,
  useTheme,
} from "@mui/material";
import { useState } from "react";

const GovernanceAnalytics = ({ governanceData }) => {
  const theme = useTheme();
  const [tab, setTab] = useState(0);

  const participationData = [
    { month: "Jan", participation: 45 },
    { month: "Feb", participation: 52 },
    { month: "Mar", participation: 48 },
    { month: "Apr", participation: 61 },
    { month: "May", participation: 58 },
    { month: "Jun", participation: 65 },
  ];

  const proposalStatusData = [
    { name: "Passed", value: 24, color: "#10b981" },
    { name: "Failed", value: 8, color: "#ef4444" },
    { name: "Pending", value: 3, color: "#f59e0b" },
    { name: "Executed", value: 18, color: "#3b82f6" },
  ];

  const votingDistributionData = [
    { name: "Top 10 Holders", value: 42, color: "#8b5cf6" },
    { name: "Next 40 Holders", value: 28, color: "#6366f1" },
    { name: "Remaining Holders", value: 30, color: "#a78bfa" },
  ];

  return (
    <Card
      sx={{
        border: (t) => `1px solid ${t.palette.divider}`,
        boxShadow: "none",
      }}
    >
      <CardContent>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Governance Analytics
        </Typography>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
          <Tab label="Participation" />
          <Tab label="Proposals" />
          <Tab label="Voting Distribution" />
        </Tabs>

        {tab === 0 && (
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Monthly participation rate (%)
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={participationData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={theme.palette.divider}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fill: theme.palette.text.secondary }}
                />
                <YAxis tick={{ fill: theme.palette.text.secondary }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                />
                <Bar
                  dataKey="participation"
                  fill={theme.palette.primary.main}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        )}

        {tab === 1 && (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={proposalStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {proposalStatusData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        )}

        {tab === 2 && (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={votingDistributionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {votingDistributionData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default GovernanceAnalytics;
