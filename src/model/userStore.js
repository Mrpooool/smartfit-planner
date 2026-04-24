import { action, observable } from "mobx";

export const userStore = observable({
  uid: null,   // Firebase Auth uid — null means not logged in
  email: null,
  username: null,
  ready: false, // true once Firebase Auth state is resolved (onAuthStateChanged fires)

  setUser: action(function setUser(uid, email, username) {
    this.uid = uid;
    this.email = email;
    this.username = username || email;
    this.ready = true;
  }),

  clearUser: action(function clearUser() {
    this.uid = null;
    this.email = null;
    this.username = null;
    this.ready = true;
  }),
});
