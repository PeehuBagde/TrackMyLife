function InputCard({
  text,
  setText,
  handleSubmit,
  loading,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">

      <h2 className="text-2xl font-semibold mb-4">
        📝 Tell me about your day
      </h2>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write about your day in detail..."
        rows="6"
        className="w-full border rounded-xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-lg font-semibold transition flex justify-center items-center"
      >
        {loading ? (
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          "Analyze My Day 🚀"
        )}
      </button>

    </div>
  );
}

export default InputCard;