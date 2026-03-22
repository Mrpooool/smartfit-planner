import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export function GeneratorView({ formParams, planPromiseState, onGenerate, onParamChange }) {
  // TODO: time selector (15 / 30 / 60 min radio buttons)
  // TODO: equipment multi-select checkboxes
  // TODO: target muscle group picker
  // TODO: GENERATE button (disabled while promise is pending)
  // TODO: AsyncStateView for planPromiseState (Skeleton UI while loading)
  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚡ Smart Plan Generator</Text>
      {/* TODO: form inputs */}
      <TouchableOpacity style={styles.button} onPress={onGenerate}>
        <Text style={styles.buttonText}>GENERATE SMART PLAN</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 24 },
  button: { backgroundColor: "#6366f1", padding: 16, borderRadius: 12, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
