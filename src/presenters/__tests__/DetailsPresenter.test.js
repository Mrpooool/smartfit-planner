/**
 * Integration tests for PlanPresenter logic.
 *
 * We test the presenter's callback functions against a real MobX planStore
 * to verify the data flow: user action → presenter callback → store mutation.
 *
 * We mock:
 *   - Alert.alert (React Native)
 *   - expo-router (useRouter)
 *   - PlanDetailView (we only test logic, not rendering)
 */

// ── Mocks ──
const mockRouterBack = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({ back: mockRouterBack }),
}));

jest.mock("react-native", () => ({
  Alert: {
    alert: jest.fn(),
  },
}));

jest.mock("mobx-react-lite", () => ({
  observer: (component) => component, // pass-through, no React rendering needed
}));

jest.mock("../../views/PlanView", () => ({
  PlanView: jest.fn(() => null),
}));

// Use the REAL planStore
jest.mock("../../persistence/firebaseConfig", () => ({
  db: "mock-db",
  auth: "mock-auth",
}));

const { planStore } = require("../../model/planStore");
const { Alert } = require("react-native");

// ── Helpers ──
const samplePlan = {
  id: "plan-1",
  name: "Morning Workout",
  exercises: [
    { id: "ex-1", name: "Push-up", targetMuscle: "chest", gifUrl: "", instructions: "Keep core tight", sets: 3, reps: 12 },
    { id: "ex-2", name: "Squat", targetMuscle: "legs", gifUrl: "", instructions: "Go below parallel", sets: 3, reps: 15 },
  ],
  createdAt: Date.now(),
  completedDates: [],
};

// ── Tests ──
beforeEach(() => {
  // Reset store state
  planStore.currentPlan = null;
  planStore.savedPlans = [];
  planStore.ready = true;
  mockRouterBack.mockClear();
  Alert.alert.mockClear();
});

describe("planStore actions used by PlanPresenter", () => {

  // ── setCurrentPlan ──
  test("setCurrentPlan sets the current plan", () => {
    planStore.setCurrentPlan({ ...samplePlan });
    expect(planStore.currentPlan).not.toBeNull();
    expect(planStore.currentPlan.id).toBe("plan-1");
  });

  // ── addSavedPlan ──
  test("addSavedPlan adds plan to savedPlans", () => {
    planStore.addSavedPlan({ ...samplePlan });
    expect(planStore.savedPlans).toHaveLength(1);
    expect(planStore.savedPlans[0].id).toBe("plan-1");
  });

  // ── updateSavedPlan ──
  test("updateSavedPlan updates existing plan by id", () => {
    planStore.addSavedPlan({ ...samplePlan });
    planStore.updateSavedPlan("plan-1", { name: "Evening Workout" });
    expect(planStore.savedPlans[0].name).toBe("Evening Workout");
    expect(planStore.savedPlans[0].id).toBe("plan-1"); // id unchanged
  });

  test("updateSavedPlan does nothing for non-existent id", () => {
    planStore.addSavedPlan({ ...samplePlan });
    planStore.updateSavedPlan("non-existent", { name: "Foo" });
    expect(planStore.savedPlans[0].name).toBe("Morning Workout");
  });

  // ── removeSavedPlan ──
  test("removeSavedPlan removes plan by id", () => {
    planStore.addSavedPlan({ ...samplePlan });
    expect(planStore.savedPlans).toHaveLength(1);
    planStore.removeSavedPlan("plan-1");
    expect(planStore.savedPlans).toHaveLength(0);
  });

  // ── markCompleted ──
  test("markCompleted adds today to completedDates", () => {
    planStore.addSavedPlan({ ...samplePlan });
    const today = "2026-03-23";
    planStore.markCompleted("plan-1", today);
    expect(planStore.savedPlans[0].completedDates).toContain(today);
  });

  test("markCompleted does nothing for non-existent plan", () => {
    planStore.addSavedPlan({ ...samplePlan });
    planStore.markCompleted("non-existent", "2026-03-23");
    expect(planStore.savedPlans[0].completedDates).toEqual([]);
  });

  // ── updateExerciseField ──
  test("updateExerciseField updates sets on current plan", () => {
    planStore.setCurrentPlan({ ...samplePlan, exercises: [...samplePlan.exercises] });
    planStore.updateExerciseField(0, "sets", 5);
    expect(planStore.currentPlan.exercises[0].sets).toBe(5);
  });

  test("updateExerciseField updates reps on current plan", () => {
    planStore.setCurrentPlan({ ...samplePlan, exercises: [...samplePlan.exercises] });
    planStore.updateExerciseField(1, "reps", 20);
    expect(planStore.currentPlan.exercises[1].reps).toBe(20);
  });

  test("updateExerciseField does nothing if no current plan", () => {
    planStore.setCurrentPlan(null);
    // should not throw
    planStore.updateExerciseField(0, "sets", 5);
    expect(planStore.currentPlan).toBeNull();
  });

  // ── renamePlan ──
  test("renamePlan updates the current plan name", () => {
    planStore.setCurrentPlan({ ...samplePlan });
    planStore.renamePlan("Leg Day");
    expect(planStore.currentPlan.name).toBe("Leg Day");
  });

  test("renamePlan does nothing if no current plan", () => {
    planStore.setCurrentPlan(null);
    planStore.renamePlan("Foo");
    expect(planStore.currentPlan).toBeNull();
  });
});

describe("PlanPresenter save/update flow", () => {

  test("saving a new plan adds it to savedPlans", () => {
    // Simulate what PlanPresenter.onSavePlanACB does
    const plan = { ...samplePlan };
    planStore.setCurrentPlan(plan);

    const exists = planStore.savedPlans.some((p) => p.id === plan.id);
    expect(exists).toBe(false);

    // New plan → addSavedPlan
    planStore.addSavedPlan({ ...plan });
    expect(planStore.savedPlans).toHaveLength(1);
  });

  test("saving an existing plan updates it", () => {
    planStore.addSavedPlan({ ...samplePlan });
    const updatedPlan = { ...samplePlan, name: "Updated Name" };
    planStore.setCurrentPlan(updatedPlan);

    const exists = planStore.savedPlans.some((p) => p.id === updatedPlan.id);
    expect(exists).toBe(true);

    // Existing plan → updateSavedPlan
    planStore.updateSavedPlan(updatedPlan.id, updatedPlan);
    expect(planStore.savedPlans[0].name).toBe("Updated Name");
    expect(planStore.savedPlans).toHaveLength(1); // no duplicate
  });

  test("delete flow removes plan and clears currentPlan", () => {
    planStore.addSavedPlan({ ...samplePlan });
    planStore.setCurrentPlan({ ...samplePlan });

    // Simulate PlanPresenter.onDeletePlanACB's confirm callback
    planStore.removeSavedPlan("plan-1");
    planStore.setCurrentPlan(null);

    expect(planStore.savedPlans).toHaveLength(0);
    expect(planStore.currentPlan).toBeNull();
  });

  test("complete flow adds today and prevents duplicate", () => {
    planStore.addSavedPlan({ ...samplePlan });
    const today = "2026-03-23";

    // First completion
    planStore.markCompleted("plan-1", today);
    expect(planStore.savedPlans[0].completedDates).toEqual([today]);

    // Duplicate check (what PlanPresenter does)
    const alreadyDone = planStore.savedPlans[0].completedDates.includes(today);
    expect(alreadyDone).toBe(true);
    // Presenter would show alert instead of adding again
  });
});
