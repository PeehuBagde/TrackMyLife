function Header({ streak, onLogout }) {
  return (
    <div className="flex justify-between items-center mb-6">

      <div>
        <h1 className="text-4xl font-bold text-gray-800">
          TrackMyLife 🚀
        </h1>

        <p className="text-gray-500 mt-1">
          Track your life. Understand yourself.
        </p>

        <p className="text-orange-500 font-semibold mt-2">
          🔥 {streak} Day Streak
        </p>
      </div>

      <button
        onClick={onLogout}
        className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl transition"
      >
        Logout
      </button>

    </div>
  );
}

export default Header;