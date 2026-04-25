let mockDocData = null;
let mockSnapshotCallback;
let mockSetDocCalls = [];

jest.mock("firebase/firestore", () => ({
  doc: jest.fn(() => "mock-doc-ref"),
  getDoc: jest.fn(() =>
    Promise.resolve({
      exists: () => mockDocData !== null,
      data: () => mockDocData,
    })
  ),
  setDoc: jest.fn((_ref, data) => {
    mockSetDocCalls.push(data);
    return Promise.resolve();
  }),
  onSnapshot: jest.fn((_ref, onNext) => {
    mockSnapshotCallback = onNext;
    return jest.fn();
  }),
}));

jest.mock("../firebaseConfig", () => ({
  db: "mock-db",
}));

jest.mock("../../model/uiStore", () => ({
  uiStore: {
    showToast: jest.fn(),
  },
}));

jest.mock("../../model/userStore", () => {
  const { observable, action } = require("mobx");
  return {
    userStore: observable({
      uid: "user123",
      showAnimatedListImages: false,
      setShowAnimatedListImages: action(function setShowAnimatedListImages(value) {
        this.showAnimatedListImages = Boolean(value);
      }),
    }),
  };
});

const { connectUserPrefsPersistence } = require("../userPrefsRepo");
const { userStore } = require("../../model/userStore");

function createFakeWatchFunction() {
  let capturedHandler;
  const fakeReaction = jest.fn((_getter, handler) => {
    capturedHandler = handler;
    return jest.fn();
  });
  return { fakeReaction, getCapturedHandler: () => capturedHandler };
}

async function flushPromises() {
  await Promise.resolve();
  await Promise.resolve();
  await new Promise((resolve) => setTimeout(resolve, 0));
}

beforeEach(() => {
  mockDocData = null;
  mockSnapshotCallback = undefined;
  mockSetDocCalls = [];
  userStore.uid = "user123";
  userStore.showAnimatedListImages = false;
  jest.clearAllMocks();
});

describe("connectUserPrefsPersistence", () => {
  test("loads saved preference from Firestore", async () => {
    mockDocData = { showAnimatedListImages: true };
    const { fakeReaction } = createFakeWatchFunction();

    connectUserPrefsPersistence("user123", fakeReaction);
    await flushPromises();

    expect(userStore.showAnimatedListImages).toBe(true);
  });

  test("persists preference changes", async () => {
    const { fakeReaction, getCapturedHandler } = createFakeWatchFunction();

    connectUserPrefsPersistence("user123", fakeReaction);
    await flushPromises();
    userStore.showAnimatedListImages = true;

    await getCapturedHandler()();

    expect(mockSetDocCalls[0]).toEqual({
      showAnimatedListImages: true,
    });
  });

  test("applies snapshot updates after initial load", async () => {
    mockDocData = { showAnimatedListImages: false };
    const { fakeReaction } = createFakeWatchFunction();

    connectUserPrefsPersistence("user123", fakeReaction);
    await flushPromises();
    await mockSnapshotCallback({
      exists: () => true,
      data: () => ({ showAnimatedListImages: true }),
    });
    await flushPromises();

    expect(userStore.showAnimatedListImages).toBe(true);
  });

  test("does not persist before initial load finishes", async () => {
    mockDocData = { showAnimatedListImages: false };
    const { fakeReaction, getCapturedHandler } = createFakeWatchFunction();

    connectUserPrefsPersistence("user123", fakeReaction);
    userStore.showAnimatedListImages = true;

    await getCapturedHandler()();

    expect(mockSetDocCalls).toEqual([]);
  });
});
