import BridgeIcon from "@mui/icons-material/CompareArrows";
import CheckIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import RefreshIcon from "@mui/icons-material/Refresh";
import PendingIcon from "@mui/icons-material/Schedule";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";
import { useState } from "react";

const NETWORKS = [
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    color: "#627eea",
    tvl: "$12.4M",
    status: "active",
  },
  {
    id: "polygon",
    name: "Polygon",
    symbol: "MATIC",
    color: "#8247e5",
    tvl: "$3.2M",
    status: "active",
  },
  {
    id: "arbitrum",
    name: "Arbitrum",
    symbol: "ARB",
    color: "#28a0f0",
    tvl: "$5.8M",
    status: "active",
  },
  {
    id: "optimism",
    name: "Optimism",
    symbol: "OP",
    color: "#ff0420",
    tvl: "$2.1M",
    status: "pending",
  },
  {
    id: "bsc",
    name: "BNB Chain",
    symbol: "BNB",
    color: "#f3ba2f",
    tvl: "$1.5M",
    status: "active",
  },
];

const RECENT_BRIDGES = [
  {
    id: "1",
    from: "Ethereum",
    to: "Polygon",
    amount: "1.5 ETH",
    status: "completed",
    time: "5 min ago",
  },
  {
    id: "2",
    from: "Polygon",
    to: "Arbitrum",
    amount: "500 USDC",
    status: "pending",
    time: "12 min ago",
  },
  {
    id: "3",
    from: "Arbitrum",
    to: "Ethereum",
    amount: "0.8 ETH",
    status: "completed",
    time: "1 hr ago",
  },
  {
    id: "4",
    from: "BNB Chain",
    to: "Ethereum",
    amount: "2.0 BNB",
    status: "failed",
    time: "2 hr ago",
  },
];

const statusIcon = (status) => {
  if (status === "completed")
    return <CheckIcon fontSize="small" color="success" />;
  if (status === "pending")
    return <PendingIcon fontSize="small" color="warning" />;
  return <ErrorIcon fontSize="small" color="error" />;
};

const statusChipColor = (status) => {
  if (status === "completed" || status === "active") return "success";
  if (status === "pending") return "warning";
  return "error";
};

const CrossChainDashboard = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);

  const totalTVL = "$25.0M";
  const activeBridges = NETWORKS.filter((n) => n.status === "active").length;

  const handleRefresh = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
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
          <BridgeIcon color="primary" />
          <Typography variant="h6" fontWeight={600}>
            Cross-Chain Dashboard
          </Typography>
          <Box sx={{ flex: 1 }} />
          <Button
            size="small"
            startIcon={
              loading ? <CircularProgress size={14} /> : <RefreshIcon />
            }
            onClick={handleRefresh}
            disabled={loading}
          >
            Refresh
          </Button>
        </Box>

        {/* Summary Stats */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} sm={3}>
            <Box
              sx={{
                textAlign: "center",
                p: 1.5,
                borderRadius: 2,
                bgcolor: "action.hover",
              }}
            >
              <Typography variant="h6" fontWeight={700} color="primary">
                {totalTVL}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total TVL
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box
              sx={{
                textAlign: "center",
                p: 1.5,
                borderRadius: 2,
                bgcolor: "action.hover",
              }}
            >
              <Typography variant="h6" fontWeight={700} color="success.main">
                {activeBridges}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Active Chains
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box
              sx={{
                textAlign: "center",
                p: 1.5,
                borderRadius: 2,
                bgcolor: "action.hover",
              }}
            >
              <Typography variant="h6" fontWeight={700} color="warning.main">
                1
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Pending Bridges
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box
              sx={{
                textAlign: "center",
                p: 1.5,
                borderRadius: 2,
                bgcolor: "action.hover",
              }}
            >
              <Typography variant="h6" fontWeight={700}>
                {NETWORKS.length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Supported Chains
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Network Status */}
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
          Network Status
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 3 }}>
          {NETWORKS.map((network) => (
            <Box
              key={network.id}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 1.5,
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  backgroundColor: network.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="caption" color="white" fontWeight={700}>
                  {network.symbol.slice(0, 2)}
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" fontWeight={600}>
                  {network.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  TVL: {network.tvl}
                </Typography>
              </Box>
              <Chip
                label={network.status}
                size="small"
                color={statusChipColor(network.status)}
                variant="outlined"
              />
            </Box>
          ))}
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Recent Bridge Activity */}
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
          Recent Bridge Activity
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {RECENT_BRIDGES.map((bridge) => (
            <Box
              key={bridge.id}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                p: 1.5,
                borderRadius: 2,
                bgcolor: "action.hover",
              }}
            >
              {statusIcon(bridge.status)}
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" fontWeight={500}>
                  {bridge.from} → {bridge.to}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {bridge.amount} · {bridge.time}
                </Typography>
              </Box>
              <Chip
                label={bridge.status}
                size="small"
                color={statusChipColor(bridge.status)}
                variant="outlined"
              />
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default CrossChainDashboard;
