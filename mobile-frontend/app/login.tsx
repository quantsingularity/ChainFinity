import { useRouter } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { AppText, Button, Input, Logo, Screen } from "../src/components/ui";
import { useApp } from "../src/context/AppContext";
import { useTheme } from "../src/theme/ThemeContext";
import { spacing } from "../src/theme/theme";

export default function LoginScreen() {
  const router = useRouter();
  const { login, error, clearError } = useApp();
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async () => {
    setFormError("");
    clearError();
    if (!email.trim() || !password) {
      setFormError("Email and password are required");
      return;
    }
    setSubmitting(true);
    const ok = await login({ email: email.trim(), password });
    setSubmitting(false);
    if (ok) router.replace("/dashboard");
  };

  const handleGuest = async () => {
    setSubmitting(true);
    const ok = await login({
      email: "guest@chainfinity.io",
      password: "guest1234",
    });
    setSubmitting(false);
    if (ok) router.replace("/dashboard");
  };

  return (
    <Screen scroll edges={["bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <Logo size={30} />
        </View>

        <AppText variant="h1" style={{ marginTop: spacing.xl }}>
          Welcome back
        </AppText>
        <AppText color="secondary" style={{ marginBottom: spacing.xl }}>
          Sign in to your ChainFinity account.
        </AppText>

        <Input
          label="Email Address"
          accessibilityLabel="Email Address"
          placeholder="you@example.com"
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <Input
          label="Password"
          accessibilityLabel="Password"
          placeholder="Your password"
          secureTextEntry
          autoComplete="password"
          value={password}
          onChangeText={setPassword}
        />

        {(formError || error) && (
          <AppText color="error" center style={{ marginBottom: spacing.md }}>
            {formError || error?.message}
          </AppText>
        )}

        <Button
          title="Sign In"
          onPress={handleLogin}
          loading={submitting}
          accessibilityLabel="Sign in"
        />
        <Button
          title="Continue as Guest"
          variant="secondary"
          onPress={handleGuest}
          disabled={submitting}
          accessibilityLabel="Continue as guest"
          style={{ marginTop: spacing.md }}
        />

        <View style={{ alignItems: "center", marginTop: spacing.lg }}>
          <AppText
            color="brand"
            onPress={() => router.push("/forgot-password")}
            style={{ fontWeight: "600" }}
          >
            Forgot password?
          </AppText>
        </View>

        <View style={styles.footerRow}>
          <AppText color="secondary">No account? </AppText>
          <AppText
            color="brand"
            style={{ fontWeight: "700" }}
            onPress={() => router.push("/register")}
          >
            Sign Up
          </AppText>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: "center", marginTop: spacing.lg },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: spacing.xl,
  },
});
