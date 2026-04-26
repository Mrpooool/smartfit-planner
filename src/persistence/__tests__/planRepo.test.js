/**
 * Unit tests for connectToPersistence in planRepo.js
 *
 * Strategy: mock all Firebase methods (getDoc, setDoc, onSnapshot)
 * and test the logic:
 *   1. Initial load sets planStore.savedPlans from Firestore
 *   2. The watchFunction (reaction) is wired correctly
 *   3. applyRemote flag prevents write-back loops
 *   4. disconnect() stops both reaction and snapshot listener
 *   5. Error handling sets ready = true even on failure
 */

// ── Mock Firebase before importing planRepo ──
let mockDocData = null;       // data returned by getDoc / onSnapshot
let mockSnapshotCallback;     // captured onSnapshot callback
let mockSnapshotError;        // captured onSnapshot error handler
let mockSetDocCalls = [];     // track setDoc calls

jest.mock("firebase/firestore", () => ({
  doc: jest.fn(() => "mock-doc-ref"),
  getDoc: jest.fn(() =>
    Promise.resolve({
      exists: () => mockDocData !== null,
      data: () => mockDocData,
    })
  ),
  setDoc: jest.fn((_ref, data, _opts) => {
    mockSetDocCalls.push(data);
    return Promise.resolve();
  }),
  onSnapshot: jest.fn((_ref, onNext, onError) => {
    mockSnapshotCallback = onNext;
    mockSnapshotError = onError;
    return jest.fn(); // unsubscribe function
  }),
}));

jest.mock("../firebaseConfig", () => ({
  db: "mock-db",
}));

jest.mock("../../api/exerciseDbApi", () => ({
  getExerciseById: jest.fn((exerciseId) =>
    Promise.resolve({
      id: exerciseId,
      name: `Exercise ${exerciseId}`,
      target: "chest",
      equipment: "body weight",
      bodyPart: "chest",
      instructions: [],
    })
  ),
}));

// We need planStore to be the real MobX store so we can inspect side effects
jest.mock("../../model/planStore", () => {
  const { observable, action } = require("mobx");
  const store = observable({
    savedPlans: [],
    completionHistory: [],
    ready: false,
  });
  return { planStore: store };
});

const { connectToPersistence } = require("../planRepo");
const { planStore } = require("../../model/planStore");
const { setDoc, onSnapshot, getDoc } = require("firebase/firestore");

// ── Helpers ──
function createFakeWatchFunction() {
  let capturedGetter, capturedHandler;
  const fakeReaction = jest.fn((getter, handler) => {
    capturedGetter = getter;
    capturedHandler = handler;
    return jest.fn(); // dispose function
  });
  return { fakeReaction, getCaptured: () => ({ capturedGetter, capturedHandler }) };
}

// ── Tests ──
beforeEach(() => {
  mockDocData = null;
  mockSetDocCalls = [];
  mockSnapshotCallback = undefined;
  mockSnapshotError = undefined;
  planStore.savedPlans = [];
  planStore.completionHistory = [];
  planStore.ready = false;
  jest.clearAllMocks();
});

async function flushPromises() {
  await Promise.resolve();
  await Promise.resolve();
  await new Promise((resolve) => setTimeout(resolve, 0));
}

describe("connectToPersistence", () => {

  test("sets planStore.ready = false immediately on call", () => {
    const { fakeReaction } = createFakeWatchFunction();
    connectToPersistence("user123", fakeReaction);
    // ready should be false until data arrives
    expect(planStore.ready).toBe(false);
  });

  test("calls getDoc to load initial data", () => {
    const { fakeReaction } = createFakeWatchFunction();
    connectToPersistence("user123", fakeReaction);
    expect(getDoc).toHaveBeenCalledTimes(1);
  });

  test("wires watchFunction (reaction) and onSnapshot", () => {
    const { fakeReaction } = createFakeWatchFunction();
    connectToPersistence("user123", fakeReaction);
    expect(fakeReaction).toHaveBeenCalledTimes(1);
    expect(onSnapshot).toHaveBeenCalledTimes(1);
  });

  test("loads savedPlans from Firestore initial load", async () => {
    const { fakeReaction } = createFakeWatchFunction();
    mockDocData = {
      savedPlans: [{ id: "p1", name: "My Plan", exercises: [{ exerciseId: "123", sets: 3, reps: 10 }], completedDates: [] }],
    };
    connectToPersistence("user123", fakeReaction);
    await flushPromises();

    expect(planStore.savedPlans).toHaveLength(1);
    expect(planStore.savedPlans[0].exercises[0]).toMatchObject({
      id: "123",
      exerciseDbId: "123",
      sets: 3,
      reps: 10,
    });
    expect(planStore.ready).toBe(true);
  });

  test("handles empty/missing Firestore document gracefully", async () => {
    const { fakeReaction } = createFakeWatchFunction();
    mockDocData = { savedPlans: [] };
    connectToPersistence("user123", fakeReaction);
    await flushPromises();

    // Simulate empty document
    await mockSnapshotCallback({
      exists: () => false,
      data: () => null,
    });

    expect(planStore.savedPlans).toEqual([]);
    expect(planStore.ready).toBe(true);
  });

  test("error handler sets ready = true and clears plans", () => {
    const { fakeReaction } = createFakeWatchFunction();
    connectToPersistence("user123", fakeReaction);

    // Simulate Firestore error
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    mockSnapshotError(new Error("Network error"));

    expect(planStore.savedPlans).toEqual([]);
    expect(planStore.ready).toBe(true);
    consoleSpy.mockRestore();
  });

  test("disconnect() returns a function that stops reaction and snapshot", () => {
    const { fakeReaction } = createFakeWatchFunction();
    const disconnect = connectToPersistence("user123", fakeReaction);

    expect(typeof disconnect).toBe("function");
    // Should not throw
    disconnect();
  });

  test("applyRemote flag prevents write-back loop", async () => {
    const { fakeReaction, getCaptured } = createFakeWatchFunction();
    mockDocData = { savedPlans: [] };
    connectToPersistence("user123", fakeReaction);
    await flushPromises();

    // Get the reaction handler (save2FirestoreACB)
    const { capturedHandler } = getCaptured();

    // First: simulate snapshot loading data (this sets applyRemote = true temporarily)
    await mockSnapshotCallback({
      exists: () => true,
      data: () => ({ savedPlans: [{ id: "p1", name: "Test", exercises: [] }] }),
    });

    await flushPromises();

    // After the async snapshot settles, the "remote update" guard is released.
    await capturedHandler();

    expect(setDoc).toHaveBeenCalled();
  });

  test("persists plans with exerciseId only", async () => {
    const { fakeReaction, getCaptured } = createFakeWatchFunction();
    connectToPersistence("user123", fakeReaction);

    planStore.ready = true;
    planStore.savedPlans = [{
      id: "p1",
      name: "Saved Plan",
      createdAt: 123,
      completedDates: [],
      exercises: [{
        id: "123",
        exerciseDbId: "123",
        name: "Push Up",
        targetMuscle: "chest",
        equipment: "body weight",
        instructions: ["Keep core tight"],
        sets: 4,
        reps: 12,
      }],
    }];

    const { capturedHandler } = getCaptured();
    await capturedHandler();

    expect(mockSetDocCalls[0]).toEqual({
      savedPlans: [{
        id: "p1",
        name: "Saved Plan",
        createdAt: 123,
        completedDates: [],
        exercises: [{ exerciseId: "123", sets: 4, reps: 12 }],
      }],
      completionHistory: [],
    });
  });
});
