import { Picker } from "@react-native-picker/picker";
import { Pressable, StyleSheet, Text, View } from "react-native";

export function GeneratorView(props) {
  
  // TODO: time selector (15 / 30 / 60 min radio buttons)
  // TODO: equipment multi-select checkboxes
  // TODO: target muscle group picker
  // TODO: GENERATE button (disabled while promise is pending)
  // TODO: AsyncStateView for planPromiseState (Skeleton UI while loading)
  const isLoading = Boolean(props.promise) && !props.data && !props.error;


  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>👤 Hi, Alex!</Text>
      <Text style={styles.pageTitle}>⚡ Smart Plan Generator</Text>
      {/* TODO: form inputs */}

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
}

// ── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  pageTitle: { fontSize: 24, fontWeight: "bold", marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 12 },
  section: { marginBottom: 24 },
  row: { flexDirection: "row", gap: 12 },

  button: { backgroundColor: "#6366f1",
    padding: 16,
    borderRadius: 12,
    alignItems: "center"
  },
  selectedButton: {
    backgroundColor: "#4338ca",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#c7d2fe",
  },
  buttonText: { 
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16 
  },
  disabledButton: {
    backgroundColor: "#9ca3af",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },

  pickerWrapper: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    overflow: "hidden",
  },
  warningText: {
  color: "#b45309",
  backgroundColor: "#fef3c7",
  padding: 12,
  borderRadius: 10,
  marginBottom: 16,
  fontSize: 14,
  },
});




