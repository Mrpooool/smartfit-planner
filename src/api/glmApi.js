// GLM API adapter:
// - Sends workout requirements to Zhipu GLM
// - Expects strict JSON output
// - Normalizes returned data into predictable shape
//
// API key must come from Expo public env:
// EXPO_PUBLIC_GLM_API_KEY=<your-key>

const GLM_API_URL = "https://open.bigmodel.cn/api/paas/v4/chat/completions";
const GLM_API_KEY = process.env.EXPO_PUBLIC_GLM_API_KEY;

export async function generateWorkoutPlan(duration, equipment, targetMuscle) {
  // Fail fast if env is missing so caller gets explicit setup error.
  if (!GLM_API_KEY) {
    throw new Error("Missing EXPO_PUBLIC_GLM_API_KEY.");
  }

  // Prompt text should always be deterministic plain text.
  const equipmentText = Array.isArray(equipment) ? equipment.join(", ") : String(equipment);

  // We force JSON-only output in system prompt to simplify parsing.
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
      model: "glm-4.7-flash",
      messages,
      temperature: 1,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    // Read response body to expose provider-side error details.
    const errorText = await response.text();
    throw new Error(`GLM API error: ${response.status} ${errorText}`);
  }

  // GLM content may be raw string JSON or object-like payload.
  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  const plan = parseModelJsonContent(content);
  return normalizeWorkoutPlan(plan);
}

function parseModelJsonContent(content) {
  if (!content) {
    throw new Error("GLM response is empty.");
  }

  if (typeof content === "object") {
    // Some SDK/providers may already deserialize JSON content.
    return content;
  }

  // Defensive cleanup in case model wraps JSON in markdown fences.
  const cleaned = String(content)
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/```$/, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    throw new Error("GLM returned non-JSON content.");
  }
}

function normalizeWorkoutPlan(plan) {
  // Keep outbound shape stable for presenters/views.
  if (!plan || typeof plan !== "object") {
    throw new Error("GLM returned invalid plan object.");
  }

  const name = typeof plan.name === "string" ? plan.name : "Generated Plan";
  const rawExercises = Array.isArray(plan.exercises) ? plan.exercises : [];

  const exercises = rawExercises
    .map(function toExercise(item) {
      // Coerce to numbers and enforce positive integers.
      const sets = Number(item?.sets);
      const reps = Number(item?.reps);

      if (!Number.isFinite(sets) || !Number.isFinite(reps)) return null;

      return {
        name: String(item?.name || "Exercise"),
        sets: Math.max(1, Math.round(sets)),
        reps: Math.max(1, Math.round(reps)),
      };
    })
    .filter(Boolean);

  if (!exercises.length) {
    throw new Error("GLM returned no valid exercises.");
  }

  return { name, exercises };
}
