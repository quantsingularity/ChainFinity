import SearchIcon from "@mui/icons-material/Search";
import SortNameIcon from "@mui/icons-material/SortByAlpha";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";

const Portfolio = ({ fetchData }) => {
  const theme = useTheme();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortMode, setSortMode] = useState("none");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const result = fetchData
          ? await fetchData()
          : [
              {
                id: "1",
                name: "Bitcoin",
                value: 50000,
                symbol: "BTC",
                change: 3.2,
              },
              {
                id: "2",
                name: "Ethereum",
                value: 3000,
                symbol: "ETH",
                change: -1.4,
              },
              {
                id: "3",
                name: "Chainlink",
                value: 18,
                symbol: "LINK",
                change: 5.7,
              },
              {
                id: "4",
                name: "Uniswap",
                value: 8,
                symbol: "UNI",
                change: -0.8,
              },
            ];
        setData(result);
      } catch (_err) {
        setError("Failed to fetch portfolio data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [fetchData]);

  const handleSortByName = () => setSortMode("name");
  const handleSortByValue = () => setSortMode("value");

  const filteredData = data
    ? (() => {
        let arr = data.filter((token) =>
          token.name.toLowerCase().includes(searchTerm.toLowerCase()),
        );
        if (sortMode === "name")
          arr = [...arr].sort((a, b) => a.name.localeCompare(b.name));
        if (sortMode === "value")
          arr = [...arr].sort((a, b) => b.value - a.value);
        return arr;
      })()
    : [];

  const totalValue = filteredData.reduce((sum, t) => sum + t.value, 0);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: "none",
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            Portfolio Value
          </Typography>
          <Typography variant="h6" fontWeight={700} color="primary">
            ${totalValue.toLocaleString()}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
          <TextField
            size="small"
            placeholder="Search tokens"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ flex: 1, minWidth: 150 }}
          />
          <ButtonGroup size="small" variant="outlined">
            <Button
              onClick={handleSortByName}
              variant={sortMode === "name" ? "contained" : "outlined"}
              startIcon={<SortNameIcon fontSize="small" />}
            >
              Name
            </Button>
            <Button
              onClick={handleSortByValue}
              variant={sortMode === "value" ? "contained" : "outlined"}
              startIcon={<TrendingUpIcon fontSize="small" />}
            >
              Value
            </Button>
          </ButtonGroup>
        </Box>

        {filteredData.length > 0 ? (
          <Grid container spacing={1.5}>
            {filteredData.map((token) => (
              <Grid item xs={12} sm={6} key={token.id}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    p: 1.5,
                    borderRadius: 2,
                    border: `1px solid ${theme.palette.divider}`,
                    "&:hover": { bgcolor: "action.hover" },
                    transition: "background-color 0.2s",
                  }}
                >
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: "primary.main",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                    }}
                  >
                    {token.symbol.slice(0, 2)}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" fontWeight={600}>
                      {token.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {token.symbol}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: "right" }}>
                    <Typography variant="body2" fontWeight={700}>
                      ${token.value.toLocaleString()}
                    </Typography>
                    {token.change !== undefined && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-end",
                          gap: 0.3,
                        }}
                      >
                        {token.change >= 0 ? (
                          <TrendingUpIcon fontSize="inherit" color="success" />
                        ) : (
                          <TrendingDownIcon fontSize="inherit" color="error" />
                        )}
                        <Typography
                          variant="caption"
                          color={
                            token.change >= 0 ? "success.main" : "error.main"
                          }
                          fontWeight={600}
                        >
                          {Math.abs(token.change)}%
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography color="text.secondary">No tokens found.</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default Portfolio;
