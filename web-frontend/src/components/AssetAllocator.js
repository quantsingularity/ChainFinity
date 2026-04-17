import {
  AccountBalance as BankIcon,
  TrendingUp as TrendingUpIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  Slider,
  Typography,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const DEFAULT_ALLOCATIONS = [
  {
    id: "eth",
    name: "Ethereum",
    symbol: "ETH",
    allocation: 40,
    color: "#627eea",
    risk: "Medium",
  },
  {
    id: "btc",
    name: "Bitcoin",
    symbol: "BTC",
    allocation: 30,
    color: "#f7931a",
    risk: "Medium",
  },
  {
    id: "stables",
    name: "Stablecoins",
    symbol: "USDC/USDT",
    allocation: 20,
    color: "#2775ca",
    risk: "Low",
  },
  {
    id: "defi",
    name: "DeFi Tokens",
    symbol: "Various",
    allocation: 10,
    color: "#6c63ff",
    risk: "High",
  },
];

const AssetAllocator = () => {
  const theme = useTheme();
  const [allocations, setAllocations] = useState(DEFAULT_ALLOCATIONS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const total = allocations.reduce((sum, a) => sum + a.allocation, 0);
  const isValid = total === 100;

  const handleSliderChange = (id, value) => {
    setAllocations((prev) => {
      const updated = prev.map((a) =>
        a.id === id ? { ...a, allocation: value } : a,
      );
      return updated;
    });
    setSaved(false);
  };

  const handleReset = () => {
    setAllocations(DEFAULT_ALLOCATIONS);
    setSaved(false);
  };

  const handleSave = async () => {
    if (!isValid) return;
    setSaving(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
  };

  const riskColor = (risk) => {
    if (risk === "Low") return theme.palette.success.main;
    if (risk === "Medium") return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: "none",
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 1 }}>
          <BankIcon color="primary" />
          <Typography variant="h6" fontWeight={600}>
            Asset Allocator
          </Typography>
          <Box sx={{ flex: 1 }} />
          <Button
            size="small"
            startIcon={<RefreshIcon />}
            onClick={handleReset}
          >
            Reset
          </Button>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={allocations}
                  dataKey="allocation"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                >
                  {allocations.map((entry) => (
                    <Cell key={entry.id} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Grid>

          <Grid item xs={12} md={7}>
            {allocations.map((asset) => (
              <Box key={asset.id} sx={{ mb: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 0.5,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        backgroundColor: asset.color,
                      }}
                    />
                    <Typography variant="body2" fontWeight={500}>
                      {asset.name}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography
                      variant="caption"
                      sx={{ color: riskColor(asset.risk), fontWeight: 600 }}
                    >
                      {asset.risk}
                    </Typography>
                    <Typography variant="body2" fontWeight={700}>
                      {asset.allocation}%
                    </Typography>
                  </Box>
                </Box>
                <Slider
                  value={asset.allocation}
                  onChange={(_, v) => handleSliderChange(asset.id, v)}
                  min={0}
                  max={100}
                  step={5}
                  size="small"
                  sx={{ color: asset.color }}
                />
              </Box>
            ))}
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="body2" color="text.secondary">
              Total allocation:&nbsp;
              <Typography
                component="span"
                fontWeight={700}
                color={isValid ? "success.main" : "error.main"}
              >
                {total}%
              </Typography>
            </Typography>
            {!isValid && (
              <Typography variant="caption" color="error">
                Allocation must equal 100%
              </Typography>
            )}
          </Box>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!isValid || saving}
            startIcon={
              saving ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <TrendingUpIcon />
              )
            }
          >
            {saved ? "Saved!" : "Save Allocation"}
          </Button>
        </Box>

        {saved && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Allocation strategy saved successfully.
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default AssetAllocator;
