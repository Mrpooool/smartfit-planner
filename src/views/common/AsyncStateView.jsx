import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { colors } from "../../theme";

export function AsyncStateView({ promise, error, empty, data }) {
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error.toString()}</Text>
      </View>
    );
  }

  if (promise && (data === null || data === undefined)) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.text}>Loading...</Text>
      </View>
    );
  }

  if (promise === null || promise === undefined || empty) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No data</Text>
      </View>
    );
  }

  return null;
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
    color: colors.textSecondary,
    marginTop: 8,
  },
  errorText: {
    fontSize: 14,
    color: colors.error,
    textAlign: "center",
  },
});
