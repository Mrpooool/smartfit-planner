import { observer } from "mobx-react-lite";
import { loginUser, } from "../persistence/authRepo";
import { LoginView } from "../views/LoginView";

export default observer(function LoginPresenter() {
  function onLoginACB(email, password) {
    loginUser(email, password)
  }

  return (
    <LoginView
      onLogin={onLoginACB}
    />
  );
});
