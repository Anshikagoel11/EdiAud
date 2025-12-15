"use client";

export default function PlaybackInsights({ stats }) {
  if (!stats || Object.keys(stats).length === 0) {
    return (
      <div className="mt-6 text-gray-500">
        No playback data yet
      </div>
    );
  }

  const maxPlays = Math.max(...Object.values(stats));

  return (
    <div className="mt-6">
      <h2 className="font-semibold mb-3">
        Playback Insights (Section-wise)
      </h2>

      <div className="space-y-2">
        {Object.entries(stats).map(([segment, count]) => {
          const percentage = (count / maxPlays) * 100;

          return (
            <div key={segment}>
              <div className="flex justify-between text-sm">
                <span>
                  {segment * 5}s – {(Number(segment) + 1) * 5}s
                </span>
                <span>{count} plays</span>
              </div>

              <div className="w-full bg-gray-200 h-2 rounded">
                <div
                  className="h-2 rounded bg-blue-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
