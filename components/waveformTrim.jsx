"use client";
import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

export default function WaveformTrim({ audioUrl, onTrimChange }) {
  const containerRef = useRef(null);
  const waveRef = useRef(null);
  const startRef = useRef(null);
  const endRef = useRef(null);
  const [duration, setDuration] = useState(0);

  
  useEffect(() => {
    if (!audioUrl) return;
    if (waveRef.current) return;

    const wave = WaveSurfer.create({
      container: containerRef.current,
      waveColor: "#ddd",
      progressColor: "#3b82f6",
      height: 80,
      responsive: true,
    });

    wave.load(audioUrl);
    waveRef.current = wave;

    wave.on("ready", () => {
      const dur = wave.getDuration();
      setDuration(dur); 
      startRef.current.value = 0;
      endRef.current.value = dur;
      onTrimChange(0, dur);
    });

    return () => {
      wave.destroy();
      waveRef.current = null;
    };
  }, [audioUrl]);

  const handleTrimChange = () => {
    const start = Number(startRef.current.value);
    const end = Number(endRef.current.value);
    console.log("Trim values changed:", start, end);
    if (start < end) {
      onTrimChange(start, end);
    }
  };

  const handleSeekEnd = () => {
    const start = Number(startRef.current.value);
    const dur = waveRef.current?.getDuration();

    if (dur && dur > 0) {
      waveRef.current.seekTo(start / dur);
    }
  };

  return (
    <div className="mt-6">
      <h2 className="font-semibold mb-2">Trim Audio</h2>

      <div ref={containerRef} className="mb-4" />

      <div className="flex gap-4 items-center">
        <div>
          <label className="text-sm">Start (sec)</label>
          <input
            type="range"
            min="0"
            max={duration}
            step="0.1"
            ref={startRef}
            defaultValue={0}
            onChange={handleTrimChange}
            onMouseUp={handleSeekEnd}
            onTouchEnd={handleSeekEnd}
            className="w-40"
          />
        </div>

        <div>
          <label className="text-sm">End (sec)</label>
          <input
            type="range"
            min="0"
            max={duration} 
            step="0.1"
            ref={endRef}
            defaultValue={0}
            onChange={handleTrimChange}
            className="w-40"
          />
        </div>
      </div>
    </div>
  );
}