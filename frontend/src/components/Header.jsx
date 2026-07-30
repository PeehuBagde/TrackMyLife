function Header({ streak, onLogout }) {
  return (
    <div className="flex justify-between items-start mb-10">

      <div>
        <p className="text-amber text-xs font-semibold tracking-[0.2em] uppercase mb-2">
          Today's entry
        </p>
        <h1 className="font-display text-4xl md:text-5xl font-medium text-paper">
          TrackMyLife
        </h1>
        <p className="text-ink-700 md:text-base text-sm mt-2 max-w-sm" style={{ color: "#B9AFD1" }}>
          Track your life. Understand yourself.
        </p>
      </div>

      <div className="flex flex-col items-end gap-3">
        <div className="flex items-center gap-2 bg-ink-800 border border-white/10 rounded-full px-4 py-2">
          <span className="text-lg">🔥</span>
          <span className="text-paper font-semibold text-sm">
            {streak} day{streak === 1 ? "" : "s"}
          </span>
        </div>

        <button
          onClick={onLogout}
          className="text-sm text-paper/70 hover:text-paper border border-white/10 hover:border-white/30 px-4 py-1.5 rounded-full transition"
        >
          Log out
        </button>
      </div>

    </div>
  );
}

export default Header;