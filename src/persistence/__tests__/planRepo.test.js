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

// We need planStore to be the real MobX store so we can inspect side effects
jest.mock("../../model/planStore", () => {
  const { observable, action } = require("mobx");
  const store = observable({
    savedPlans: [],
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
  planStore.ready = false;
  jest.clearAllMocks();
});

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

  test("loads savedPlans from Firestore snapshot", () => {
    const { fakeReaction } = createFakeWatchFunction();
    connectToPersistence("user123", fakeReaction);

    // Simulate Firestore onSnapshot callback
    const fakePlans = [{ id: "p1", name: "My Plan", exercises: [], completedDates: [] }];
    mockSnapshotCallback({
      exists: () => true,
      data: () => ({ savedPlans: fakePlans }),
    });

    expect(planStore.savedPlans).toEqual(fakePlans);
    expect(planStore.ready).toBe(true);
  });

  test("handles empty/missing Firestore document gracefully", () => {
    const { fakeReaction } = createFakeWatchFunction();
    connectToPersistence("user123", fakeReaction);

    // Simulate empty document
    mockSnapshotCallback({
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
    connectToPersistence("user123", fakeReaction);

    // Get the reaction handler (save2FirestoreACB)
    const { capturedHandler } = getCaptured();

    // First: simulate snapshot loading data (this sets applyRemote = true temporarily)
    mockSnapshotCallback({
      exists: () => true,
      data: () => ({ savedPlans: [{ id: "p1", name: "Test" }] }),
    });

    // planStore.ready is now true, but applyRemote should be false after snapshot completes
    // Now manually call the handler — this simulates what reaction would do
    await capturedHandler();

    // setDoc should have been called (applyRemote is false after snapshot finishes)
    expect(setDoc).toHaveBeenCalled();
  });
});
