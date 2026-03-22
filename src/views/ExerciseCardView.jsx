import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Image } from "expo-image";

export function ExerciseCardView({ exercise, isAdded, onAdd }) {
  // exercise: { id, name, targetMuscle, gifUrl }
  return (
    <View style={styles.card}>
      {/* TODO: GIF via expo-image (exercise.gifUrl), fallback placeholder if empty */}
      <View style={styles.info}>
        <Text style={styles.name}>{exercise?.name}</Text>
        <Text style={styles.muscle}>{exercise?.targetMuscle}</Text>
      </View>
      <TouchableOpacity
        style={[styles.addButton, isAdded && styles.addedButton]}
        onPress={onAdd}
        disabled={isAdded}
      >
        <Text style={styles.addButtonText}>{isAdded ? "✓" : "+"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: "row", alignItems: "center", padding: 12, marginBottom: 8, backgroundColor: "#f9fafb", borderRadius: 10 },
  info: { flex: 1, marginLeft: 12 },
  name: { fontSize: 15, fontWeight: "600" },
  muscle: { fontSize: 13, color: "#6b7280", marginTop: 2 },
  addButton: { backgroundColor: "#6366f1", width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  addedButton: { backgroundColor: "#d1d5db" },
  addButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
