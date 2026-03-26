import { observer } from "mobx-react-lite";
import { useLocalSearchParams } from "expo-router";
import { planStore } from "../model/planStore";
import { ActionDetailsView } from "../views/ActionDetailsView";

export default observer(function ActionDetailsPresenter() {
  const { id } = useLocalSearchParams();
  const index = parseInt(id, 10);
  
  if (!planStore.currentPlan || isNaN(index) || !planStore.currentPlan.exercises[index]) {
    return null;
  }

  const exercise = planStore.currentPlan.exercises[index];

  return <ActionDetailsView exercise={exercise} />;
});
