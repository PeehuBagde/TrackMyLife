function Header({ streak, onLogout }) {
  return (
    <div className="flex justify-between items-start mb-10">

      <div>
        <p className="text-amber-dark text-xs font-semibold tracking-[0.2em] uppercase mb-2">
          Today's entry
        </p>
        <h1 className="font-display text-4xl md:text-5xl font-medium text-ink-950">
          TrackMyLife
        </h1>
        <p className="text-ink-950/60 md:text-base text-sm mt-2 max-w-sm">
          Track your life. Understand yourself.
        </p>
      </div>

      <div className="flex flex-col items-end gap-3">
        <div className="flex items-center gap-2 bg-white border border-black/5 shadow-sm rounded-full px-4 py-2">
          <span className="text-lg">🔥</span>
          <span className="text-ink-950 font-semibold text-sm">
            {streak} day{streak === 1 ? "" : "s"}
          </span>
        </div>

        <button
          onClick={onLogout}
          className="text-sm text-ink-950/60 hover:text-ink-950 border border-black/10 hover:border-black/20 px-4 py-1.5 rounded-full transition bg-white/60"
        >
          Log out
        </button>
      </div>

    </div>
  );
}

export default Header;