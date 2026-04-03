import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors, radius, shadow } from "../theme";
import { ExerciseImage } from "./common/ExerciseImage";

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
    return (
      // 卡片缩略图也走统一组件，确保列表页和详情页的缺图回退行为一致。
      <ExerciseImage
        exercise={exercise}
        style={styles.image}
        contentFit="cover"
        variant="compact"
      />
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
