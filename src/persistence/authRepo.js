import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { userStore } from "../model/userStore";
import { auth } from "./firebaseConfig";

// Call once on app startup (e.g. in root _layout useEffect).
// Listens for auth state changes and updates userStore accordingly.
// This is what sets userStore.ready = true, which unblocks the root layout.
export function connectAuth() {
  onAuthStateChanged(auth, function onAuthStateChangedACB(user) {
    if (user) {
      userStore.setUser(user.uid, user.email, user.displayName);
    } else {
      userStore.clearUser();
    }
  });
}

export function loginUser(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function registerUser(email, password, username) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const displayName = username.trim();

  await updateProfile(credential.user, { displayName });
  userStore.setUser(credential.user.uid, credential.user.email, displayName);

  return credential;
}

export function logoutUser() {
  return signOut(auth);
}

export function resetPassword(email) {
  return sendPasswordResetEmail(auth, email);
}
