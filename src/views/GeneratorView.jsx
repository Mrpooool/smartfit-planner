import { LinearGradient } from "expo-linear-gradient";
import { ImageBackground, Platform, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { colors, radius } from "../theme";

// 在模块顶层 require，避免每次渲染重新解析路径
const heroImage = require("../../assets/images/StockCake-Dance_Through_Light-1538690-medium.jpg");
// 宽屏图，专用于 Web 横排布局
const heroImageWeb = require("../../assets/images/StockCake-Strength_Meets_Grace-1515373-medium.jpg");

const MUSCLE_OPTIONS = [
  { label: "Full Body", value: "full body" },
  { label: "Chest", value: "chest" },
  { label: "Back", value: "back" },
  { label: "Legs", value: "legs" },
  { label: "Arms", value: "arms" },
  { label: "Shoulders", value: "shoulders" },
  { label: "Core", value: "core" },
];

const LEVEL_OPTIONS = [
  { label: "Beginner", value: "beginner" },
  { label: "Mid", value: "intermediate" },
  { label: "Advanced", value: "advanced" },
];

function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function GeneratorView(props) {
  const { height, width } = useWindowDimensions();
  const isLoading = Boolean(props.promise) && !props.data && !props.error;
  // On narrow screens, use 2-column grid for time buttons
  const isNarrow = width < 400;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {/* ── Hero Banner ─────────────────────────────────────────────────── */}
      <ImageBackground
        source={Platform.OS === "web" ? heroImageWeb : heroImage}
        style={[styles.hero, { height: Math.round(height * 0.28) }]}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["transparent", colors.heroScrimMid, colors.heroScrimStrong]}
          style={styles.heroGradient}
        >
          <Text style={styles.heroGreeting}>Hi, {props.username} 👋</Text>
          <Text style={styles.heroTitle}>SmartFit Planner</Text>
          <Text style={styles.heroSubtitle}>Build your perfect workout, powered by AI</Text>
        </LinearGradient>
      </ImageBackground>

      {/* ── Form ────────────────────────────────────────────────────────── */}
      <View style={styles.form}>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Workout Time</Text>
        <View style={styles.gridRow}>
          {[15, 30, 60].map(function renderDurationCB(duration) {
            const selected = props.duration === duration;
            return (
              <Pressable
                key={duration}
                role="button"
                onPress={function chooseTimeACB() { props.onParamChange("duration", duration); }}
                style={[styles.gridChip, selected && styles.gridChipSelected]}
              >
                <Text style={selected ? styles.gridChipTextSelected : styles.gridChipText}>{duration} mins</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Equipment</Text>
        <View style={styles.equipGrid}>
          {["none", "dumbbells", "bands", "full gym"].map(function renderEquipCB(equipment) {
            const selected = props.equipment.includes(equipment);
            return (
              <Pressable
                key={equipment}
                role="button"
                onPress={function chooseEquipACB() { props.onParamChange("equipment", equipment); }}
                style={[styles.equipChip, selected && styles.equipChipSelected]}
              >
                <Text style={selected ? styles.equipChipTextSelected : styles.equipChipText}>{capitalize(equipment)}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Target Muscle Group</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll} contentContainerStyle={styles.chipScrollContent}>
          {MUSCLE_OPTIONS.map(function renderMuscleCB(option) {
            const muscleArr = Array.isArray(props.targetMuscle) ? props.targetMuscle : [props.targetMuscle];
            const selected = muscleArr.includes(option.value);
            return (
              <Pressable
                key={option.value}
                onPress={function chooseMuscleACB() { props.onParamChange("targetMuscle", option.value); }}
                style={[styles.chip, selected && styles.chipSelected]}
              >
                <Text style={selected ? styles.chipTextSelected : styles.chipText}>{option.label}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.divider} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Experience Level</Text>
        <View style={styles.gridRow}>
          {LEVEL_OPTIONS.map(function renderLevelCB(option) {
            const selected = props.experienceLevel === option.value;
            return (
              <Pressable
                key={option.value}
                onPress={function chooseLevelACB() { props.onParamChange("experienceLevel", option.value); }}
                style={[styles.gridChip, selected && styles.gridChipSelected]}
              >
                <Text style={selected ? styles.gridChipTextSelected : styles.gridChipText}>{option.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {
        props.warningMessage ?
          <Text style={styles.warningText}>{props.warningMessage}</Text> : null
      }

      <Pressable
        role="button"
        style={isLoading ? styles.disabledButton : styles.generateButton}
        onPress={props.onGenerate}
        disabled={isLoading}
      >
        <Text style={styles.generateButtonText}>
          {isLoading ? "Generating..." : "🟩 GENERATE SMART PLAN"}
        </Text>
      </Pressable>
      </View>
    </ScrollView>
  );
}

// ── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: 40 },

  // Hero Banner
  hero: {
    width: "100%",
    overflow: "hidden",
  },
  heroGradient: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 24,
    paddingBottom: 28,
    paddingTop: 60,
  },
  heroGreeting: {
    fontSize: 13,
    color: colors.whiteMuted,
    fontWeight: "500",
    letterSpacing: 0.4,
    marginBottom: 6,
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.white,
    letterSpacing: 0.2,
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 14,
    color: colors.whiteSubtle,
    fontWeight: "400",
  },

  // Form area
  form: { padding: 20 },

  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 12 },
  section: { marginBottom: 20 },

  divider: {
    height: 2,
    backgroundColor: colors.borderLight,
    marginBottom: 20,
    marginHorizontal: -4,
  },

  // Equal-width grid for Workout Time and Experience Level (3 items)
  gridRow: {
    flexDirection: "row",
    gap: 10,
  },
  gridChip: {
    flex: 1,
    backgroundColor: colors.card,
    paddingVertical: 14,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: "center",
  },
  gridChipSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  gridChipText: {
    color: colors.textMuted,
    fontWeight: "600",
    fontSize: 14,
    textAlign: "center",
  },
  gridChipTextSelected: {
    color: colors.primaryDark,
    fontWeight: "700",
    fontSize: 14,
    textAlign: "center",
  },

  // Equipment 2x2 grid (4 items, equal size)
  equipGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  equipChip: {
    width: "48%",
    flexGrow: 1,
    flexBasis: "45%",
    backgroundColor: colors.card,
    paddingVertical: 14,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: "center",
  },
  equipChipSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  equipChipText: {
    color: colors.textMuted,
    fontWeight: "600",
    fontSize: 14,
  },
  equipChipTextSelected: {
    color: colors.primaryDark,
    fontWeight: "700",
    fontSize: 14,
  },

  // Horizontal scroll chips for Target Muscle
  chipScroll: { marginHorizontal: -4 },
  chipScrollContent: { paddingHorizontal: 4, gap: 10 },
  chip: {
    backgroundColor: colors.card,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  chipSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  chipText: {
    color: colors.textMuted,
    fontWeight: "600",
    fontSize: 14,
  },
  chipTextSelected: {
    color: colors.primaryDark,
    fontWeight: "700",
    fontSize: 14,
  },

  generateButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: radius.md,
    alignItems: "center",
  },
  generateButtonText: {
    color: colors.card,
    fontWeight: "bold",
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: colors.textTertiary,
    padding: 16,
    borderRadius: radius.md,
    alignItems: "center",
  },

  warningText: {
    color: colors.warning,
    backgroundColor: colors.warningBg,
    padding: 12,
    borderRadius: radius.sm,
    marginBottom: 16,
    fontSize: 14,
  },
});
