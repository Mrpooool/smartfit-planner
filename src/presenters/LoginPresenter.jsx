import { observer } from "mobx-react-lite";
import { useState } from "react";
import { uiStore } from "../model/uiStore";
import { userStore } from "../model/userStore";
import { loginUser } from "../persistence/authRepo";
import { LoginView } from "../views/LoginView";

export default observer(function LoginPresenter() {

  const [isLoading,setIsLoading]=useState(false);
  const [error,setError]=useState(null);

  async function onLoginACB(email, password) {
    setIsLoading(true);
    setError(null);
    try{
      const credential = await loginUser(email, password);
      const displayName = credential.user.displayName || credential.user.email;
      uiStore.showToast("Welcome! " + displayName, "success");
    }catch(err){
      const errormessage = getErrorMessage(err.code);
      setError(errormessage);
      uiStore.showToast(errormessage,"error");
    }finally{
      setIsLoading(false);
    }
    
  }

  function getErrorMessage(code) {
    const errorMap = {
      "auth/invalid-credential": "Username or password not correct, please try again",
      "auth/user-not-found": "Username or password not correct, please try again",
      "auth/wrong-password": "Username or password not correct, please try again",
      "auth/invalid-email": "Please enter a valid email address",
      "auth/too-many-requests": "Too many attempts, please try again later",
    };
  return errorMap[code] || "Username or password not correct, please try again";
  }

  return (
    <LoginView
      onLogin={onLoginACB}
      error={error}
      isLoading={isLoading}
    />
  );
});
