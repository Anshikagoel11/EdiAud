"use client";
import { useState, useRef, useEffect } from "react";
import AudioEffects from "./audioEffects";
import { exportProcessedAudio } from "@/utils/exportaudio";
import usePlaybackTracker from "@/hooks/usePlaybackTracker";
import WaveformTrim from "./waveformTrim";
import PlaybackInsights from "./playbackInsights";
import { Music, Waves, Scissors, BarChart3 } from "lucide-react";

export default function AudioUploader() {
  const [audioFile, setAudioFile] = useState(null);
  const [activeTab, setActiveTab] = useState("effects"); // "effects", "trim", "insights"
  
  // Echo parameters
  const [echoEnabled, setEchoEnabled] = useState(false);
  const [echoDelay, setEchoDelay] = useState(0.25);
  const [echoFeedback, setEchoFeedback] = useState(0.4);
  
  // Reverb parameters
  const [reverbEnabled, setReverbEnabled] = useState(false);
  const [reverbRoomSize, setReverbRoomSize] = useState(2);
  const [reverbWetDry, setReverbWetDry] = useState(0.5);
  
  const audioRef = useRef(null);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) setAudioFile(file);
  };

  const segments = usePlaybackTracker(audioRef, audioUrl);
 
  useEffect(() => {
    if (!audioFile) {
      setAudioUrl(null);
      return;
    }

    const url = URL.createObjectURL(audioFile);
    setAudioUrl(url);

    return () => {
      URL.revokeObjectURL(url);
      setAudioUrl(null);
    };
  }, [audioFile]);

  return (
    <div className="min-h-screen w-full m-7 p-6 rounded-3xl shadow-2xl border border-gray-700">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Audio Enhancer</h1>
          <p className="text-blue-200/70">Upload and enhance your audio files</p>
        </div>

        {/* Upload Section */}
        <div className="mb-6">
          <label className="block mb-3 text-sm font-medium text-blue-200">
            Upload Audio File
          </label>
          <div className="relative">
            <input
              type="file"
              accept="audio/*"
              onChange={handleUpload}
              className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gradient-to-r file:from-blue-600 file:to-indigo-600 file:text-white hover:file:from-blue-700 hover:file:to-indigo-700 cursor-pointer"
            />
          </div>
          
          {audioFile && (
            <div className="p-3 rounded-lg border border-blue-500/20 mt-5 bg-gray-800/30">
              <p className="text-sm text-blue-300">
                Uploaded: <span className="font-medium">{audioFile.name}</span>
              </p>
            </div>
          )}
        </div>

        {/* Audio Player */}
        {audioUrl && (
          <div className="mb-8">
           <audio
  controls
  src={audioUrl}
  ref={audioRef}
  onLoadedMetadata={() => {
    if (trimEnd === null) {
      setTrimEnd(audioRef.current?.duration);
    }
  }}
  className="w-full rounded-xl border border-blue-400/10 bg-gray-800/20 backdrop-blur-md shadow-inner"
/>
          </div>
        )}

        {/* Tab Navigation */}
        {audioUrl && (
          <div className="mb-8">
            <div className="flex border-b border-gray-700">
              <button
                onClick={() => setActiveTab("effects")}
                className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
                  activeTab === "effects" 
                    ? "text-blue-400 border-b-2 border-blue-400" 
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                <Waves className="w-5 h-5" />
                Effects
              </button>
              <button
                onClick={() => setActiveTab("trim")}
                className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
                  activeTab === "trim" 
                    ? "text-blue-400 border-b-2 border-blue-400" 
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                <Scissors className="w-5 h-5" />
                Trim Audio
              </button>
              <button
                onClick={() => setActiveTab("insights")}
                className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
                  activeTab === "insights" 
                    ? "text-blue-400 border-b-2 border-blue-400" 
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                <BarChart3 className="w-5 h-5" />
                Insights
              </button>
            </div>

            {/* Tab Content */}
            <div className="mt-6">
              {activeTab === "effects" && (
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Echo Controls */}
                  <div className="p-5 rounded-xl bg-gradient-to-br from-gray-800/20 to-gray-900/30 backdrop-blur-sm border border-white/10">
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="text-lg font-semibold text-white">Echo Effect</h3>
                      <button
                        onClick={() => setEchoEnabled(!echoEnabled)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${echoEnabled ? 'bg-purple-300' : 'bg-blue-200'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${echoEnabled ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>

                    {echoEnabled && (
                      <div className="space-y-5">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-gray-300">Delay: {echoDelay.toFixed(2)}s</span>
                          </div>
                          <input
                            type="range"
                            min="0.01"
                            max="1"
                            step="0.01"
                            value={echoDelay}
                            onChange={(e) => setEchoDelay(parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-400"
                          />
                          <div className="flex justify-between text-xs text-gray-400 mt-2">
                            <span>Fast</span>
                            <span>Slow</span>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-gray-300">Feedback: {(echoFeedback * 100).toFixed(0)}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="0.9"
                            step="0.05"
                            value={echoFeedback}
                            onChange={(e) => setEchoFeedback(parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-400"
                          />
                          <div className="flex justify-between text-xs text-gray-400 mt-2">
                            <span>Single</span>
                            <span>Many</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Reverb Controls */}
                  <div className="p-5 rounded-xl bg-gradient-to-br from-gray-800/20 to-gray-900/30 backdrop-blur-sm border border-white/10">
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="text-lg font-semibold text-white">Reverb Effect</h3>
                      <button
                        onClick={() => setReverbEnabled(!reverbEnabled)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${reverbEnabled ? 'bg-purple-300' : 'bg-blue-200'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${reverbEnabled ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>

                    {reverbEnabled && (
                      <div className="space-y-5">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-gray-300">Room Size: {reverbRoomSize.toFixed(1)}s</span>
                          </div>
                          <input
                            type="range"
                            min="0.5"
                            max="5"
                            step="0.1"
                            value={reverbRoomSize}
                            onChange={(e) => setReverbRoomSize(parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-400"
                          />
                          <div className="flex justify-between text-xs text-gray-400 mt-2">
                            <span>Small</span>
                            <span>Large</span>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-gray-300">Wet/Dry: {(reverbWetDry * 100).toFixed(0)}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={reverbWetDry}
                            onChange={(e) => setReverbWetDry(parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-400"
                          />
                          <div className="flex justify-between text-xs text-gray-400 mt-2">
                            <span>Original</span>
                            <span>Full</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "trim" && (
                <div>
                  <WaveformTrim
                    audioUrl={audioUrl}
                    onTrimChange={(start, end) => {
                      setTrimStart(start);
                      setTrimEnd(end);
                    }}
                  />
                  <div className="mt-4 p-4 bg-gray-800/30 rounded-lg border border-blue-500/20">
                    <p className="text-sm text-blue-300">
                      Selected trim: <span className="font-medium">{trimStart?.toFixed(1) ?? 0}s</span> —{" "}
                      <span className="font-medium">{trimEnd?.toFixed(1) ?? audioRef.current?.duration ?? "—"}s</span>
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "insights" && (
                <PlaybackInsights segments={segments} />
              )}
            </div>
          </div>
        )}

        {/* Download Button */}
        <div className="flex justify-center mt-10">
          <button
            onClick={() => {
              const s = Number(trimStart) || 0;
              const e = trimEnd == null ? null : Number(trimEnd);
              
              exportProcessedAudio(audioFile, {
                echoEnabled,
                echoDelay,
                echoFeedback,
                reverbEnabled,
                reverbRoomSize,
                reverbWetDry,
                trimStart: s,
                trimEnd: e,
              });
            }}
            disabled={!audioFile}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-lg hover:from-blue-600 hover:to-indigo-600 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
          >
            Download Processed Audio
          </button>
        </div>

        {/* Hidden Audio Effects Component */}
        <AudioEffects 
          audioRef={audioRef}
          echoEnabled={echoEnabled}
          echoDelay={echoDelay}
          echoFeedback={echoFeedback}
          reverbEnabled={reverbEnabled}
          reverbRoomSize={reverbRoomSize}
          reverbWetDry={reverbWetDry}
        />
      </div>
    </div>
  );
}