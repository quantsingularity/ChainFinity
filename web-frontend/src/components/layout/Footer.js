import {
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
  Telegram as TelegramIcon,
  Twitter as TwitterIcon,
} from "@mui/icons-material";
import {
  Box,
  Container,
  Divider,
  Grid,
  IconButton,
  Link,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import { Link as RouterLink } from "react-router-dom";

const FooterContainer = styled(Box)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "light"
      ? "rgba(248, 249, 252, 0.8)"
      : "rgba(18, 18, 18, 0.8)",
  backdropFilter: "blur(8px)",
  borderTop: `1px solid ${theme.palette.divider}`,
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(6),
  [theme.breakpoints.down("sm")]: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
}));

const FooterLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.secondary,
  textDecoration: "none",
  "&:hover": {
    color: theme.palette.primary.main,
    textDecoration: "none",
  },
  transition: "color 0.2s ease-in-out",
}));

const SocialIcon = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.secondary,
  "&:hover": {
    color: theme.palette.primary.main,
    backgroundColor:
      theme.palette.mode === "light"
        ? "rgba(58, 54, 224, 0.08)"
        : "rgba(108, 99, 255, 0.08)",
  },
}));

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer
      component={motion.footer}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 2,
                background: "linear-gradient(45deg, #3a36e0 0%, #6c63ff 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              ChainFinity
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Advanced blockchain portfolio tracker and DeFi analytics platform.
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <SocialIcon size="small" aria-label="github">
                <GitHubIcon fontSize="small" />
              </SocialIcon>
              <SocialIcon size="small" aria-label="twitter">
                <TwitterIcon fontSize="small" />
              </SocialIcon>
              <SocialIcon size="small" aria-label="linkedin">
                <LinkedInIcon fontSize="small" />
              </SocialIcon>
              <SocialIcon size="small" aria-label="telegram">
                <TelegramIcon fontSize="small" />
              </SocialIcon>
            </Box>
          </Grid>

          <Grid item xs={6} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
              Product
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <FooterLink component={RouterLink} to="/#features">
                Features
              </FooterLink>
              <FooterLink component={RouterLink} to="/portfolio">
                Portfolio
              </FooterLink>
              <FooterLink component={RouterLink} to="/governance">
                Governance
              </FooterLink>
              <FooterLink component={RouterLink} to="/dashboard">
                Dashboard
              </FooterLink>
            </Box>
          </Grid>

          <Grid item xs={6} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
              Resources
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <FooterLink
                href="https://docs.chainfinity.io"
                target="_blank"
                rel="noopener noreferrer"
              >
                Documentation
              </FooterLink>
              <FooterLink
                href="https://docs.chainfinity.io/api"
                target="_blank"
                rel="noopener noreferrer"
              >
                API Reference
              </FooterLink>
              <FooterLink
                href="https://docs.chainfinity.io"
                target="_blank"
                rel="noopener noreferrer"
              >
                Tutorials
              </FooterLink>
              <FooterLink
                href="https://blog.chainfinity.io"
                target="_blank"
                rel="noopener noreferrer"
              >
                Blog
              </FooterLink>
            </Box>
          </Grid>

          <Grid item xs={6} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
              Company
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <FooterLink component={RouterLink} to="/">
                About
              </FooterLink>
              <FooterLink href="mailto:careers@chainfinity.io">
                Careers
              </FooterLink>
              <FooterLink component={RouterLink} to="/">
                Privacy Policy
              </FooterLink>
              <FooterLink component={RouterLink} to="/">
                Terms of Service
              </FooterLink>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {currentYear} ChainFinity. All rights reserved.
          </Typography>
          <Box sx={{ display: "flex", gap: 3 }}>
            <FooterLink href="#" variant="body2">
              Privacy
            </FooterLink>
            <FooterLink href="#" variant="body2">
              Terms
            </FooterLink>
            <FooterLink href="#" variant="body2">
              Cookies
            </FooterLink>
          </Box>
        </Box>
      </Container>
    </FooterContainer>
  );
};

export default Footer;
