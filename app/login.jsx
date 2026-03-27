import { Redirect } from "expo-router";
import { observer } from "mobx-react-lite";
import { userStore } from "../src/model/userStore";
import LoginPresenter from "../src/presenters/LoginPresenter";

export default observer(function LoginPage() {
  if (!userStore.ready) {
    return null;
  }

  if (userStore.uid) {
    return <Redirect href="/(tabs)" />;
  }

  return <LoginPresenter />;
});