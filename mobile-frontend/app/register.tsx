import { useRouter } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import {
  AppText,
  Button,
  Card,
  Input,
  Logo,
  Screen,
} from "../src/components/ui";
import { useApp } from "../src/context/AppContext";
import { spacing } from "../src/theme/theme";

export default function RegisterScreen() {
  const router = useRouter();
  const { register, error, clearError } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleRegister = async () => {
    setFormError("");
    clearError();
    if (!email.trim() || !password) {
      setFormError("Email and password are required");
      return;
    }
    if (password.length < 8) {
      setFormError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirm) {
      setFormError("Passwords do not match");
      return;
    }
    setSubmitting(true);
    const result = await register({
      email: email.trim(),
      password,
      confirm_password: confirm,
      terms_accepted: true,
      privacy_accepted: true,
    });
    setSubmitting(false);
    if (result.success) setDone(true);
  };

  if (done) {
    return (
      <Screen>
        <View style={styles.doneWrap}>
          <View style={styles.checkCircle}>
            <AppText style={{ fontSize: 34 }}>{"\u2713"}</AppText>
          </View>
          <AppText variant="h1" center>
            Account created
          </AppText>
          <AppText
            color="secondary"
            center
            style={{ marginVertical: spacing.md }}
          >
            Your ChainFinity account is ready. Sign in to continue.
          </AppText>
          <Button
            title="Go to Sign In"
            onPress={() => router.replace("/login")}
          />
        </View>
      </Screen>
    );
  }

  return (
    <Screen scroll edges={["bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <Logo size={30} />
        </View>

        <AppText variant="h1" style={{ marginTop: spacing.xl }}>
          Create your account
        </AppText>
        <AppText color="secondary" style={{ marginBottom: spacing.xl }}>
          Start tracking your cross-chain portfolio in minutes.
        </AppText>

        <Input
          label="Email Address"
          accessibilityLabel="Email Address"
          placeholder="you@example.com"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <Input
          label="Password"
          accessibilityLabel="Password"
          placeholder="At least 8 characters"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Input
          label="Confirm Password"
          accessibilityLabel="Confirm Password"
          placeholder="Re-enter your password"
          secureTextEntry
          value={confirm}
          onChangeText={setConfirm}
        />

        {(formError || error) && (
          <AppText color="error" center style={{ marginBottom: spacing.md }}>
            {formError || error?.message}
          </AppText>
        )}

        <Button
          title="Create Account"
          onPress={handleRegister}
          loading={submitting}
          accessibilityLabel="Create account"
        />

        <Card
          style={{
            marginTop: spacing.lg,
            backgroundColor: "transparent",
            borderWidth: 0,
          }}
          padded={false}
        >
          <AppText variant="caption" color="muted" center>
            By creating an account you agree to our Terms of Service and Privacy
            Policy.
          </AppText>
        </Card>

        <View style={styles.footerRow}>
          <AppText color="secondary">Already have an account? </AppText>
          <AppText
            color="brand"
            style={{ fontWeight: "700" }}
            onPress={() => router.push("/login")}
          >
            Sign In
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
  doneWrap: { flex: 1, alignItems: "center", justifyContent: "center" },
  checkCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: "#22c55e22",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
});
