import { action, observable } from "mobx";

export const userStore = observable({
  uid: null,
  email: null,
  username: null,
  showAnimatedListImages: false,
  ready: false,

  setUser: action(function setUser(uid, email, username) {
    this.uid = uid;
    this.email = email;
    this.username = username || email;
    this.ready = true;
  }),

  setShowAnimatedListImages: action(function setShowAnimatedListImages(value) {
    this.showAnimatedListImages = Boolean(value);
  }),

  clearUser: action(function clearUser() {
    this.uid = null;
    this.email = null;
    this.username = null;
    this.showAnimatedListImages = false;
    this.ready = true;
  }),
});
