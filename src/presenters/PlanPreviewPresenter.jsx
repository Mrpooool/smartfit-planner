import { observer } from "mobx-react-lite";
import { useRouter, useLocalSearchParams } from "expo-router";
import { action } from "mobx";
import { useState } from "react";
import { planStore } from "../model/planStore";
import { uiStore } from "../model/uiStore";
import { generateAiPlan } from "../utils/generateAiPlan";
import { PlanView } from "../views/PlanView";

export default observer(function PlanPreviewPresenter() {
  const router = useRouter();
  const searchParams = useLocalSearchParams();
  const plan = planStore.generatedPlan;
  const [isRegenerating, setIsRegenerating] = useState(false);

  function onAddToPlanACB() {
    if (!plan) return;
    
    // Assign draft plan to active plan
    planStore.setCurrentPlan({ ...plan });
    
    // Explicitly save it to the library
    planStore.addSavedPlan({ ...plan });
    
    // Clear draft state to release memory
    planStore.setGeneratedPlan(null);
    
    uiStore.showToast("🎉 Plan added to your library!", "success");
    
    // Route back to the main plan tab
    router.replace("/(tabs)/plan");
  }

  function onPressExerciseACB(index) {
    router.push("/action/" + index + "?source=generated");
  }

  async function onRegenerateACB() {
    if (isRegenerating) return;

    try {
      setIsRegenerating(true);
      const generationParams = getGenerationParams(searchParams);
      const nextPlan = await generateAiPlan({
        ...generationParams,
        avoidExerciseNames: (planStore.generatedPlan?.exercises || []).map(function getExerciseNameCB(exercise) {
          return exercise.searchName || exercise.name;
        }),
      });
      planStore.setGeneratedPlan(nextPlan);
    } catch (err) {
      uiStore.showToast("⚠️ Failed to regenerate plan: " + (err.message || "Unknown error"), "error");
    } finally {
      setIsRegenerating(false);
    }
  }

  // ── Editable handlers for previewed plan ──

  var onEditExerciseACB = action(function onEditExerciseACB(exerciseIndex, field, value) {
    var num = parseInt(value, 10);
    if (isNaN(num) || num < 0) return;
    if (!planStore.generatedPlan) return;
    var exercises = [...planStore.generatedPlan.exercises];
    exercises[exerciseIndex] = { ...exercises[exerciseIndex], [field]: num };
    planStore.generatedPlan = { ...planStore.generatedPlan, exercises: exercises };
  });

  var onRenamePlanACB = action(function onRenamePlanACB(newName) {
    if (!planStore.generatedPlan) return;
    planStore.generatedPlan = { ...planStore.generatedPlan, name: newName };
  });

  return (
    <PlanView
      plan={plan}
      previewMode={true}
      onSavePlan={onAddToPlanACB}
      onRegenerate={onRegenerateACB}
      isRegenerating={isRegenerating}
      onPressExercise={onPressExerciseACB}
      onMarkCompleted={function () {}}
      onEditExercise={onEditExerciseACB}
      onRenamePlan={onRenamePlanACB}
      onDeletePlan={function () {}}
    />
  );
});

function getGenerationParams(searchParams) {
  var duration = Number(readParamValue(searchParams.duration)) || 30;
  var experienceLevel = readParamValue(searchParams.experienceLevel) || "beginner";
  var targetMuscle = readParamValue(searchParams.targetMuscle) || "full body";
  var equipment = [];
  var equipmentParam = readParamValue(searchParams.equipment);

  if (equipmentParam) {
    try {
      equipment = JSON.parse(equipmentParam);
    } catch {
      equipment = [];
    }
  }

  return {
    duration,
    experienceLevel,
    targetMuscle,
    equipment: Array.isArray(equipment) ? equipment : [],
  };
}

function readParamValue(value) {
  return Array.isArray(value) ? value[0] : value;
}
