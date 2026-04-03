import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { userStore } from "../model/userStore";
import { auth } from "./firebaseConfig";

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

export function resetPassword(email) {
  return sendPasswordResetEmail(auth, email);
}
