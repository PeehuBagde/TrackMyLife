import React, { useState, useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useCallback } from "react";
import Dashboard from "./pages/Dashboard";

ChartJS.register(ArcElement, Tooltip, Legend);

function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [logs, setLogs] = useState([]);
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [streak, setStreak] = useState(0);

  // 🔐 LOGIN STATE
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
  const savedToken = localStorage.getItem("token");

  if (savedToken) {
    setToken(savedToken);
  }
  }, []);

  // 🔐 LOGIN FUNCTION
  const handleLogin = async () => {
  const res = await fetch("https://trackmylife-backend.onrender.com/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  console.log("LOGIN RESPONSE:", data);

  setToken(data.token);

  // ✅ SAVE in localStorage
  localStorage.setItem("token", data.token);
  };

  const handleSignup = async () => {
  const res = await fetch("https://trackmylife-backend.onrender.com/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await res.json();
  console.log(data);

  alert("Signup successful! Please login.");

  setIsSignup(false); // back to login
};

  // 🔥 Submit log
  const handleSubmit = async () => {
  if (!text.trim()) return;

  try {
    setLoading(true); // 🔥 start loading

    const res = await fetch("https://trackmylife-backend.onrender.com/add-log", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ text }),
    });

    const data = await res.json();
    setResult(data);
    setText("");

    fetchLogs();

  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false); // 🔥 stop loading
  }
};

  // 📥 Fetch logs
  const fetchLogs = useCallback(async () => {
  if (!token) return;

  console.log("TOKEN:", token);

  const res = await fetch("https://trackmylife-backend.onrender.com/logs", {
    headers: { Authorization: token },
  });

  const data = await res.json();
  console.log("LOGS RESPONSE:", data);

setLogs(Array.isArray(data) ? data : []);
}, [token]);

const fetchStreak = useCallback(async () => {
  if (!token) return;

  try {
    const res = await fetch("https://trackmylife-backend.onrender.com/streak", {
      headers: { Authorization: token },
    });

    const data = await res.json();
    console.log("STREAK:", data); // 🔥 debug
    setStreak(data.streak);

  } catch (err) {
    console.error("Streak error:", err);
  }
}, [token]);

  // 🔁 run after login
  useEffect(() => {
  if (token) {
    fetchLogs();
    fetchStreak();
  }
}, [token, fetchLogs, fetchStreak]);

  // 📊 mood count
  const moodCount = { positive: 0, negative: 0, neutral: 0 };

  logs.forEach((log) => {
    if (log.mood === "positive") moodCount.positive++;
    else if (log.mood === "negative") moodCount.negative++;
    else moodCount.neutral++;
  });

  const chartData = {
  labels: ["Positive 😊", "Negative 😞", "Neutral 😐"],
  datasets: [
    {
      data: [
        moodCount.positive,
        moodCount.negative,
        moodCount.neutral,
      ],

      backgroundColor: [
        "#22c55e", // green (positive)
        "#ef4444", // red (negative)
        "#facc15", // yellow (neutral)
      ],

      borderWidth: 2,
      borderColor: "#ffffff", // white borders (clean look)
    },
  ],
};

  // 📄 PDF
  const downloadPDF = async () => {
    const element = document.getElementById("report");
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 10, 10, 180, 0);
    pdf.save("TrackMyLife_Report.pdf");
  };

  // 🔐 LOGIN SCREEN
if (!token) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200">

      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md">

        <h1 className="text-3xl font-bold">TrackMyLife 🚀</h1>

        <p className="text-center text-gray-500 mb-6">
          {isSignup ? "Create your account" : "Welcome back "}
        </p>

        {/* NAME (only signup) */}
        {isSignup && (
          <input
            type="text"
            placeholder="Enter your name"
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border rounded-xl mb-4 focus:ring-2 focus:ring-purple-400"
          />
        )}

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border rounded-xl mb-4 focus:ring-2 focus:ring-purple-400"
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Enter your password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border rounded-xl mb-6 focus:ring-2 focus:ring-purple-400"
        />

        {/* BUTTON */}
        <button
          onClick={isSignup ? handleSignup : handleLogin}
          className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 rounded-xl font-semibold hover:scale-105 transition"
        >
          {isSignup ? "Signup" : "Login"}
        </button>

        {/* TOGGLE TEXT */}
        <p className="text-center text-sm text-gray-500 mt-6">
          {isSignup ? (
            <>
              Already have an account?{" "}
              <span
                className="text-purple-600 cursor-pointer"
                onClick={() => setIsSignup(false)}
              >
                Login
              </span>
            </>
          ) : (
            <>
              Don’t have an account?{" "}
              <span
                className="text-purple-600 cursor-pointer"
                onClick={() => setIsSignup(true)}
              >
                Signup
              </span>
            </>
          )}
        </p>

      </div>
    </div>
  );
}

  // ✅ MAIN APP
  return (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-6">

    {/* LOGIN SCREEN */}
    <Dashboard
  streak={streak}
  onLogout={() => {
    setToken("");
    localStorage.removeItem("token");
  }}
  text={text}
  setText={setText}
  handleSubmit={handleSubmit}
  loading={loading}
  result={result}
  logs={logs}
  chartData={chartData}
  downloadPDF={downloadPDF}
/>
  </div>
);
}

export default App;