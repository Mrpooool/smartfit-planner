import { ScrollView, StyleSheet, Text, View } from "react-native";
import { colors, radius, shadow, typography } from "../theme";
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
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 40 },
  gif: { width: "100%", height: 300, borderRadius: radius.lg, marginBottom: 24 },
  title: {
    ...typography.pageTitle,
    color: colors.textPrimary,
    marginBottom: 24,
    textTransform: "capitalize",
  },
  infoCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: radius.md,
    marginBottom: 12,
    ...shadow.md,
  },
  infoLabel: { ...typography.body, fontWeight: "600", color: colors.textSecondary },
  infoValue: { ...typography.bodySemibold, fontWeight: "700", color: colors.textPrimary, textTransform: "capitalize" },
  instructionsContainer: {
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: radius.lg,
    marginTop: 12,
    ...shadow.md,
  },
  sectionTitle: { ...typography.sectionTitle, color: colors.textPrimary, marginBottom: 12 },
  instructionText: { ...typography.body, color: colors.textMuted, lineHeight: 24 },
  instructionStep: { ...typography.body, color: colors.textMuted, lineHeight: 24, marginBottom: 8 },
});
