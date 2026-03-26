import { useRouter } from "expo-router";
import { action } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import { searchExercisesByName } from "../api/exerciseDbApi";
import { generateWorkoutPlan } from "../api/glmApi";
import { planStore } from "../model/planStore";
import { userStore } from "../model/userStore";
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

  function onGenerateACB() {
    // generateAndEnrichPlan: calls glmApi -> enriches each exercise via exerciseDbApi
    //   -> planStore.setCurrentPlan(result)
    uiState.warningMessage = ""; //先清空之前的警告信息
    resolvePromise(generateAndEnrichPlanACB(), planPromiseState);
  }

  async function generateAndEnrichPlanACB() {
    const plan = await generateWorkoutPlan(formParams.duration, formParams.equipment, formParams.targetMuscle);
    // Promise.all一次性发出所有enrichedExerciseACB调用，等所有结果返回后才继续往下走
    const enrichedExercises = await Promise.all(plan.exercises.map(enrichedExerciseACB));
    const fullPlan = {
      id: `${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
      name: plan.name,
      createdAt: Date.now(),
      completedDates: [],
      exercises: enrichedExercises,
    };

    planStore.setCurrentPlan(fullPlan);
    router.replace("/plan");
    return fullPlan;
  }

  async function enrichedExerciseACB(exercise) {
    //用GLM返回的exercise name去exerciseDbApi搜索，拿到第一个结果的gifUrl和id（如果有的话）返回
    try {
      const matches = await searchExercisesByName(exercise.name);
      const match = matches[0];
      if (!match) {
        uiState.warningMessage = `⚠️ Warning: Exercise "${exercise.name}" not found in database, showing un-enriched exercise.`;
        return {
          id: `${exercise.name}-${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
          name: exercise.name,
          targetMuscle: formParams.targetMuscle,
          gifUrl: "",
          instructions: "",
          sets: exercise.sets,
          reps: exercise.reps,
        };
      }

      return {
        id: match.id,
        name: exercise.name,
        targetMuscle: formParams.targetMuscle,
        gifUrl: match.gifUrl,
        instructions: Array.isArray(match.instructions) ? match.instructions.join("\n") : "",
        //把数组里的每一个元素用 \n（换行符） 拼接成一整个长字符串。
        sets: exercise.sets,
        reps: exercise.reps,
      };
    } catch {//如果搜索动作的API调用失败了，也返回不带gifUrl和instructions的exercise，并且弹出警告
      uiState.warningMessage = `⚠️ Warning: Failed to load demo for "${exercise.name}", showing un-enriched exercise.`;
      return {
        id: `${exercise.name}-${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
        name: exercise.name,
        targetMuscle: formParams.targetMuscle,
        gifUrl: "",
        instructions: "",
        sets: exercise.sets,
        reps: exercise.reps,
      };
    }
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


