import { observable, action } from "mobx";

const model = {
  /** @type {import('../types/workout').WorkoutPlan | null} */
  currentPlan: null,

  /** @type {import('../types/workout').WorkoutPlan | null} */
  generatedPlan: null,

  /** @type {import('../types/workout').WorkoutPlan[]} */
  savedPlans: [],

  /** @type {string[]} All completion date strings, independent of plan lifecycle */
  completionHistory: [],

  ready: false, // true once Firestore data is loaded

  setCurrentPlan: action(function setCurrentPlan(plan) {
    this.currentPlan = plan;
  }),

  setGeneratedPlan: action(function setGeneratedPlan(plan) {
    this.generatedPlan = plan;
  }),

  addSavedPlan: action(function addSavedPlan(plan) {
    this.savedPlans = [...this.savedPlans, plan];  
  }),

  updateSavedPlan: action(function updateSavedPlan(planId, updates) {
    this.savedPlans = this.savedPlans.map(function mapPlanCB(p) {
      return p.id === planId ? { ...p, ...updates } : p;
    });
  }),

  removeSavedPlan: action(function removeSavedPlan(planId) {
    this.savedPlans = this.savedPlans.filter(function matchIdCB(p) {
      return p.id !== planId;
    });
  }),

  markCompleted: action(function markCompleted(planId, date) {
    // 1. Rebuild savedPlans array to trigger MobX observers reliably
    this.savedPlans = this.savedPlans.map(function mapPlanCB(p) {
      if (p.id === planId) {
        return { ...p, completedDates: [...(p.completedDates || []), date] };
      }
      return p;
    });

    // 2. Rebuild currentPlan reference to trigger UI React components
    if (this.currentPlan && this.currentPlan.id === planId) {
      this.currentPlan = {
        ...this.currentPlan,
        completedDates: [...(this.currentPlan.completedDates || []), date]
      };
    }

    // 3. Append to completionHistory (independent of plan lifecycle)
    this.completionHistory = [...this.completionHistory, date];
  }),

  setCompletionHistory: action(function setCompletionHistory(history) {
    this.completionHistory = Array.isArray(history) ? history : [];
  }),

  // Update a single field (e.g. "sets", "reps") on one exercise inside currentPlan
  updateExerciseField: action(function updateExerciseField(exerciseIndex, field, value) {
    if (!this.currentPlan) return;
    const exercises = [...this.currentPlan.exercises];
    exercises[exerciseIndex] = { ...exercises[exerciseIndex], [field]: value };
    this.currentPlan = { ...this.currentPlan, exercises };
    
    // Auto-sync
    const currentId = this.currentPlan.id;
    this.savedPlans = this.savedPlans.map(function mapCB(p) {
      return p.id === currentId ? { ...p, exercises: exercises } : p;
    });
  }),

  renamePlan: action(function renamePlan(newName) {
    if (!this.currentPlan) return;
    this.currentPlan = { ...this.currentPlan, name: newName };

    // Auto-sync
    const currentId = this.currentPlan.id;
    this.savedPlans = this.savedPlans.map(function mapCB(p) {
      return p.id === currentId ? { ...p, name: newName } : p;
    });
  }),

  createNewPlan: action(function createNewPlan(name) {
    const newPlan = {
      id: `custom-${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
      name: name || "New Plan",
      createdAt: Date.now(),
      completedDates: [],
      exercises: [],
    };
    this.savedPlans = [...this.savedPlans, newPlan];
    this.currentPlan = newPlan;
    return newPlan;
  }),

  addExerciseToPlan: action(function addExerciseToPlan(planId, exercise) {
    var targetPlan = null;
    for (var i = 0; i < this.savedPlans.length; i++) {
      if (this.savedPlans[i].id === planId) {
        targetPlan = this.savedPlans[i];
        break;
      }
    }
    if (!targetPlan) return "not_found";

    var nextExerciseId = getExerciseKey(exercise);
    var isDuplicate = (targetPlan.exercises || []).some(function matchCB(ex) {
      return getExerciseKey(ex) === nextExerciseId;
    });
    if (isDuplicate) return "duplicate";

    var updatedExercises = [...(targetPlan.exercises || []), exercise];
    this.savedPlans = this.savedPlans.map(function mapCB(p) {
      return p.id === planId ? { ...p, exercises: updatedExercises } : p;
    });

    if (this.currentPlan && this.currentPlan.id === planId) {
      this.currentPlan = { ...this.currentPlan, exercises: updatedExercises };
    }
    return "added";
  }),
};

export const planStore = observable(model);

function getExerciseKey(exercise) {
  return String(exercise?.exerciseDbId || exercise?.exerciseId || exercise?.id || "");
}
