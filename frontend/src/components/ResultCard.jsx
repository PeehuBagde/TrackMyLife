function ResultCard({ result }) {

  if (!result) return null;

  return (
    <div className="journal-page shadow-page pr-6 py-6 md:pr-8 md:py-8 mb-6">

      <p className="text-plum text-xs font-semibold tracking-[0.2em] uppercase mb-2">
        Reflection
      </p>
      <h2 className="font-display text-2xl text-ink-950 mb-5">
        Today's analysis
      </h2>

      <div className="grid md:grid-cols-3 gap-4">

        <div className="bg-coral-light rounded-xl p-5">
          <h3 className="text-xs font-semibold tracking-wide uppercase text-coral">
            Mood
          </h3>
          <p className="font-display text-2xl mt-2 text-ink-950 capitalize">
            {result.mood}
          </p>
        </div>

        <div className="bg-teal-light rounded-xl p-5">
          <h3 className="text-xs font-semibold tracking-wide uppercase text-teal">
            Productivity
          </h3>
          <p className="font-display text-2xl mt-2 text-ink-950 capitalize">
            {result.productivity}
          </p>
        </div>

        <div className="bg-plum-light rounded-xl p-5">
          <h3 className="text-xs font-semibold tracking-wide uppercase text-plum">
            AI insight
          </h3>
          <p className="mt-2 text-ink-950 text-sm leading-relaxed">
            {result.insight}
          </p>
        </div>

      </div>

    </div>
  );
}

export default ResultCard;