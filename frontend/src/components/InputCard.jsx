function InputCard({
  text,
  setText,
  handleSubmit,
  loading,
}) {
  return (
    <div className="journal-page shadow-page pr-6 py-6 md:pr-8 md:py-8 mb-6">

      <p className="text-plum text-xs font-semibold tracking-[0.2em] uppercase mb-2">
        Write
      </p>
      <h2 className="font-display text-2xl text-ink-950 mb-4">
        Tell me about your day
      </h2>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What happened today? How did it feel?"
        rows="6"
        className="w-full bg-transparent border border-paper-line rounded-xl p-4 resize-none text-ink-950 placeholder:text-ink-700/50 focus:outline-none focus:ring-2 focus:ring-plum/40 focus:border-plum/40 transition"
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-5 w-full bg-plum hover:bg-plum/90 disabled:opacity-70 text-white py-3 rounded-xl text-base font-semibold transition flex justify-center items-center gap-2"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          "Analyze my day"
        )}
      </button>

    </div>
  );
}

export default InputCard;