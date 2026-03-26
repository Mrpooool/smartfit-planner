import { observable, action } from "mobx";

const model = {
  /** @type {import('../types/workout').WorkoutPlan | null} */
  currentPlan: null,

  /** @type {import('../types/workout').WorkoutPlan | null} */
  generatedPlan: null,

  /** @type {import('../types/workout').WorkoutPlan[]} */
  savedPlans: [],

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
  }),

  // Update a single field (e.g. "sets", "reps") on one exercise inside currentPlan
  updateExerciseField: action(function updateExerciseField(exerciseIndex, field, value) {
    if (!this.currentPlan) return;
    const exercises = [...this.currentPlan.exercises];
    exercises[exerciseIndex] = { ...exercises[exerciseIndex], [field]: value };
    this.currentPlan = { ...this.currentPlan, exercises };
  }),

  renamePlan: action(function renamePlan(newName) {
    if (!this.currentPlan) return;
    this.currentPlan = { ...this.currentPlan, name: newName };
  }),
};

export const planStore = observable(model);