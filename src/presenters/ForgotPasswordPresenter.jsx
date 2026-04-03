import { useRouter } from "expo-router";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { uiStore } from "../model/uiStore";
import { resetPassword } from "../persistence/authRepo";
import { ForgotPasswordView } from "../views/ForgotPasswordView";

export default observer(function ForgotPasswordPresenter() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function onSendResetEmailACB(email) {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      const msg = "Please enter your email address";
      setError(msg);
      uiStore.showToast(msg, "error");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await resetPassword(trimmedEmail);
      uiStore.showToast("Password reset email sent!", "success");
      router.replace("/login");
    } catch (err) {
      console.log("Reset password error:", err);
     
    } finally {
      setIsLoading(false);
    }
  }

  function onBackToLoginACB() {
    router.replace("/login");
  }

  function getResetPasswordErrorMessage(code) {
    const errorMap = {
      "auth/invalid-email": "Invalid email address",
      "auth/missing-email": "Please enter your email address",
      "auth/user-not-found": "No account found with this email",
      "auth/network-request-failed": "Network error, please check your connection",
      "auth/too-many-requests": "Too many attempts, please try again later",
    };

    return errorMap[code] || `Password reset failed: ${code || "unknown error"}`;
  }

  return (
    <ForgotPasswordView
      onSendResetEmail={onSendResetEmailACB}
      onBackToLogin={onBackToLoginACB}
      isLoading={isLoading}
      error={error}
    />
  );
});