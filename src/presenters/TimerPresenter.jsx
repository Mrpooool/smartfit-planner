import { Ionicons } from "@expo/vector-icons";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "expo-router";
import { planStore } from "../model/planStore";
import { uiStore } from "../model/uiStore";
import { TimerView } from "../views/TimerView";

export default observer(function TimerPresenter() {
  const router = useRouter();
  const [timeMs, setTimeMs] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const intervalRef = useRef(null);

  // Find the selected plan
  const selectedPlan = selectedPlanId
    ? planStore.savedPlans.find(function findPlanCB(p) { return p.id === selectedPlanId; })
    : null;

  useEffect(function timerEffectACB() {
    if (isRunning) {
      intervalRef.current = setInterval(function tickCB() {
        setTimeMs(function incCB(prev) { return prev + 30; });
      }, 30);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return function cleanupTimerCB() {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  function onStartPauseACB() {
    setIsRunning(function toggleCB(prev) { return !prev; });
  }

  function onStopACB() {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const exercises = selectedPlan?.exercises || [];
    const exerciseCount = exercises.length;
    const currentExercise = exercises[currentExerciseIndex];
    const totalSets = currentExercise?.sets || 1;

    // Plan is completed only if user manually clicks stop on the last set of the last exercise
    const isPlanCompleted = selectedPlan != null && 
                            exerciseCount > 0 && 
                            currentExerciseIndex === exerciseCount - 1 && 
                            currentSet >= totalSets;

    const seconds = Math.floor(timeMs / 1000);

    if (seconds >= 60) {
      // Save the workout time
      const today = new Date().toISOString().split("T")[0];
      planStore.addWorkoutTime(today, seconds);
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      
      if (isPlanCompleted) {
        planStore.markCompleted(selectedPlan.id, today);
        uiStore.showToast("🎉 Plan Completed!\nWorkout saved: " + mins + "m " + secs + "s", "success");
        uiStore.setConfetti(true);
      } else {
        uiStore.showToast("Workout saved: " + mins + "m " + secs + "s", "success");
      }
    } else {
      // If less than 60s, do not save, do not prompt.
    }

    setTimeMs(0);
    setSelectedPlanId(null);
    setCurrentExerciseIndex(0);
    setCurrentSet(1);
  }

  function onSelectPlanACB(planId) {
    setSelectedPlanId(planId);
    setCurrentExerciseIndex(0);
    setCurrentSet(1);
  }

  function onNextSetACB() {
    if (!selectedPlan) return;
    const exercises = selectedPlan.exercises || [];
    const exerciseCount = exercises.length;
    if (exerciseCount === 0) return;

    const currentExercise = exercises[currentExerciseIndex];
    const totalSets = currentExercise?.sets || 1;

    if (currentSet < totalSets) {
      setCurrentSet(function incSetCB(prev) { return prev + 1; });
    } else {
      setCurrentSet(1);
      if (currentExerciseIndex < exerciseCount - 1) {
        setCurrentExerciseIndex(function nextExCB(prev) { return prev + 1; });
      } else {
        // Last exercise and last set reached. Do not auto-stop.
        // Wait for user to click Stop to officially complete.
        setCurrentSet(totalSets); // keep it at max
        uiStore.showToast("All sets finished! Click Stop to complete.", "info");
      }
    }
  }

  function onExercisePressACB(exercise) {
    if (!exercise) return;
    const planSource = selectedPlanId ? "generated" : "generated";
    // Navigate to detail view
    const exerciseIndex = (selectedPlan?.exercises || []).indexOf(exercise);
    if (exerciseIndex >= 0) {
      planStore.setCurrentPlan(selectedPlan);
      router.push("/action/" + exerciseIndex);
    }
  }

  function onBackFromPlanACB() {
    setSelectedPlanId(null);
    setCurrentExerciseIndex(0);
    setCurrentSet(1);
  }

  return (
    <TimerView
      timeMs={timeMs}
      isRunning={isRunning}
      onStartPause={onStartPauseACB}
      onStop={onStopACB}
      savedPlans={planStore.savedPlans}
      selectedPlan={selectedPlan}
      currentExerciseIndex={currentExerciseIndex}
      currentSet={currentSet}
      showConfetti={uiStore.showConfetti}
      onSelectPlan={onSelectPlanACB}
      onNextSet={onNextSetACB}
      onExercisePress={onExercisePressACB}
      onBackFromPlan={onBackFromPlanACB}
    />
  );
});
