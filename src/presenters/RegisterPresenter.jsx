import { observer } from "mobx-react-lite";
import { registerUser } from "../persistence/authRepo";
import { RegisterView } from "../views/RegisterView";

export default observer(function RegisterPresenter() {

  function onRegisterACB(email, password) {
    registerUser(email, password)
  }

  return (
    <RegisterView
      onRegister={onRegisterACB}
    />
  );
});
