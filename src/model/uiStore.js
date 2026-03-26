import { observable, action } from "mobx";

const model = {
  toastMessage: null,
  toastType: "info", // "info" | "success" | "warning"

  showToast: action(function(message, type = "info", duration = 3000) {
    this.toastMessage = message;
    this.toastType = type;
    
    if (this._timeout) clearTimeout(this._timeout);
    this._timeout = setTimeout(action(() => {
      this.toastMessage = null;
    }), duration);
  }),
};

export const uiStore = observable(model);
