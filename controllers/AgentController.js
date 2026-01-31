const { callAI } = require("../utils/AiUtils.js");

exports.getTripOptions = async (req, res) => {
  try {
    console.log('request came for fetching trip options');
    const { state, month } = req.body;
    const data = await generateTripOptions(state, month);
    res.json({ success: true, options: data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getTripItinerary = async (req, res) => {
  try {
    console.log('request came for fetching itinerary');
    const { state, month, place } = req.body;
    const data = await generateItinerary(state, month, place);
    res.json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

const generateTripOptions = async (state, month) => {
  const prompt = `
You are an Indian travel expert.

User wants to travel to ${state} in ${month}.
Trip duration: maximum 7 days.

Give TOP 5 tourist destinations in ${state} for this month.

For EACH destination provide:
- Min temperature (°C)
- Max temperature (°C)
- Weather condition summary
- Why this place is good in this month

Return STRICT JSON ONLY in this format:

[
  {
    "place": "",
    "weather": {
      "min": 0,
      "max": 0,
      "condition": ""
    },
    "why": ""
  }
]

No markdown.
No explanation.
No extra text.
  `;

  const result = await callAI(prompt);
  return JSON.parse(result);
};

const generateItinerary = async (state, month, place) => {
  const prompt = `
You are an expert Indian travel planner.

Plan a detailed itinerary for:
State: ${state}
Place: ${place}
Month: ${month}
Trip duration: 4-7 days

Create a day-wise plan including:
- sightseeing
- local food
- travel time tips
- rest periods

Return STRICT JSON ONLY:

{
  "place": "",
  "best_time_to_visit": "",
  "trip_style": "",
  "itinerary": [
    { "day": 1, "plan": "" }
  ]
}

No markdown.
No extra commentary.
  `;

  const result = await callAI(prompt);
  return JSON.parse(result);
};

