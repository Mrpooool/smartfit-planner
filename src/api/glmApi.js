// GLM-4-Flash (Zhipu AI) — generates structured workout plans from user conditions.
// TODO: Replace with your own API key from https://open.bigmodel.cn

const GLM_API_URL = "https://open.bigmodel.cn/api/paas/v4/chat/completions";
const GLM_API_KEY = "a952b954c0804b39ae8663510704712e.UVeuq07IkLb8Tg8g";

export async function generateWorkoutPlan(duration, equipment, targetMuscle) {
  const messages = [
    {
      role: "system",
      content:
        "You are a helpful fitness assistant that creates workout plans based on user conditions. " +
        "Respond ONLY with valid JSON in this exact format, no extra text:\n" +
        JSON.stringify({
          name: "Plan Name",
          exercises: [
            {
              "name": "Exercise Name",
              "sets": "Number of sets",
              "reps": "Number of reps per set",
            }
          ]
        }, null, 2)
    },
    {
      role: "user",
      content: `Create a ${duration}-minute workout plan using ${equipment} equipment, targeting ${targetMuscle}.`
    }
  ];

  const response = await fetch(GLM_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GLM_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "glm-4-flash",
      messages: messages,
      temperature: 1,
      response_format: { type: "json_object" }
    })
  });

  if (!response.ok) {
    throw new Error(`GLM API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data.choices[0].message.content;
  return JSON.parse(text);
}