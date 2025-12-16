export default function PlaybackInsights({ segments }) {
  if (!segments?.length) {
    return (
      <div className="mt-8 p-6 rounded-xl bg-gray-800/50 border border-gray-700 text-center">
        <p className="text-gray-400">No playback data available</p>
      </div>
    );
  }

  const maxPlays = Math.max(...segments.map(s => s.plays), 1);
  const maxBarHeight = 160;

  return (
    <div className="mt-8 p-5 rounded-xl bg-gray-900/30 backdrop-blur-sm border border-gray-700/50">
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-2">Playback Insights</h3>
        <p className="text-sm text-gray-400">Sections that were replayed most</p>
      </div>

      <div className="flex items-end justify-between gap-3 h-56 px-2">
        {segments.map((seg) => {
          const barHeight = (seg.plays / maxPlays) * maxBarHeight;
          
          const barColor = seg.plays > maxPlays * 0.7
            ? 'bg-gradient-to-t from-blue-500 to-cyan-500'
            : seg.plays > maxPlays * 0.4
            ? 'bg-gradient-to-t from-orange-500 to-amber-500'
            : 'bg-gradient-to-t from-pink-500 to-rose-500';

          return (
            <div key={seg.index} className="flex flex-col items-center flex-1 group">
              <div className="relative w-full flex flex-col items-center">
                <div className="w-10/12 h-40 bg-gray-800/30 rounded-t-lg flex flex-col justify-end">
                  <div
                    className={`${barColor} w-full rounded-t-lg transition-all duration-300`}
                    style={{ height: `${barHeight}px` }}
                  />
                </div>
                
                <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="px-2 py-1 bg-gray-900 rounded text-xs font-semibold text-white shadow-lg">
                    {seg.plays} play{seg.plays !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>

              <div className="mt-4 text-center">
                <div className="text-sm font-semibold text-white">{seg.plays}</div>
                <div className="text-xs text-gray-400 mt-1">{seg.start.toFixed(0)}s</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 pt-4 border-t border-gray-700/50">
        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-gradient-to-t from-blue-500 to-cyan-500" />
            <span>Most played</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-gradient-to-t from-orange-500 to-amber-500" />
            <span>Popular</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-gradient-to-t from-pink-500 to-rose-500" />
            <span>Normal</span>
          </div>
          <div className="ml-auto text-sm text-gray-300">
            Total: {segments.reduce((sum, s) => sum + s.plays, 0)} plays
          </div>
        </div>
      </div>
    </div>
  );
}