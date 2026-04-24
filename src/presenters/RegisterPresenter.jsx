import { useRouter } from "expo-router";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { uiStore } from "../model/uiStore";
import { registerUser } from "../persistence/authRepo";
import { RegisterView } from "../views/RegisterView";

export default observer(function RegisterPresenter() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function onRegisterACB(email, password, username) {
    const trimmedEmail = email.trim();
    const trimmedUsername = username.trim();

    if (!trimmedEmail || !trimmedUsername || !password.trim()) {
      const errorMessage = "Please enter email, username, and password";
      setError(errorMessage);
      uiStore.showToast(errorMessage, "error");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await registerUser(trimmedEmail, password, trimmedUsername);
      uiStore.showToast("Account created!", "success");
      router.replace("/(tabs)");
    } catch (err) {
      console.log("Registration error:", err);
      const errorMessage = getErrorMessage(err.code);
      setError(errorMessage);
      uiStore.showToast(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  }

  function getErrorMessage(code) {
    const errorMap = {
      "auth/email-already-in-use": "This email is already registered",
      "auth/invalid-email": "Invalid email address",
      "auth/weak-password": "Password is too weak (min. 6 characters)",
      "auth/operation-not-allowed": "Registration is not enabled",
      "auth/network-request-failed": "Network error, please check your connection",
    };
    return errorMap[code] || `Registration failed: ${code || "unknown error"}`;
  }

  return (
    <RegisterView
      onRegister={onRegisterACB}
      isLoading={isLoading}
      error={error}
    />
  );
});
