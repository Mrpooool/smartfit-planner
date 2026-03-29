import { Image } from "expo-image";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { colors, radius, shadow } from "../theme";

export function ActionDetailsView({ exercise }) {
  if (!exercise) return null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {exercise.exerciseDbId ? (
        <Image
          source={getExerciseImageSource(exercise.exerciseDbId,360)}
          style={styles.gif}
          contentFit="contain"
          cachePolicy="memory-disk"
        />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderIcon}>🏋️</Text>
        </View>
      )}

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

      {exercise.instructions?.length > 0 && (
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
  placeholder: {
    width: "100%", height: 300, borderRadius: radius.lg,
    backgroundColor: colors.border, justifyContent: "center", alignItems: "center",
    marginBottom: 24,
  },
  placeholderIcon: { fontSize: 64 },
  title: { fontSize: 28, fontWeight: "800", color: colors.textPrimary, marginBottom: 24, textTransform: "capitalize" },
  infoCard: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    backgroundColor: colors.card, padding: 16, borderRadius: radius.md, marginBottom: 12,
    ...shadow.sm,
  },
  infoLabel: { fontSize: 15, fontWeight: "600", color: colors.textSecondary },
  infoValue: { fontSize: 16, fontWeight: "700", color: colors.textPrimary, textTransform: "capitalize" },
  instructionsContainer: {
    backgroundColor: colors.card, padding: 20, borderRadius: radius.lg, marginTop: 12,
    ...shadow.md,
  },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: colors.textPrimary, marginBottom: 12 },
  instructionText: { fontSize: 15, color: colors.textMuted, lineHeight: 24 },
  instructionStep: { fontSize: 15, color: colors.textMuted, lineHeight: 24, marginBottom: 8 },
});
