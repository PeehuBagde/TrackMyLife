const moodStyles = {
  positive: { label: "Positive", emoji: "😊", color: "#2F6F6D" },
  negative: { label: "Negative", emoji: "😞", color: "#D96574" },
  neutral: { label: "Neutral", emoji: "😐", color: "#C97E2A" },
};

function HistoryCard({ logs }) {
  return (
    <div className="journal-page shadow-page pr-6 py-6 md:pr-8 md:py-8">

      <p className="text-plum text-xs font-semibold tracking-[0.2em] uppercase mb-2">
        History
      </p>
      <h2 className="font-display text-2xl text-ink-950 mb-5">
        Recent entries
      </h2>

      <div className="max-h-[420px] overflow-y-auto journal-scroll pr-1">

        {logs.length === 0 ? (
          <p className="text-ink-700/60 text-sm">
            Your entries will show up here once you write your first one.
          </p>
        ) : (

          logs.map((log) => {
            const mood = moodStyles[log.mood] || moodStyles.neutral;

            return (
              <div
                key={log.id}
                className="border-l-2 pl-4 mb-5 last:mb-0"
                style={{ borderColor: mood.color }}
              >
                <div className="flex justify-between items-baseline">
                  <h3 className="font-semibold text-sm text-ink-950">
                    {mood.emoji} {mood.label}
                  </h3>
                  <span className="text-xs text-ink-700/50">
                    {new Date(log.created_at).toLocaleDateString()}
                  </span>
                </div>

                <p className="mt-1.5 text-sm text-ink-950/80 leading-relaxed">
                  {log.text}
                </p>

                <p className="mt-1.5 text-xs font-medium" style={{ color: mood.color }}>
                  Productivity: {log.productivity}
                </p>
              </div>
            );
          })

        )}

      </div>

    </div>
  );
}

export default HistoryCard;