import { observable, action } from "mobx";

export const userStore = observable({
  uid: null,   // Firebase Auth uid — null means not logged in
  email: null,
  ready: false, // true once Firebase Auth state is resolved (onAuthStateChanged fires)

  setUser: action(function setUser(uid, email) {
    this.uid = uid;
    this.email = email;
    this.ready = true;
  }),

  clearUser: action(function clearUser() {
    this.uid = null;
    this.email = null;
    this.ready = true;
  }),
});
