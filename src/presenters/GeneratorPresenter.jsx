import { useRouter } from "expo-router";
import { action } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import { searchExercisesByName } from "../api/exerciseDbApi";
import { generateWorkoutPlan } from "../api/glmApi";
import { planStore } from "../model/planStore";
import { userStore } from "../model/userStore";
import { normalizeExerciseFromDb } from "../utils/normalizeExercise";
import { resolvePromise } from "../utils/resolvePromise";
import { GeneratorView } from "../views/GeneratorView";

const SEARCH_QUERY_ALIASES = {
  "push up": "push-up",
  pushup: "push-up",
  pushups: "push-up",
  "air squat": "squat",
  "bodyweight squat": "squat",
  "abdominal crunch": "crunch",
  "glute bridge hold": "glute bridge",
  "walking lunges": "lunge",
  "bent over dumbbell row": "dumbbell row",
  "dumbbell bent over row": "dumbbell row",
  "overhead dumbbell press": "shoulder press",
  "dumbbell shoulder press": "shoulder press",
};

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

  function createFallbackExercise(exercise) {
    return {
      id: `${exercise.name}-${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
      exerciseDbId: "",
      name: exercise.displayName || exercise.name,
      searchName: exercise.searchName || exercise.name,
      targetMuscle: exercise.targetMuscle || formParams.targetMuscle,
      bodyPart: "",
      equipment: exercise.equipment || (formParams.equipment.length > 0 ? formParams.equipment[0] : "Bodyweight"),
      gifUrl: "",
      instructions: [],
      secondaryMuscles: [],
      description: "",
      difficulty: "",
      category: "",
      sets: exercise.sets,
      reps: exercise.reps,
    };
  }

  const onGenerateACB = action(function onGenerateACB() {
    // generateAndEnrichPlan: calls glmApi -> enriches each exercise via exerciseDbApi
    //   -> planStore.setCurrentPlan(result)
    uiState.warningMessage = ""; //先清空之前的警告信息
    resolvePromise(generateAndEnrichPlanACB(), planPromiseState);
  });

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

    planStore.setGeneratedPlan(fullPlan);
    router.push("/planPreview");
    return fullPlan;
  }

  async function enrichedExerciseACB(exercise) {
    // 先用模型给出的名字搜索，再补一轮更短的回退查询，最后按匹配度选结果。
    try {
      const match = await findBestExerciseMatch(exercise);
      if (!match) {
        action(function setWarningACB() { uiState.warningMessage = `⚠️ Warning: Exercise "${exercise.displayName || exercise.name}" not found in database, showing un-enriched exercise.`; })();
        return createFallbackExercise(exercise);
      }

      return normalizeExerciseFromDb(match, {
        name: exercise.name,
        displayName: exercise.displayName,
        searchName: exercise.searchName,
        targetMuscle: exercise.targetMuscle,
        equipment: exercise.equipment,
        sets: exercise.sets,
        reps: exercise.reps,
      });
    } catch {
      //如果搜索动作的API调用失败了，也返回不带gifUrl和instructions的exercise，并且弹出警告
      action(function setWarningACB() { uiState.warningMessage = `⚠️ Warning: Failed to load demo for "${exercise.displayName || exercise.name}", showing un-enriched exercise.`; })();
      return createFallbackExercise(exercise);
    }
  }

  async function findBestExerciseMatch(exercise) {
    const queries = buildSearchQueries(exercise);
    const matchGroups = await Promise.all(queries.map(searchExercisesByName));
    const matches = mergeMatches(matchGroups);
    return selectBestExerciseMatch(matches, exercise, queries[0]);
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

function buildSearchQueries(exercise) {
  const queries = [];

  addSearchQuery(queries, exercise?.searchName);
  addSearchQuery(queries, exercise?.name);
  addSearchQuery(queries, exercise?.displayName);

  return queries.slice(0, 3);
}

function addSearchQuery(queries, value) {
  const normalized = normalizeSearchQuery(value);
  if (!normalized) {
    return;
  }

  pushUniqueQuery(queries, normalized);
  pushUniqueQuery(queries, SEARCH_QUERY_ALIASES[normalized]);

  const simplified = simplifySearchQuery(normalized);
  if (simplified !== normalized) {
    pushUniqueQuery(queries, simplified);
  }
}

function pushUniqueQuery(queries, value) {
  if (value && !queries.includes(value)) {
    queries.push(value);
  }
}

function normalizeSearchQuery(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[()]/g, " ")
    .replace(/[^a-z0-9+\-\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function simplifySearchQuery(query) {
  return query
    // 只在回退查询里去掉一些常见修饰词，让搜索更容易命中数据库主名称。
    .replace(/\b(alternating|alternate|single arm|single-arm|one arm|one-arm|seated|standing|incline|decline|flat|supported|bodyweight|weighted|dumbbell|barbell|kettlebell|cable|machine|left|right)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function mergeMatches(matchGroups) {
  const matches = [];
  const seenKeys = new Set();

  matchGroups.forEach(function addMatchGroupCB(group) {
    if (!Array.isArray(group)) {
      return;
    }

    group.forEach(function addMatchCB(match) {
      const key = String(match?.id || match?.name || "").trim();
      if (!key || seenKeys.has(key)) {
        return;
      }

      seenKeys.add(key);
      matches.push(match);
    });
  });

  return matches;
}

function selectBestExerciseMatch(matches, exercise, primaryQuery) {
  if (!Array.isArray(matches) || matches.length === 0) {
    return null;
  }

  const targetName = normalizeSearchQuery(primaryQuery || exercise?.searchName || exercise?.name);
  const targetMuscle = normalizeSearchQuery(exercise?.targetMuscle);
  const targetEquipment = normalizeSearchQuery(exercise?.equipment);

  let bestMatch = matches[0];
  let bestScore = Number.NEGATIVE_INFINITY;

  matches.forEach(function scoreMatchCB(match) {
    const matchName = normalizeSearchQuery(match?.name);
    const matchTarget = normalizeSearchQuery(match?.target || match?.targetMuscle);
    const matchEquipment = normalizeSearchQuery(match?.equipment);
    let score = 0;

    // 名称接近度优先级最高，其次再看肌群和器械是否一致。
    if (matchName === targetName) {
      score += 8;
    } else if (matchName.startsWith(targetName) || targetName.startsWith(matchName)) {
      score += 5;
    } else if (matchName.includes(targetName) || targetName.includes(matchName)) {
      score += 3;
    }

    if (targetMuscle && matchTarget === targetMuscle) {
      score += 2;
    }

    if (targetEquipment && matchEquipment === targetEquipment) {
      score += 2;
    }

    if (match?.gifUrl || match?.imageUrl || match?.image) {
      score += 1;
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = match;
    }
  });

  return bestMatch;
}
