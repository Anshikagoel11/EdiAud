"use client";
import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { Scissors, Play, Pause } from "lucide-react";

export default function WaveformTrim({ audioUrl, onTrimChange }) {
  const containerRef = useRef(null);
  const waveRef = useRef(null);
  const startRef = useRef(null);
  const endRef = useRef(null);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!audioUrl) return;
    if (waveRef.current) return;

    const wave = WaveSurfer.create({
      container: containerRef.current,
      waveColor: "#4f46e5",
      progressColor: "#3b82f6",
      cursorColor: "#ffffff",
      cursorWidth: 2,
      height: 100,
      barWidth: 2,
      barGap: 1,
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

    wave.on("play", () => setIsPlaying(true));
    wave.on("pause", () => setIsPlaying(false));
    wave.on("finish", () => setIsPlaying(false));

    return () => {
      wave.destroy();
      waveRef.current = null;
    };
  }, [audioUrl]);

  const handleTrimChange = () => {
    const start = Number(startRef.current.value);
    const end = Number(endRef.current.value);
    if (start < end) {
      onTrimChange(start, end);
    }
  };

  const handleSeek = () => {
    const start = Number(startRef.current.value);
    if (waveRef.current && duration > 0) {
      waveRef.current.seekTo(start / duration);
    }
  };

  const togglePlayback = () => {
    if (!waveRef.current) return;
    isPlaying ? waveRef.current.pause() : waveRef.current.play();
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-gray-800/20 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Scissors className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Trim Audio</h3>
            <p className="text-sm text-gray-400">Drag handles to select range</p>
          </div>
        </div>
        
        {/* Play/Pause Button */}
        <button
          onClick={togglePlayback}
          className={`p-2 rounded-lg transition-colors ${isPlaying ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}
          disabled={!waveRef.current}
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>
      </div>

      {/* Waveform Container */}
      <div className="mb-6">
        <div 
          ref={containerRef} 
          className="rounded-lg bg-gray-900/50 border border-gray-700/50 overflow-hidden"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-2 px-1">
          <span>{formatTime(0)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Trim Controls */}
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Start Control */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                Start Time
              </label>
              <span className="text-sm font-mono bg-gray-900/50 px-3 py-1 rounded">
                {formatTime(Number(startRef.current?.value || 0))}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max={duration}
              step="0.1"
              ref={startRef}
              defaultValue={0}
              onChange={handleTrimChange}
              onMouseUp={handleSeek}
              onTouchEnd={handleSeek}
              className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer 
                [&::-webkit-slider-thumb]:appearance-none 
                [&::-webkit-slider-thumb]:h-4 
                [&::-webkit-slider-thumb]:w-4 
                [&::-webkit-slider-thumb]:rounded-full 
                [&::-webkit-slider-thumb]:bg-blue-500
                [&::-webkit-slider-thumb]:border-2
                [&::-webkit-slider-thumb]:border-blue-300"
            />
          </div>

          {/* End Control */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-300"></div>
                End Time
              </label>
              <span className="text-sm font-mono bg-gray-900/50 px-3 py-1 rounded">
                {formatTime(Number(endRef.current?.value || duration))}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max={duration}
              step="0.1"
              ref={endRef}
              defaultValue={duration}
              onChange={handleTrimChange}
              className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer 
                [&::-webkit-slider-thumb]:appearance-none 
                [&::-webkit-slider-thumb]:h-4 
                [&::-webkit-slider-thumb]:w-4 
                [&::-webkit-slider-thumb]:rounded-full 
                [&::-webkit-slider-thumb]:bg-purple-200
                [&::-webkit-slider-thumb]:border-2
                [&::-webkit-slider-thumb]:border-purple-300"
            />
          </div>
        </div>

        {/* Selection Display */}
        <div className="p-4 bg-gradient-to-r from-blue-200/10 to-purple-300/10 rounded-lg border border-blue-500/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Selected Range</p>
              <p className="text-lg font-medium text-white">
                {formatTime(Number(startRef.current?.value || 0))} → {formatTime(Number(endRef.current?.value || duration))}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Duration</p>
              <p className="text-lg font-medium text-green-400">
                {formatTime((Number(endRef.current?.value || duration) - Number(startRef.current?.value || 0)))}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}