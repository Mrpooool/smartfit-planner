import { ScrollView, StyleSheet, Text, View } from "react-native";
import { ExerciseImage } from "./common/ExerciseImage";

export function ActionDetailsView({ exercise }) {
  if (!exercise) return null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* 详情页复用同一套图源优先级和占位策略，保证和列表页展示一致。 */}
      <ExerciseImage exercise={exercise} style={styles.gif} contentFit="contain" />

      <Text style={styles.title}>{exercise.name}</Text>

      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>Target Muscle</Text>
        <Text style={styles.infoValue}>{exercise.targetMuscle}</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>Body Part</Text>
        <Text style={styles.infoValue}>{exercise.bodyPart || "Unknown"}</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>Equipment</Text>
        <Text style={styles.infoValue}>{exercise.equipment || "Unknown"}</Text>
      </View>

      {exercise.instructions && (
        <View style={styles.instructionsContainer}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          {Array.isArray(exercise.instructions) ? (
            exercise.instructions.map((step, i) => (
              <Text key={i} style={styles.instructionStep}>
                {i + 1}. {step}
              </Text>
            ))
          ) : (
            <Text style={styles.instructionText}>{exercise.instructions}</Text>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  content: { padding: 20, paddingBottom: 40 },
  gif: { width: "100%", height: 300, borderRadius: 16, marginBottom: 24 },
  title: { fontSize: 28, fontWeight: "800", color: "#111827", marginBottom: 24, textTransform: "capitalize" },
  infoCard: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    backgroundColor: "#ffffff", padding: 16, borderRadius: 12, marginBottom: 12,
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 3, elevation: 2,
  },
  infoLabel: { fontSize: 15, fontWeight: "600", color: "#6b7280" },
  infoValue: { fontSize: 16, fontWeight: "700", color: "#111827", textTransform: "capitalize" },
  instructionsContainer: {
    backgroundColor: "#fff", padding: 20, borderRadius: 16, marginTop: 12,
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#111827", marginBottom: 12 },
  instructionText: { fontSize: 15, color: "#4b5563", lineHeight: 24 },
  instructionStep: { fontSize: 15, color: "#4b5563", lineHeight: 24, marginBottom: 8 },
});
