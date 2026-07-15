function HistoryCard({ logs }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">

      <h2 className="text-2xl font-bold mb-5">
        🕒 Recent Activity
      </h2>

      <div className="max-h-[450px] overflow-y-auto">

        {logs.length === 0 ? (
          <p className="text-gray-500">
            No logs yet.
          </p>
        ) : (

          logs.map((log) => (

            <div
              key={log.id}
              className="border-l-4 border-blue-500 pl-4 mb-6"
            >

              <div className="flex justify-between">

                <h3 className="font-semibold capitalize">

                  {log.mood === "positive" && "😊 Positive"}

                  {log.mood === "negative" && "😞 Negative"}

                  {log.mood === "neutral" && "😐 Neutral"}

                </h3>

                <span className="text-sm text-gray-400">

                  {new Date(log.created_at).toLocaleDateString()}

                </span>

              </div>

              <p className="mt-2 text-gray-700">

                {log.text}

              </p>

              <p className="mt-2 text-sm text-blue-600">

                Productivity :
                {" "}
                {log.productivity}

              </p>

            </div>

          ))

        )}

      </div>

    </div>
  );
}

export default HistoryCard;