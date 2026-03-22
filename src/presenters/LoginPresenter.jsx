import { observer } from "mobx-react-lite";
import { loginUser, registerUser } from "../persistence/authRepo";
import { LoginView } from "../views/LoginView";

export default observer(function LoginPresenter() {
  function onLoginACB(email, password) {
    // TODO: resolvePromise(loginUser(email, password), promiseState)
  }

  function onRegisterACB(email, password) {
    // TODO: resolvePromise(registerUser(email, password), promiseState)
  }

  return (
    <LoginView
      onLogin={onLoginACB}
      onRegister={onRegisterACB}
    />
  );
});
