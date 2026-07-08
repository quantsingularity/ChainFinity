import { Stack, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { AppText, Button, Screen } from "../src/components/ui";
import { spacing } from "../src/theme/theme";

export default function NotFoundScreen() {
  const router = useRouter();
  return (
    <>
      <Stack.Screen options={{ title: "Not Found" }} />
      <Screen>
        <View style={styles.container}>
          <AppText color="brand" style={{ fontSize: 64, fontWeight: "800" }}>
            404
          </AppText>
          <AppText
            color="secondary"
            center
            style={{ marginVertical: spacing.md }}
          >
            This screen does not exist.
          </AppText>
          <Button
            title="Go to Home"
            onPress={() => router.replace("/")}
            fullWidth={false}
          />
        </View>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
});
