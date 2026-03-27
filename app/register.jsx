import { Redirect } from "expo-router";
import { observer } from "mobx-react-lite";
import { userStore } from "../src/model/userStore";
import RegisterPresenter from "../src/presenters/RegisterPresenter";

export default observer(function RegisterPage() {
  if (!userStore.ready) {
    return null;
  }

  if (userStore.uid) {
    return <Redirect href="/(tabs)" />;
  }

  return <RegisterPresenter />;
});