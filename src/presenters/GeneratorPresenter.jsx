import { observer } from "mobx-react-lite";
import { planStore } from "../model/planStore";
import { GeneratorView } from "../views/GeneratorView";

export default observer(function GeneratorPresenter() {
  // TODO: local observable state for { duration, equipment, targetMuscle }
  // TODO: local observable promiseState { promise, data, error } for API call

  function onGenerateACB(params) {
    // TODO: resolvePromise(generateAndEnrichPlan(params), promiseState)
    // generateAndEnrichPlan: calls glmApi → enriches each exercise via exerciseDbApi
    //   → planStore.setCurrentPlan(result)
  }

  function onParamChangeACB(field, value) {
    // TODO: action to update local form state
  }

  return (
    <GeneratorView
      onGenerate={onGenerateACB}
      onParamChange={onParamChangeACB}
    />
  );
});
