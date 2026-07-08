import LayersIcon from "@mui/icons-material/Layers";
import SecurityIcon from "@mui/icons-material/Security";
import SpeedIcon from "@mui/icons-material/Speed";
import SwapIcon from "@mui/icons-material/SwapHoriz";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import WalletIcon from "@mui/icons-material/AccountBalanceWallet";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  Paper,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

const HeroSection = styled(Box)(({ theme }) => ({
  position: "relative",
  padding: theme.spacing(12, 0, 8),
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(8, 0, 6),
  },
  overflow: "hidden",
  background:
    theme.palette.mode === "light"
      ? "linear-gradient(135deg, #f8f9fc 0%, #eef1f8 100%)"
      : "linear-gradient(135deg, #121212 0%, #1e1e2d 100%)",
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: "100%",
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: theme.shadows[8],
  },
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(45deg, #3a36e0 0%, #6c63ff 100%)",
  color: "#ffffff",
  padding: theme.spacing(1.5, 3),
  "&:hover": {
    background: "linear-gradient(45deg, #2a26a0 0%, #4b44b3 100%)",
  },
}));

const OutlinedButton = styled(Button)(({ theme }) => ({
  borderColor: theme.palette.mode === "light" ? "#3a36e0" : "#6c63ff",
  color: theme.palette.mode === "light" ? "#3a36e0" : "#6c63ff",
  padding: theme.spacing(1.5, 3),
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "light"
        ? "rgba(58, 54, 224, 0.08)"
        : "rgba(108, 99, 255, 0.08)",
  },
}));

const FeatureIcon = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  width: 56,
  height: 56,
  marginBottom: theme.spacing(2),
}));

const StatsCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: "none",
  border: `1px solid ${theme.palette.divider}`,
  height: "100%",
}));

const Home = () => {
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    // Show success state and clear email field
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 4000);
    // Here you would typically make an API call to subscribe the user
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <Box>
      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="lg">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <motion.div variants={itemVariants}>
                  <Typography
                    variant="h2"
                    component="h1"
                    fontWeight={700}
                    gutterBottom
                    sx={{
                      background:
                        "linear-gradient(45deg, #3a36e0 0%, #6c63ff 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Track Your Crypto Portfolio with Ease
                  </Typography>
                  <Typography variant="h6" color="text.secondary" paragraph>
                    ChainFinity is a powerful blockchain portfolio tracker and
                    DeFi analytics platform that helps you monitor your assets
                    across multiple chains in one place.
                  </Typography>
                  <Box
                    sx={{
                      mt: 4,
                      display: "flex",
                      gap: 2,
                      flexWrap: { xs: "wrap", sm: "nowrap" },
                    }}
                  >
                    <GradientButton
                      variant="contained"
                      size="large"
                      component={RouterLink}
                      to="/dashboard"
                    >
                      Get Started
                    </GradientButton>
                    <OutlinedButton
                      variant="outlined"
                      size="large"
                      component={RouterLink}
                      to="/login"
                    >
                      Log In
                    </OutlinedButton>
                  </Box>
                </motion.div>
              </Grid>
              <Grid item xs={12} md={6}>
                <motion.div
                  variants={itemVariants}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                  }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      width: "100%",
                      maxWidth: 460,
                      p: 3,
                      borderRadius: 4,
                      border: `1px solid ${theme.palette.divider}`,
                      boxShadow:
                        theme.palette.mode === "light"
                          ? "0 24px 60px rgba(58, 54, 224, 0.15)"
                          : "0 24px 60px rgba(0, 0, 0, 0.45)",
                    }}
                  >
                    <Box
                      sx={{
                        borderRadius: 3,
                        p: 3,
                        color: "#fff",
                        background:
                          "linear-gradient(135deg, #3a36e0 0%, #6c63ff 100%)",
                      }}
                    >
                      <Typography variant="body2" sx={{ opacity: 0.85 }}>
                        Total Portfolio Value
                      </Typography>
                      <Typography
                        variant="h4"
                        fontWeight={800}
                        sx={{ mt: 0.5 }}
                      >
                        $24,850.42
                      </Typography>
                      <Box
                        sx={{
                          mt: 2,
                          display: "flex",
                          alignItems: "flex-end",
                          gap: 0.75,
                          height: 56,
                        }}
                      >
                        {[40, 55, 48, 70, 82, 68, 95].map((h, i) => (
                          <Box
                            key={i}
                            sx={{
                              flex: 1,
                              height: `${h}%`,
                              borderRadius: 1,
                              backgroundColor:
                                i === 6 ? "#ffffff" : "rgba(255,255,255,0.45)",
                            }}
                          />
                        ))}
                      </Box>
                    </Box>

                    {[
                      {
                        s: "ETH",
                        n: "Ethereum",
                        v: "$12,600",
                        c: "+2.4%",
                        up: true,
                      },
                      {
                        s: "BTC",
                        n: "Bitcoin",
                        v: "$9,720",
                        c: "-0.8%",
                        up: false,
                      },
                      {
                        s: "LINK",
                        n: "Chainlink",
                        v: "$1,680",
                        c: "+5.1%",
                        up: true,
                      },
                    ].map((row) => (
                      <Box
                        key={row.s}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          py: 1.5,
                          borderBottom: `1px solid ${theme.palette.divider}`,
                          "&:last-of-type": { borderBottom: "none" },
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                          }}
                        >
                          <Avatar
                            sx={{
                              width: 34,
                              height: 34,
                              fontSize: 13,
                              fontWeight: 700,
                              bgcolor: "primary.main",
                            }}
                          >
                            {row.s.slice(0, 2)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={700}>
                              {row.s}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {row.n}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ textAlign: "right" }}>
                          <Typography variant="body2" fontWeight={700}>
                            {row.v}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: row.up ? "success.main" : "error.main",
                              fontWeight: 600,
                            }}
                          >
                            {row.c}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Paper>
                </motion.div>
              </Grid>
            </Grid>
          </motion.div>
        </Container>
      </HeroSection>

      {/* Stats Section */}
      <Box sx={{ py: 6, backgroundColor: theme.palette.background.default }}>
        <Container maxWidth="lg">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <motion.div variants={itemVariants}>
                  <StatsCard>
                    <Typography variant="h3" fontWeight={700} gutterBottom>
                      10+
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                      Supported Blockchains
                    </Typography>
                  </StatsCard>
                </motion.div>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <motion.div variants={itemVariants}>
                  <StatsCard>
                    <Typography variant="h3" fontWeight={700} gutterBottom>
                      5000+
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                      Active Users
                    </Typography>
                  </StatsCard>
                </motion.div>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <motion.div variants={itemVariants}>
                  <StatsCard>
                    <Typography variant="h3" fontWeight={700} gutterBottom>
                      $100M+
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                      Assets Tracked
                    </Typography>
                  </StatsCard>
                </motion.div>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <motion.div variants={itemVariants}>
                  <StatsCard>
                    <Typography variant="h3" fontWeight={700} gutterBottom>
                      99.9%
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                      Uptime
                    </Typography>
                  </StatsCard>
                </motion.div>
              </Grid>
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 8, backgroundColor: theme.palette.background.paper }}>
        <Container maxWidth="lg">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.div variants={itemVariants}>
              <Box sx={{ textAlign: "center", mb: 6 }}>
                <Typography
                  variant="h3"
                  component="h2"
                  fontWeight={700}
                  gutterBottom
                >
                  Key Features
                </Typography>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{ maxWidth: 700, mx: "auto" }}
                >
                  Everything you need to track and manage your crypto portfolio
                  in one place
                </Typography>
              </Box>
            </motion.div>

            <Grid container spacing={4}>
              <Grid item xs={12} sm={6} md={4}>
                <motion.div variants={itemVariants}>
                  <FeatureCard>
                    <CardContent sx={{ p: 3, textAlign: "center" }}>
                      <FeatureIcon>
                        <WalletIcon />
                      </FeatureIcon>
                      <Typography
                        variant="h5"
                        component="h3"
                        fontWeight={600}
                        gutterBottom
                      >
                        Multi-Chain Support
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        Track your assets across multiple blockchains including
                        Ethereum, Polygon, Binance Smart Chain, and more.
                      </Typography>
                    </CardContent>
                  </FeatureCard>
                </motion.div>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <motion.div variants={itemVariants}>
                  <FeatureCard>
                    <CardContent sx={{ p: 3, textAlign: "center" }}>
                      <FeatureIcon>
                        <TrendingUpIcon />
                      </FeatureIcon>
                      <Typography
                        variant="h5"
                        component="h3"
                        fontWeight={600}
                        gutterBottom
                      >
                        Portfolio Analytics
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        Get detailed insights into your portfolio performance
                        with advanced analytics and visualization tools.
                      </Typography>
                    </CardContent>
                  </FeatureCard>
                </motion.div>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <motion.div variants={itemVariants}>
                  <FeatureCard>
                    <CardContent sx={{ p: 3, textAlign: "center" }}>
                      <FeatureIcon>
                        <SwapIcon />
                      </FeatureIcon>
                      <Typography
                        variant="h5"
                        component="h3"
                        fontWeight={600}
                        gutterBottom
                      >
                        Transaction History
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        View and filter your complete transaction history across
                        all connected wallets and exchanges.
                      </Typography>
                    </CardContent>
                  </FeatureCard>
                </motion.div>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <motion.div variants={itemVariants}>
                  <FeatureCard>
                    <CardContent sx={{ p: 3, textAlign: "center" }}>
                      <FeatureIcon>
                        <SecurityIcon />
                      </FeatureIcon>
                      <Typography
                        variant="h5"
                        component="h3"
                        fontWeight={600}
                        gutterBottom
                      >
                        Security First
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        Your security is our priority. We use read-only API keys
                        and never store your private keys.
                      </Typography>
                    </CardContent>
                  </FeatureCard>
                </motion.div>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <motion.div variants={itemVariants}>
                  <FeatureCard>
                    <CardContent sx={{ p: 3, textAlign: "center" }}>
                      <FeatureIcon>
                        <SpeedIcon />
                      </FeatureIcon>
                      <Typography
                        variant="h5"
                        component="h3"
                        fontWeight={600}
                        gutterBottom
                      >
                        Real-Time Data
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        Get real-time price updates and portfolio valuation with
                        our high-performance data feeds.
                      </Typography>
                    </CardContent>
                  </FeatureCard>
                </motion.div>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <motion.div variants={itemVariants}>
                  <FeatureCard>
                    <CardContent sx={{ p: 3, textAlign: "center" }}>
                      <FeatureIcon>
                        <LayersIcon />
                      </FeatureIcon>
                      <Typography
                        variant="h5"
                        component="h3"
                        fontWeight={600}
                        gutterBottom
                      >
                        DeFi Integration
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        Track your DeFi positions, liquidity pools, and staking
                        rewards all in one dashboard.
                      </Typography>
                    </CardContent>
                  </FeatureCard>
                </motion.div>
              </Grid>
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: 8,
          background: "linear-gradient(45deg, #3a36e0 0%, #6c63ff 100%)",
          color: "white",
        }}
      >
        <Container maxWidth="md">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.div variants={itemVariants}>
              <Box sx={{ textAlign: "center", mb: 4 }}>
                <Typography
                  variant="h3"
                  component="h2"
                  fontWeight={700}
                  gutterBottom
                >
                  Ready to Take Control of Your Crypto Portfolio?
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ maxWidth: 700, mx: "auto", mb: 4, opacity: 0.9 }}
                >
                  Join thousands of users who trust ChainFinity for their
                  portfolio tracking needs.
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  component={RouterLink}
                  to="/register"
                  disableElevation
                  sx={{
                    background: "#ffffff",
                    color: "#3a36e0",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
                    "&:hover": {
                      background: "#f1f0ff",
                      boxShadow: "0 10px 28px rgba(0,0,0,0.24)",
                    },
                    px: 4,
                    py: 1.5,
                    fontSize: "1.1rem",
                    fontWeight: 700,
                  }}
                >
                  Sign Up for Free
                </Button>
              </Box>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Divider sx={{ my: 6, bgcolor: "rgba(255, 255, 255, 0.2)" }} />

              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  Subscribe to Our Newsletter
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
                  Get the latest updates, news, and special offers delivered
                  directly to your inbox.
                </Typography>
                <Box
                  component="form"
                  onSubmit={handleSubscribe}
                  sx={{
                    display: "flex",
                    maxWidth: 500,
                    mx: "auto",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: { xs: 2, sm: 0 },
                  }}
                >
                  <TextField
                    fullWidth
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    variant="outlined"
                    sx={{
                      bgcolor: "#ffffff",
                      borderRadius: { xs: "8px", sm: "8px 0 0 8px" },
                      "& .MuiOutlinedInput-root": {
                        borderRadius: { xs: "8px", sm: "8px 0 0 8px" },
                        "& fieldset": {
                          borderColor: "transparent",
                        },
                        "&:hover fieldset": {
                          borderColor: "transparent",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#3a36e0",
                        },
                      },
                      "& .MuiInputBase-input": {
                        color: "#151529",
                      },
                      "& .MuiInputBase-input::placeholder": {
                        color: "#8a8aa0",
                        opacity: 1,
                      },
                    }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    disableElevation
                    sx={{
                      background:
                        "linear-gradient(45deg, #241f9e 0%, #3a36e0 100%)",
                      color: "#ffffff",
                      "&:hover": {
                        background:
                          "linear-gradient(45deg, #1d1888 0%, #322ec9 100%)",
                      },
                      borderRadius: { xs: "8px", sm: "0 8px 8px 0" },
                      px: 3,
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                    }}
                  >
                    Subscribe
                  </Button>
                </Box>
                {subscribed && (
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 2,
                      color: "rgba(255,255,255,0.95)",
                      fontWeight: 500,
                    }}
                  >
                    ✓ You're subscribed! Thanks for joining.
                  </Typography>
                )}
              </Box>
            </motion.div>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
