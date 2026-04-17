import { Box, Button, Container, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import { Link as RouterLink } from "react-router-dom";

const NotFoundContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "calc(100vh - 200px)",
  textAlign: "center",
  padding: theme.spacing(3),
}));

const NotFound = () => {
  return (
    <Container maxWidth="md">
      <NotFoundContainer>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ width: "100%" }}
        >
          {/* Inline SVG illustration – no external file needed */}
          <Box sx={{ mb: 4, display: "flex", justifyContent: "center" }}>
            <svg
              width="220"
              height="160"
              viewBox="0 0 220 160"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="20"
                y="40"
                width="180"
                height="100"
                rx="12"
                fill="#f0eeff"
              />
              <rect x="35" y="55" width="70" height="8" rx="4" fill="#c5bfff" />
              <rect x="35" y="71" width="50" height="6" rx="3" fill="#ddd9ff" />
              <rect x="35" y="85" width="60" height="6" rx="3" fill="#ddd9ff" />
              <circle
                cx="155"
                cy="90"
                r="30"
                fill="#fff"
                stroke="#6c63ff"
                strokeWidth="3"
              />
              <text
                x="155"
                y="97"
                textAnchor="middle"
                fontSize="24"
                fontWeight="bold"
                fill="#6c63ff"
              >
                ?
              </text>
              <circle cx="155" cy="30" r="14" fill="#6c63ff" opacity="0.15" />
              <circle cx="180" cy="50" r="8" fill="#3a36e0" opacity="0.1" />
              <circle cx="130" cy="20" r="6" fill="#6c63ff" opacity="0.2" />
            </svg>
          </Box>

          <Typography
            variant="h2"
            component="h1"
            fontWeight={700}
            gutterBottom
            sx={{
              background: "linear-gradient(45deg, #3a36e0 0%, #6c63ff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            404
          </Typography>

          <Typography variant="h4" fontWeight={600} gutterBottom>
            Page Not Found
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            paragraph
            sx={{ maxWidth: 500, mx: "auto" }}
          >
            The page you are looking for might have been removed, had its name
            changed, or is temporarily unavailable.
          </Typography>

          <Button
            variant="contained"
            color="primary"
            size="large"
            component={RouterLink}
            to="/"
            sx={{ mt: 2 }}
          >
            Back to Home
          </Button>
        </motion.div>
      </NotFoundContainer>
    </Container>
  );
};

export default NotFound;
