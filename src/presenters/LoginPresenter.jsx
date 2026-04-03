import { observer } from "mobx-react-lite";
import { useState } from "react";
import { uiStore } from "../model/uiStore";
import { loginUser, } from "../persistence/authRepo";
import { LoginView } from "../views/LoginView";

export default observer(function LoginPresenter() {

  const [isLoading,setIsLoading]=useState(false);
  const [error,setError]=useState(null);

  async function onLoginACB(email, password) {
    setIsLoading(true);
    setError(null);
    try{
      await loginUser(email, password)
      uiStore.showToast("Login Succesfully","success")
    }catch(err){
      const errormessage = getErrorMessage(err.code);
      setError(errormessage);
      uiStore.showToast(errormessage,"error")
    }finally{
      setIsLoading(false);
    }
    
  }

  function getErrorMessage(code) {
    const errorMap = {
      "auth/invalid-credential": "Password wrong, try again",
    };
  return errorMap[code] || `Login failed: ${code || "unknown error"}`;
  }

  return (
    <LoginView
      onLogin={onLoginACB}
      error={error}
      isLoading={isLoading}
    />
  );
});
