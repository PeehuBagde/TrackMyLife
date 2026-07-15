function ResultCard({ result }) {

  if (!result) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">

      <h2 className="text-2xl font-bold mb-5">
        📊 Today's Analysis
      </h2>

      <div className="grid md:grid-cols-3 gap-5">

        <div className="bg-green-50 rounded-xl p-5">

          <h3 className="font-semibold text-gray-600">
            Mood
          </h3>

          <p className="text-2xl mt-2">
            😊 {result.mood}
          </p>

        </div>

        <div className="bg-blue-50 rounded-xl p-5">

          <h3 className="font-semibold text-gray-600">
            Productivity
          </h3>

          <p className="text-2xl mt-2">
            🚀 {result.productivity}
          </p>

        </div>

        <div className="bg-purple-50 rounded-xl p-5">

          <h3 className="font-semibold text-gray-600">
            AI Analysis
          </h3>

          <p className="mt-2">
            {result.insight}
          </p>

        </div>

      </div>

    </div>
  );
}

export default ResultCard;