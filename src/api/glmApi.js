// GLM API adapter.
// API key must come from Expo public env: EXPO_PUBLIC_GLM_API_KEY

const GLM_API_URL = "https://open.bigmodel.cn/api/paas/v4/chat/completions";
const GLM_API_KEY = process.env.EXPO_PUBLIC_GLM_API_KEY;

export async function generateWorkoutPlan(duration, equipment, targetMuscle) {
  if (!GLM_API_KEY) {
    throw new Error("Missing EXPO_PUBLIC_GLM_API_KEY.");
  }

  const equipmentText = Array.isArray(equipment) ? equipment.join(", ") : String(equipment);

  const messages = [
    {
      role: "system",
      content:
        "You are a helpful fitness assistant that creates workout plans based on user conditions. " +
        "Respond ONLY with valid JSON (no markdown, no extra text). " +
        "Return this JSON shape:\n" +
        JSON.stringify(
          {
            name: "Plan Name",
            exercises: [
              {
                name: "Exercise Name",
                sets: 3,
                reps: 12,
              },
            ],
          },
          null,
          2
        ) +
        "\nThe numbers above are examples only. sets and reps must be integers and should be chosen dynamically for each request.",
    },
    {
      role: "user",
      content:
        `Create a ${duration}-minute workout plan using ${equipmentText} equipment, targeting ${targetMuscle}. ` +
        "Use integer numbers for sets and reps.",
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
      temperature: 1,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`GLM API error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  const plan = parseModelJsonContent(content);
  validateWorkoutPlan(plan);
  return plan;
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
