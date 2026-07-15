const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Sentiment = require("sentiment");

const app = express();

app.use(cors());
app.use(express.json());

const sentiment = new Sentiment();

// ================= DB =================
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

// ================= SECRET =================
const SECRET = "secretkey";

// ================= TOKEN =================
const getUserFromToken = (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    res.status(401).json({ error: "No token provided" });
    return null;
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    return decoded.userId;
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
    return null;
  }
};

// ================= SIGNUP =================
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, hashedPassword]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ error: "Signup failed" });
  }
});

// ================= LOGIN =================
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    const valid = await bcrypt.compare(password, user.rows[0].password);

    if (!valid) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = jwt.sign({ userId: user.rows[0].id }, SECRET);

    res.json({
      token,
      user: {
        id: user.rows[0].id,
        name: user.rows[0].name,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

// ================= ADD LOG (FREE AI) =================
app.post("/add-log", async (req, res) => {
  try {
    const userId = getUserFromToken(req, res);
    if (!userId) return;

    const { text } = req.body;
    const lowerText = text.toLowerCase();

    // 🧠 STEP 1: Split into sentences
    const sentences = lowerText
      .split(/[.!?]/)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    let positiveScore = 0;
    let negativeScore = 0;

    // 🧠 STEP 2: Analyze each sentence
    sentences.forEach(sentence => {
      const score = sentiment.analyze(sentence).score;

      if (score > 0) positiveScore++;
      else if (score < 0) negativeScore++;
    });

    // 🧠 STEP 3: Detect mood (basic)
    let mood = "neutral";

    if (positiveScore > negativeScore) mood = "positive";
    else if (negativeScore > positiveScore) mood = "negative";

    // 🧠 STEP 4: PRIORITIZE LAST SENTENCE (VERY IMPORTANT 🔥)
    const lastSentence = sentences[sentences.length - 1];
    const lastScore = sentiment.analyze(lastSentence).score;

    if (lastScore > 0) mood = "positive";
    else if (lastScore < 0) mood = "negative";

    // 🚀 STEP 5: PRODUCTIVITY
    const productivityWords = [
      "study",
      "studied",
      "work",
      "worked",
      "completed",
      "finished",
      "homework",
      "assignment",
      "project"
    ];

    const productivity = productivityWords.some(word =>
      lowerText.includes(word)
    )
      ? "high"
      : "low";

    // 🧠 STEP 6: SMART INSIGHT (LIKE AI 🔥)
    let insight = "";

    if (positiveScore > 0 && negativeScore > 0) {
      insight = "You had a mixed day with ups and downs.";
    }

    if (mood === "positive" && negativeScore > 0) {
      insight = "You had a tough start but ended your day strongly 💪";
    }

    if (mood === "negative" && positiveScore > 0) {
      insight = "Your day started well but ended on a low note.";
    }

    if (insight === "") {
      if (mood === "positive") insight = "You had a positive day 😊";
      else if (mood === "negative") insight = "You had a difficult day 😞";
      else insight = "Your day was neutral 😐";
    }

    // 💾 SAVE
    const result = await pool.query(
      "INSERT INTO logs (text, mood, productivity, user_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [text, mood, productivity, userId]
    );

    res.json({
      ...result.rows[0],
      insight,
    });

  } catch (err) {
    console.error("Add Log Error:", err);
    res.status(500).json({ error: "Error adding log" });
  }
});

// ================= LOGS =================
app.get("/logs", async (req, res) => {
  try {
    const userId = getUserFromToken(req, res);
    if (!userId) return;

    const result = await pool.query(
      "SELECT * FROM logs WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );

    res.json(result.rows);

  } catch (err) {
    console.error("Logs Error:", err);
    res.status(500).json({ error: "Error fetching logs" });
  }
});

// ================= INSIGHTS =================
app.get("/insights", async (req, res) => {
  try {
    const userId = getUserFromToken(req, res);
    if (!userId) return;

    const result = await pool.query(
      "SELECT mood, productivity FROM logs WHERE user_id = $1",
      [userId]
    );

    let positive = 0;
    let negative = 0;
    let neutral = 0;
    let highProd = 0;

    result.rows.forEach((row) => {
      if (row.mood === "positive") positive++;
      else if (row.mood === "negative") negative++;
      else neutral++;

      if (row.productivity === "high") highProd++;
    });

    let insight = "";

    if (positive > negative) {
      insight = "You are mostly in a positive mood 😊";
    } else if (negative > positive) {
      insight = "You had more negative days 😞";
    } else {
      insight = "Your mood is balanced 😐";
    }

    if (highProd > result.rows.length / 2) {
      insight += " and you are quite productive 🚀";
    } else {
      insight += " but productivity can be improved 📈";
    }

    res.json({ insight });

  } catch (err) {
    console.error("Insights Error:", err);
    res.status(500).json({ error: "Error generating insights" });
  }
});

// ================= STREAK =================
app.get("/streak", async (req, res) => {
  try {
    const userId = getUserFromToken(req, res);
    if (!userId) return;

    const result = await pool.query(
      "SELECT created_at FROM logs WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );

    const dates = result.rows.map(row =>
      new Date(row.created_at).toDateString()
    );

    // remove duplicates (same day multiple logs)
    const uniqueDates = [...new Set(dates)];

    let streak = 0;
    let currentDate = new Date();

    for (let i = 0; i < uniqueDates.length; i++) {
      const logDate = new Date(uniqueDates[i]);

      const diffDays = Math.floor(
        (currentDate - logDate) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === i) {
        streak++;
      } else {
        break;
      }
    }

    res.json({ streak });

  } catch (err) {
    console.error("Streak Error:", err);
    res.status(500).json({ error: "Error calculating streak" });
  }
});

// ================= SERVER =================
app.listen(5000, () => {
  console.log("Server running on port 5000 🚀");
});