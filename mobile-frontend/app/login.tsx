import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useApp } from "../src/context/AppContext";
import { colors } from "../src/theme/colors";

export default function LoginScreen() {
  const router = useRouter();
  const { login, error, clearError } = useApp();
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
    if (ok) {
      router.replace("/dashboard");
    }
  };

  const handleGuest = async () => {
    setSubmitting(true);
    const ok = await login({
      email: "guest@chainfinity.io",
      password: "guest1234",
    });
    setSubmitting(false);
    if (ok) {
      router.replace("/dashboard");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.title}>Welcome back</Text>

      <TextInput
        style={styles.input}
        placeholder="Email Address"
        placeholderTextColor={colors.textSecondary}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        accessibilityLabel="Email Address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={colors.textSecondary}
        secureTextEntry
        autoComplete="password"
        value={password}
        onChangeText={setPassword}
        accessibilityLabel="Password"
      />

      {(formError || error) && (
        <Text style={styles.error}>{formError || error?.message}</Text>
      )}

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={handleLogin}
        disabled={submitting}
        accessibilityRole="button"
        accessibilityLabel="Sign in"
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.primaryButtonText}>Sign In</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.guestButton}
        onPress={handleGuest}
        disabled={submitting}
        accessibilityRole="button"
        accessibilityLabel="Continue as guest"
      >
        <Text style={styles.guestButtonText}>Continue as Guest</Text>
      </TouchableOpacity>

      <View style={styles.footerRow}>
        <Text style={styles.footerText}>No account? </Text>
        <TouchableOpacity onPress={() => router.push("/register")}>
          <Text style={styles.footerLink}>Create one</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.divider,
    color: colors.textPrimary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  error: { color: colors.error, marginBottom: 12, textAlign: "center" },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 4,
  },
  primaryButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  guestButton: {
    borderColor: colors.secondary,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 12,
  },
  guestButtonText: {
    color: colors.secondary,
    fontSize: 16,
    fontWeight: "600",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  footerText: { color: colors.textSecondary },
  footerLink: { color: colors.primary, fontWeight: "600" },
});
