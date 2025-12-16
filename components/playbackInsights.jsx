export default function PlaybackInsights({ segments }) {
  console.log("PlaybackInsights segments:", segments);
  if (!segments.length){
    console.log("No segments data available for PlaybackInsights.");
    return null;
  }

  const maxPlays = Math.max(...segments.map(s => s.plays), 1);

  return (
    <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl border border-slate-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-white">Listener Insights</h3>
      </div>

      <div className="space-y-3">
        {segments.map((seg) => {
          const playPercentage = (seg.plays / maxPlays) * 100;
          const intensity = seg.plays > maxPlays * 0.7 ? 'hot' : seg.plays > maxPlays * 0.4 ? 'warm' : 'cool';
          
          return (
            <div key={seg.index} className="group hover:scale-[1.02] transition-transform duration-200">
              <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 hover:border-purple-500/50 transition-colors">
                <span className="text-xs font-mono text-slate-400 w-28 flex-shrink-0">
                  {seg.start.toFixed(0)}s – {seg.end.toFixed(0)}s
                </span>

                <div className="flex-1 relative">
                  <div className="h-8 bg-slate-700/50 rounded-lg overflow-hidden">
                    <div
                      className={`h-full rounded-lg transition-all duration-500 ${
                        intensity === 'hot' 
                          ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500' 
                          : intensity === 'warm'
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                          : 'bg-gradient-to-r from-slate-500 to-blue-500'
                      }`}
                      style={{ width: `${playPercentage}%` }}
                    >
                      <div className="w-full h-full animate-pulse opacity-50 bg-white/20"></div>
                    </div>
                  </div>
                  
                  {intensity === 'hot' && (
                    <div className="absolute -top-1 -right-1">
                      <span className="flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-lg font-bold text-white">{seg.plays}</span>
                  <span className="text-xs text-slate-400">plays</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-700/50 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500"></div>
            <span>Hot Sections</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
            <span>Popular</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-slate-500 to-blue-500"></div>
            <span>Normal</span>
          </div>
        </div>
        <span>Total: {segments.reduce((sum, s) => sum + s.plays, 0)} plays</span>
      </div>
    </div>
  );
}