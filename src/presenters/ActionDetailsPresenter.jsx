import { observer } from "mobx-react-lite";
import { useLocalSearchParams } from "expo-router";
import { planStore } from "../model/planStore";
import { ActionDetailsView } from "../views/ActionDetailsView";

export default observer(function ActionDetailsPresenter() {
  const { id, source } = useLocalSearchParams();
  const index = parseInt(id, 10);
  
  const targetPlan = source === 'generated' ? planStore.generatedPlan : planStore.currentPlan;
  
  if (!targetPlan || isNaN(index) || !targetPlan.exercises[index]) {
    return null;
  }

  const exercise = targetPlan.exercises[index];

  return <ActionDetailsView exercise={exercise} />;
});
