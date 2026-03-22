import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { firebaseApp } from "./firebaseConfig";
import { userStore } from "../model/userStore";

const auth = getAuth(firebaseApp);

// Call once on app startup (e.g. in root _layout useEffect).
// Listens for auth state changes and updates userStore accordingly.
// This is what sets userStore.ready = true, which unblocks the root layout.
export function connectAuth() {
  onAuthStateChanged(auth, function onAuthStateChangedACB(user) {
    if (user) {
      userStore.setUser(user.uid, user.email);
    } else {
      userStore.clearUser();
    }
  });
}

export function loginUser(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function registerUser(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export function logoutUser() {
  return signOut(auth);
}
