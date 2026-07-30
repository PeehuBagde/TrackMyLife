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

  // 🔁 Restore token across refreshes AND reopens (expires automatically after 7 days via backend)
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  // 🚪 Shared logout — also runs automatically if the backend ever rejects the token (expired/invalid)
  const logout = useCallback(() => {
    setToken("");
    localStorage.removeItem("token");
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

  // ✅ Persist across refresh AND reopening the app — token auto-expires after 7 days
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

    if (res.status === 401) {
      logout(); // token expired or invalid — send back to Login
      return;
    }

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

  if (res.status === 401) {
    logout(); // token expired or invalid — send back to Login
    return;
  }

  const data = await res.json();
  console.log("LOGS RESPONSE:", data);

setLogs(Array.isArray(data) ? data : []);
}, [token, logout]);

const fetchStreak = useCallback(async () => {
  if (!token) return;

  try {
    const res = await fetch("https://trackmylife-backend.onrender.com/streak", {
      headers: { Authorization: token },
    });

    if (res.status === 401) {
      logout(); // token expired or invalid — send back to Login
      return;
    }

    const data = await res.json();
    console.log("STREAK:", data); // 🔥 debug
    setStreak(data.streak);

  } catch (err) {
    console.error("Streak error:", err);
  }
}, [token, logout]);

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
    <div className="min-h-screen flex items-center justify-center bg-ink-950 relative overflow-hidden px-6">

      {/* Signature lamplight glow, same motif as the dashboard */}
      <div
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, #E3993B 0%, transparent 65%)" }}
      />

      <div className="relative journal-page shadow-page pr-8 py-10 md:pr-10 md:py-12 w-full max-w-md">

        <p className="text-amber text-xs font-semibold tracking-[0.2em] uppercase mb-2">
          {isSignup ? "New here" : "Welcome back"}
        </p>
        <h1 className="font-display text-3xl text-ink-950 mb-1">TrackMyLife</h1>
        <p className="text-ink-700/70 text-sm mb-7">
          {isSignup ? "Start your first entry today." : "Pick up where you left off."}
        </p>

        {/* NAME (only signup) */}
        {isSignup && (
          <input
            type="text"
            placeholder="Your name"
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-transparent p-3 border border-paper-line rounded-xl mb-4 text-ink-950 placeholder:text-ink-700/40 focus:outline-none focus:ring-2 focus:ring-plum/40 focus:border-plum/40 transition"
          />
        )}

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-transparent p-3 border border-paper-line rounded-xl mb-4 text-ink-950 placeholder:text-ink-700/40 focus:outline-none focus:ring-2 focus:ring-plum/40 focus:border-plum/40 transition"
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-transparent p-3 border border-paper-line rounded-xl mb-6 text-ink-950 placeholder:text-ink-700/40 focus:outline-none focus:ring-2 focus:ring-plum/40 focus:border-plum/40 transition"
        />

        {/* BUTTON */}
        <button
          onClick={isSignup ? handleSignup : handleLogin}
          className="w-full bg-plum hover:bg-plum/90 text-white py-3 rounded-xl font-semibold transition"
        >
          {isSignup ? "Create account" : "Log in"}
        </button>

        {/* TOGGLE TEXT */}
        <p className="text-center text-sm text-ink-700/60 mt-6">
          {isSignup ? (
            <>
              Already have an account?{" "}
              <span
                className="text-plum font-medium cursor-pointer"
                onClick={() => setIsSignup(false)}
              >
                Log in
              </span>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <span
                className="text-plum font-medium cursor-pointer"
                onClick={() => setIsSignup(true)}
              >
                Sign up
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
    <Dashboard
  streak={streak}
  onLogout={logout}
  text={text}
  setText={setText}
  handleSubmit={handleSubmit}
  loading={loading}
  result={result}
  logs={logs}
  chartData={chartData}
  downloadPDF={downloadPDF}
/>
);
}

export default App;