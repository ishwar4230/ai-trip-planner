const express = require("express");
const cors = require("cors");
const path = require("path");

const dotenv = require("dotenv");
const app = express();
app.use(cors());
app.use(express.json());
const PORT = 5000;
dotenv.config()

const { getTripOptions, getTripItinerary } = require("./controllers/AgentController.js");

app.post("/trip/options", getTripOptions);
app.post("/trip/itinerary", getTripItinerary);

const uiPath = path.join(__dirname, "frontend", "build");

app.use(express.static(uiPath));

app.get("/*splat", (req, res) => {
  res.sendFile(path.join(uiPath, "index.html"));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
