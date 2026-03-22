import { observable, action } from "mobx";

const model = {
  /** @type {import('../types/workout').WorkoutPlan | null} */
  currentPlan: null,

  /** @type {import('../types/workout').WorkoutPlan[]} */
  savedPlans: [],

  ready: false, // true once Firestore data is loaded

  setCurrentPlan: action(function setCurrentPlan(plan) {
    this.currentPlan = plan;
  }),

  addSavedPlan: action(function addSavedPlan(plan) {
    this.savedPlans = [...this.savedPlans, plan];  
  }),

  removeSavedPlan: action(function removeSavedPlan(planId) {
    this.savedPlans = this.savedPlans.filter(function matchIdCB(p) {
      return p.id !== planId;
    });
  }),

  markCompleted: action(function markCompleted(planId, date) {
    const plan = this.savedPlans.find(function matchIdCB(p) {
      return p.id === planId;
    })
    if(plan !== undefined) {
      plan.completedDates = [...plan.completedDates, date];
    }
  }),
  
};

export const planStore = observable(model);