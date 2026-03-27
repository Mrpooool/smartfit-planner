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

  async function onRegisterACB(email, password) {
    setIsLoading(true);
    setError(null);

    try {
      await registerUser(email, password);
      uiStore.showToast("✨ 注册成功！", "success");
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
      "auth/email-already-in-use": "此邮箱已被注册",
      "auth/invalid-email": "邮箱格式不正确",
      "auth/weak-password": "密码过于简单（至少6个字符）",
      "auth/operation-not-allowed": "注册功能未启用",
      "auth/network-request-failed": "网络连接失败，请检查网络",
    };
    return errorMap[code] || `注册失败: ${code || "未知错误"}`;
  }

  return (
    <RegisterView
      onRegister={onRegisterACB}
      isLoading={isLoading}
      error={error}
    />
  );
});
