import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { getExerciseImageSource } from "../api/exerciseDbApi";
import { colors, radius, shadow } from "../theme";

export function ExerciseCardView({ exercise, isAdded, onAdd, onPress }) {
  function handleAddPress() {
    if (onAdd) {
      onAdd(exercise);
    }
  }

  function handleCardPress() {
    if (onPress) {
      onPress(exercise);
    }
  }

  function renderImageSection() {
    if (exercise?.gifUrl) {
      return (
        <Image
          source={{ uri: exercise.gifUrl }}
          style={styles.image}
          contentFit="cover"
        />
      );
    }

    if (exercise?.id) {
      return (
        <Image
          source={getExerciseImageSource(exercise.id, 360)}
          style={styles.image}
          contentFit="cover"
        />
      );
    }

    return (
      <View style={[styles.image, styles.placeholder]}>
        <Text style={styles.placeholderText}>🏋️</Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.cardMain} onPress={handleCardPress} activeOpacity={0.7}>
        {renderImageSection()}
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={2}>{exercise?.name}</Text>
          <Text style={styles.muscle}>{exercise?.targetMuscle}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={isAdded ? styles.addButtonAdded : styles.addButton}
        onPress={handleAddPress}
        activeOpacity={0.7}
      >
        <Text style={isAdded ? styles.addButtonTextAdded : styles.addButtonText}>
          {isAdded ? "Added" : "Add"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 10,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    ...shadow.md,
  },
  cardMain: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
  },
  placeholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    fontSize: 24,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.textPrimary,
    textTransform: "capitalize",
    marginBottom: 4,
  },
  muscle: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: "500",
    textTransform: "capitalize",
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.sm,
  },
  addButtonAdded: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.sm,
  },
  addButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.card,
  },
  addButtonTextAdded: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.primary,
  },
});
