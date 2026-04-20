// GLM API adapter.
// API key must come from Expo public env: EXPO_PUBLIC_GLM_API_KEY

const GLM_API_URL = "https://open.bigmodel.cn/api/paas/v4/chat/completions";
const GLM_API_KEY = process.env.EXPO_PUBLIC_GLM_API_KEY;
const SEARCH_NAME_ALIASES = {
  "push up": "push-up",
  pushup: "push-up",
  pushups: "push-up",
  "air squat": "squat",
  "bodyweight squat": "squat",
  "abdominal crunch": "crunch",
  "glute bridge hold": "glute bridge",
  "walking lunges": "lunge",
};

export async function generateWorkoutPlan(duration, equipment, targetMuscle, experienceLevel, avoidExerciseNames) {
  if (!GLM_API_KEY) {
    throw new Error("Missing EXPO_PUBLIC_GLM_API_KEY.");
  }

  const equipmentText =
    Array.isArray(equipment) && equipment.length > 0
      ? equipment.join(", ")
      : "bodyweight";
  const exerciseCountGuidance = getExerciseCountGuidance(duration);
  const experienceGuidance = getExperienceGuidance(experienceLevel);
  const avoidExerciseText =
    Array.isArray(avoidExerciseNames) && avoidExerciseNames.length > 0
      ? `If possible, avoid reusing these exercises: ${avoidExerciseNames.slice(0, 8).join(", ")}. `
      : "";

  const messages = [
    {
      role: "system",
      content:
        "Create workout plans and reply with JSON only. " +
        "Use common English exercise names that can be found in a public exercise database. " +
        "Keep searchName short, lowercase, and database-friendly. " +
        "Avoid fancy modifiers unless they are essential to identify the movement. " +
        "displayName should stay short and natural. " +
        "sets and reps must be positive integers. " +
        "Return this shape:\n" +
        JSON.stringify(
          {
            name: "Plan Name",
            exercises: [
              {
                name: "Exercise Name",
                displayName: "Exercise Name",
                searchName: "exercise name",
                targetMuscle: "chest",
                equipment: "bodyweight",
                sets: 3,
                reps: 12,
              },
            ],
          },
          null,
          2
        ),
    },
    {
      role: "user",
      content:
        `Create a ${duration}-minute workout plan using ${equipmentText} equipment, targeting ${targetMuscle}. ` +
        `${experienceGuidance}. ` +
        avoidExerciseText +
        `${exerciseCountGuidance}. ` +
        "Choose realistic exercises for the time available. " +
        "Keep the plan concise; do not pad it with extra exercises just to increase variety. " +
        "Fewer exercises with sensible sets are better than a long list of movements. " +
        "Use names that are easy to search in an exercise database.",
    },
  ];

  const response = await fetch(GLM_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GLM_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "GLM-4-Flash-250414",
      messages,
      temperature: 0.4,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`GLM API error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  const plan = normalizeWorkoutPlan(parseModelJsonContent(content), targetMuscle, equipmentText);
  validateWorkoutPlan(plan);
  return plan;
}

function getExerciseCountGuidance(duration) {
  const minutes = Number(duration) || 30;

  // 当前表单只有 15、30、60 三个时长选项，所以这里直接按这三档给更精简的规则。
  if (minutes <= 15) {
    return "Return exactly 3 exercises";
  }

  if (minutes <= 30) {
    return "Return exactly 4 exercises";
  }

  return "Return exactly 6 exercises";
}

function getExperienceGuidance(level) {
  if (level === "advanced") {
    return "Make it suitable for an advanced trainee with harder exercise choices and slightly higher training demand";
  }

  if (level === "intermediate") {
    return "Make it suitable for an intermediate trainee with moderate challenge and standard training volume";
  }

  return "Make it suitable for a beginner with simple exercise choices, clear fundamentals, and manageable volume";
}

function parseModelJsonContent(content) {
  if (typeof content !== "string" || !content.trim()) {
    throw new Error("GLM response is empty.");
  }

  // Keep this small cleanup for occasional fenced JSON responses.
  const cleaned = content.trim().replace(/^```json\s*/i, "").replace(/```$/, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    throw new Error("GLM returned non-JSON content.");
  }
}

function normalizeWorkoutPlan(plan, fallbackTargetMuscle, fallbackEquipment) {
  if (!plan || typeof plan !== "object") {
    return plan;
  }

  const normalizedExercises = Array.isArray(plan.exercises)
    ? plan.exercises.map(function normalizeExerciseCB(item) {
        const baseName = String(item?.displayName || item?.name || "").trim();
        const normalizedName = baseName || "Exercise";

        return {
          ...item,
          name: normalizedName,
          displayName: String(item?.displayName || normalizedName).trim(),
          searchName: normalizeSearchName(item?.searchName || normalizedName),
          targetMuscle: String(item?.targetMuscle || fallbackTargetMuscle || "").trim(),
          equipment: String(item?.equipment || fallbackEquipment || "").trim(),
        };
      })
    : plan.exercises;

  return {
    ...plan,
    name: String(plan.name || "").trim(),
    exercises: normalizedExercises,
  };
}

function normalizeSearchName(value) {
  const normalized = String(value || "")
    .toLowerCase()
    .replace(/[()]/g, " ")
    .replace(/[^a-z0-9+\-\s]/g, " ")
    .replace(/\b(beginner|advanced|fat burning|fat-burning|explosive|power|combo|circuit)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // 只做少量高频别名归一化，避免把动作语义改得太激进。
  return SEARCH_NAME_ALIASES[normalized] || normalized;
}

function validateWorkoutPlan(plan) {
  if (!plan || typeof plan !== "object") {
    throw new Error("GLM returned invalid plan object.");
  }

  if (typeof plan.name !== "string" || !plan.name.trim()) {
    throw new Error("GLM returned plan without valid name.");
  }

  if (!Array.isArray(plan.exercises) || plan.exercises.length === 0) {
    throw new Error("GLM returned plan without exercises.");
  }

  const allExercisesValid = plan.exercises.every(function isValidExercise(item) {
    return (
      item &&
      typeof item.name === "string" &&
      item.name.trim() &&
      typeof item.displayName === "string" &&
      item.displayName.trim() &&
      typeof item.searchName === "string" &&
      item.searchName.trim() &&
      typeof item.targetMuscle === "string" &&
      item.targetMuscle.trim() &&
      typeof item.equipment === "string" &&
      item.equipment.trim() &&
      Number.isInteger(item.sets) &&
      item.sets > 0 &&
      Number.isInteger(item.reps) &&
      item.reps > 0
    );
  });

  if (!allExercisesValid) {
    throw new Error("GLM returned exercises with invalid fields.");
  }
}
