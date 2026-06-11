import Email from "@mui/icons-material/Email";
import ArrowBack from "@mui/icons-material/ArrowBack";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  InputAdornment,
  Link,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

const AuthPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[4],
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(6),
  },
}));

const AuthContainer = styled(Container)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "calc(100vh - 140px)",
  padding: theme.spacing(3),
}));

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    setError("");
    setLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSent(true);
  };

  return (
    <AuthContainer maxWidth="sm">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: "100%" }}
      >
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            fontWeight={700}
            sx={{
              mb: 1,
              background: "linear-gradient(45deg, #3a36e0 0%, #6c63ff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Reset Password
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Enter your email address and we'll send you a reset link
          </Typography>
        </Box>

        <AuthPaper elevation={3}>
          {sent ? (
            <Box sx={{ textAlign: "center" }}>
              <Alert severity="success" sx={{ mb: 3 }}>
                Password reset email sent! Check your inbox.
              </Alert>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Didn't receive the email? Check your spam folder or try again.
              </Typography>
              <Button
                variant="outlined"
                onClick={() => setSent(false)}
                sx={{ mr: 1 }}
              >
                Try Again
              </Button>
              <Button component={RouterLink} to="/login" variant="contained">
                Back to Login
              </Button>
            </Box>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              <TextField
                fullWidth
                label="Email Address"
                variant="outlined"
                margin="normal"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  ),
                }}
                disabled={loading}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                sx={{ py: 1.5, mt: 2, mb: 2 }}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Send Reset Link"
                )}
              </Button>

              <Box sx={{ textAlign: "center" }}>
                <Link
                  component={RouterLink}
                  to="/login"
                  color="primary"
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  <ArrowBack fontSize="small" />
                  Back to Login
                </Link>
              </Box>
            </form>
          )}
        </AuthPaper>
      </motion.div>
    </AuthContainer>
  );
};

export default ForgotPassword;
