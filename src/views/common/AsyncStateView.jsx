// Based on lab's suspenseView.jsx.
// Unified async state renderer — handles loading / error / empty states.
// Usage: <AsyncStateView promise={state.promise} error={state.error} />

import { View, Text, ActivityIndicator, StyleSheet } from "react-native";

export function AsyncStateView({ promise, error, empty }) {
  if (promise === null || promise === undefined || empty) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No data</Text>
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error.toString()}</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#6366f1" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  text: {
    fontSize: 16,
    color: "#6b7280",
  },
  errorText: {
    fontSize: 14,
    color: "#ef4444",
    textAlign: "center",
  },
});
