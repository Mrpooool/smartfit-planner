// GLM-4-Flash (Zhipu AI) — generates structured workout plans from user conditions.
// TODO: Replace with your own API key from https://open.bigmodel.cn

const GLM_API_URL = "https://open.bigmodel.cn/api/paas/v4/chat/completions";
const GLM_API_KEY = "YOUR_GLM_API_KEY";

/**
 * Generate a list of exercises based on user conditions.
 * @param {Object} params
 * @param {number}   params.duration     - Available time in minutes (15 / 30 / 60)
 * @param {string[]} params.equipment    - Available equipment (e.g. ["none"] or ["dumbbells"])
 * @param {string}   params.targetMuscle - Target muscle group (e.g. "Full Body")
 * @returns {Promise<Array<{name: string, sets: number, reps: number, instructions: string}>>}
 */
export async function generateWorkoutPlan({ duration, equipment, targetMuscle }) {
  const prompt =
    `Generate a ${duration}-minute workout targeting ${targetMuscle} ` +
    `using only: ${equipment.join(", ")}.\n` +
    `Return a JSON array. Each item must have:\n` +
    `- name (string): exercise name in English\n` +
    `- sets (number)\n` +
    `- reps (number)\n` +
    `- instructions (string): one sentence\n` +
    `Return ONLY valid JSON, no markdown, no explanation.`;

  const response = await fetch(GLM_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GLM_API_KEY}`,
    },
    body: JSON.stringify({
      model: "glm-4-flash",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) throw new Error(`GLM API error: ${response.status}`);

  const result = await response.json();
  const content = result.choices?.[0]?.message?.content;
  return JSON.parse(content);
}
