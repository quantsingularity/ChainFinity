import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { AppProvider } from "../src/context/AppContext";
import { colors } from "../src/theme/colors";

export default function RootLayout() {
  return (
    <AppProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.textPrimary,
          headerTitleStyle: { fontWeight: "600" },
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" options={{ title: "ChainFinity" }} />
        <Stack.Screen name="login" options={{ title: "Sign In" }} />
        <Stack.Screen name="register" options={{ title: "Create Account" }} />
        <Stack.Screen name="dashboard" options={{ title: "Dashboard" }} />
        <Stack.Screen name="transactions" options={{ title: "Transactions" }} />
        <Stack.Screen name="settings" options={{ title: "Settings" }} />
      </Stack>
    </AppProvider>
  );
}
