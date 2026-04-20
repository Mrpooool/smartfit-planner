import { useRouter } from "expo-router";
import { action } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import { planStore } from "../model/planStore";
import { userStore } from "../model/userStore";
import { generateAiPlan } from "../utils/generateAiPlan";
import { resolvePromise } from "../utils/resolvePromise";
import { GeneratorView } from "../views/GeneratorView";

export default observer(function GeneratorPresenter() {
  //存时间，设备，目标肌群等表单参数
  const formParams = useLocalObservable(() => ({
    duration: 30,
    equipment: [],
    targetMuscle: "full body",
  }));
  //存API调用状态的promise，数据和错误
  const planPromiseState = useLocalObservable(() => ({
    promise: null,
    data: null,
    error: null,
  }));
  //搜索动作失败时弹出
  const uiState = useLocalObservable(() => ({
    warningMessage: "",
  }));
  //路由对象，用于跳转到Details页
  //userouter是给组件内部用的
  //dinnerPlanner用的router是app/_layout.jsx里传下来的
  //GeneratorPresenter里直接用useRouter就行了，不需要从props里传
  const router = useRouter();

  const onGenerateACB = action(function onGenerateACB() {
    // generateAndEnrichPlan: calls glmApi -> enriches each exercise via exerciseDbApi
    //   -> planStore.setGeneratedPlan(result)
    uiState.warningMessage = ""; //先清空之前的警告信息
    resolvePromise(generateAndEnrichPlanACB(), planPromiseState);
  });

  async function generateAndEnrichPlanACB() {
    const fullPlan = await generateAiPlan({
      duration: formParams.duration,
      equipment: formParams.equipment,
      targetMuscle: formParams.targetMuscle,
      onWarning: function onWarningACB(message) {
        action(function setWarningACB() {
          uiState.warningMessage = message;
        })();
      },
    });

    planStore.setGeneratedPlan(fullPlan);
    router.push({
      pathname: "/planPreview",
      params: {
        duration: String(formParams.duration),
        targetMuscle: formParams.targetMuscle,
        equipment: JSON.stringify(formParams.equipment),
      },
    });
    return fullPlan;
  }

  const onParamChangeACB = action(function onParamChangeACB(paramName, value) {
    if (paramName === "equipment") {
      if (formParams.equipment.includes(value)) {
        formParams.equipment = formParams.equipment.filter(item => item !== value);
      } else {
        formParams.equipment = [...formParams.equipment, value];
      }
    } else {
      formParams[paramName] = value;
    }
  });

  return (
    <GeneratorView
      duration={formParams.duration}          // ← Presenter 读了，observer 追踪到
      equipment={formParams.equipment}
      targetMuscle={formParams.targetMuscle}
      email={userStore.email}
      promise={planPromiseState.promise}
      data={planPromiseState.data}
      error={planPromiseState.error}
      warningMessage={uiState.warningMessage}
      onGenerate={onGenerateACB}
      onParamChange={onParamChangeACB}
    />
  );
});
