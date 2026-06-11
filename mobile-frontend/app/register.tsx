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
} from "react-native";
import { useApp } from "../src/context/AppContext";
import { colors } from "../src/theme/colors";

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
    const result = await register({ email: email.trim(), password });
    setSubmitting(false);
    if (result.success) {
      setDone(true);
    }
  };

  if (done) {
    return (
      <KeyboardAvoidingView style={styles.container}>
        <Text style={styles.title}>Account created</Text>
        <Text style={styles.subtitle}>You can sign in now.</Text>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.replace("/login")}
          accessibilityRole="button"
          accessibilityLabel="Go to sign in"
        >
          <Text style={styles.primaryButtonText}>Go to Sign In</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        style={styles.input}
        placeholder="Email Address"
        placeholderTextColor={colors.textSecondary}
        autoCapitalize="none"
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
        value={password}
        onChangeText={setPassword}
        accessibilityLabel="Password"
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor={colors.textSecondary}
        secureTextEntry
        value={confirm}
        onChangeText={setConfirm}
        accessibilityLabel="Confirm Password"
      />

      {(formError || error) && (
        <Text style={styles.error}>{formError || error?.message}</Text>
      )}

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={handleRegister}
        disabled={submitting}
        accessibilityRole="button"
        accessibilityLabel="Create account"
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.primaryButtonText}>Create Account</Text>
        )}
      </TouchableOpacity>
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
  subtitle: {
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 20,
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
});
