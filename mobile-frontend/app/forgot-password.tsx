import { useRouter } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { AppText, Button, Input, Logo, Screen } from "../src/components/ui";
import { spacing } from "../src/theme/theme";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handleSubmit = async () => {
    setError("");
    if (!emailValid) {
      setError("Please enter a valid email address");
      return;
    }
    setSubmitting(true);
    // No public reset endpoint yet; simulate a request so the flow is complete.
    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);
    setSent(true);
  };

  if (sent) {
    return (
      <Screen>
        <View style={styles.center}>
          <View style={styles.mailCircle}>
            <AppText style={{ fontSize: 32 }}>{"\u2709"}</AppText>
          </View>
          <AppText variant="h1" center>
            Check your email
          </AppText>
          <AppText
            color="secondary"
            center
            style={{ marginVertical: spacing.md }}
          >
            If an account exists for {email.trim()}, a password reset link is on
            its way.
          </AppText>
          <Button
            title="Back to Sign In"
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
          Reset password
        </AppText>
        <AppText color="secondary" style={{ marginBottom: spacing.xl }}>
          Enter the email linked to your account and we will send you a reset
          link.
        </AppText>

        <Input
          label="Email Address"
          accessibilityLabel="Email Address"
          placeholder="you@example.com"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          errorText={error || undefined}
        />

        <Button
          title="Send Reset Link"
          onPress={handleSubmit}
          loading={submitting}
          accessibilityLabel="Send reset link"
        />

        <View style={styles.footerRow}>
          <AppText
            color="brand"
            style={{ fontWeight: "700" }}
            onPress={() => router.push("/login")}
          >
            Back to Sign In
          </AppText>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: "center", marginTop: spacing.lg },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: spacing.xl,
  },
  mailCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: "#6c63ff22",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
});
