

exports.callAI = async (prompt) => {
  const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "tngtech/deepseek-r1t2-chimera:free",
      messages: [{ role: "user", content: prompt }]
    })
  });

  const data = await resp.json();
  return data.choices[0].message.content;
}
