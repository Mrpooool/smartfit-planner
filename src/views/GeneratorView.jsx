import { Picker } from "@react-native-picker/picker";
import { LinearGradient } from "expo-linear-gradient";
import { ImageBackground, Platform, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { colors, radius } from "../theme";

// 在模块顶层 require，避免每次渲染重新解析路径
const heroImage = require("../../assets/images/StockCake-Dance_Through_Light-1538690-medium.jpg");
// 宽屏图，专用于 Web 横排布局
const heroImageWeb = require("../../assets/images/StockCake-Strength_Meets_Grace-1515373-medium.jpg");

export function GeneratorView(props) {

  // 动态获取屏幕高度，使 Hero 在不同设备上保持同一比例
  const { height } = useWindowDimensions();
  const isLoading = Boolean(props.promise) && !props.data && !props.error;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {/* ── Hero Banner ─────────────────────────────────────────────────── */}
      {/*
        Web 用横版图，Mobile 用竖版图，布局完全一致：
          ImageBackground  → 图片铺满，作为最底层背景
            LinearGradient → 渐变蒙层：顶部透明 → 底部深黑，保证文字可读
              Text ×3      → 问候 / 标题 / 副标题，锚定在蒙层底部
      */}
      <ImageBackground
        source={Platform.OS === "web" ? heroImageWeb : heroImage}
        // 高度 = 屏幕高度 × 44%，cover 模式让图片不变形地填满区域
        style={[styles.hero, { height: Math.round(height * 0.44) }]}
        resizeMode="cover"
      >
        {/* 三段式渐变：透明 → 半透明(0.38) → 深色(0.74)，过渡更自然 */}
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.38)", "rgba(0,0,0,0.74)"]}
          style={styles.heroGradient}
        >
          <Text style={styles.heroGreeting}>Hi, {props.username} !</Text>
          <Text style={styles.heroTitle}>SmartFit Planner</Text>
          <Text style={styles.heroSubtitle}>Build your perfect workout, powered by AI</Text>
        </LinearGradient>
      </ImageBackground>

      {/* ── Form ────────────────────────────────────────────────────────── */}
      <View style={styles.form}>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Workout Time</Text>
        <View style={styles.row}>
          {[15, 30, 60].map(renderDurationOptionCB)}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Equipment</Text>
        <View style={styles.row}>
          {["none", "dumbbells", "bands", "full gym"].map(renderEquipOptionCB)}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Target Muscle Group</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={props.targetMuscle}
            onValueChange={chooseTargetMuscleACB}
          >
            <Picker.Item label="Full Body" value="full body" />
            <Picker.Item label="Chest" value="chest" />
            <Picker.Item label="Back" value="back" />
            <Picker.Item label="Legs" value="legs" />
            <Picker.Item label="Arms" value="arms" />
            <Picker.Item label="Shoulders" value="shoulders" />
            <Picker.Item label="Core" value="core" />
          </Picker>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Experience Level</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={props.experienceLevel}
            onValueChange={chooseExperienceLevelACB}
          >
            <Picker.Item label="Beginner" value="beginner" />
            <Picker.Item label="Intermediate" value="intermediate" />
            <Picker.Item label="Advanced" value="advanced" />
          </Picker>
        </View>
      </View>

      {
        props.warningMessage ?
          <Text style={styles.warningText}>{props.warningMessage}</Text> : null
      }

      <Pressable
        role="button"
        style={isLoading ? styles.disabledButton : styles.button}
        onPress={props.onGenerate}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? "Generating..." : "🟩 GENERATE SMART PLAN"}
        </Text>
      </Pressable>
      </View>
    </ScrollView>
  );

  function renderDurationOptionCB(duration) {
    return (
      <Pressable
        key={duration}
        role="button"
        onPress={chooseTimeACB}
        style={props.duration === duration ? styles.selectedButton : styles.button}
      >
        <Text style={styles.buttonText}>{duration} mins</Text>
      </Pressable>
    );

    function chooseTimeACB() {
      props.onParamChange("duration", duration);
    }
  }

  function renderEquipOptionCB(equipment) {
    return (
      <Pressable
        key={equipment}
        role="button"
        onPress={chooseEquipACB}
        style={props.equipment.includes(equipment) ? styles.selectedButton : styles.button}
      >
        <Text style={styles.buttonText}>{equipment}</Text>
      </Pressable>
    );

    function chooseEquipACB() {
      props.onParamChange("equipment", equipment);
    }
  }

  function chooseTargetMuscleACB(muscle) {
    props.onParamChange("targetMuscle", muscle);
  }

  function chooseExperienceLevelACB(level) {
    props.onParamChange("experienceLevel", level);
  }
}

// ── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: 40 },

  // Hero Banner
  hero: {
    width: "100%",
    overflow: "hidden", // 防止图片圆角溢出（如果后续加 borderRadius）
  },
  heroGradient: {
    flex: 1,
    justifyContent: "flex-end", // 文字贴底对齐，视觉重心在下方
    paddingHorizontal: 24,
    paddingBottom: 28,
    paddingTop: 60,  // 留出顶部透明区域，让图片内容可见
  },
  heroGreeting: {
    fontSize: 13,
    color: "rgba(255,255,255,0.78)",
    fontWeight: "500",
    letterSpacing: 0.4,
    marginBottom: 6,
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: 0.2,
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.70)",
    fontWeight: "400",
  },

  // Form area
  form: { padding: 20 },

  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 12 },
  section: { marginBottom: 24 },
  row: { flexDirection: "row", gap: 12 },

  button: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: radius.md,
    alignItems: "center",
  },
  selectedButton: {
    backgroundColor: colors.primaryDark,
    padding: 16,
    borderRadius: radius.md,
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.primaryBorder,
  },
  buttonText: {
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

  pickerWrapper: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
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




