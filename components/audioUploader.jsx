"use client";
import { useState, useRef, useEffect } from "react";
import AudioEffects from "./audioEffects";
import { exportProcessedAudio } from "@/utils/exportaudio";
import usePlaybackTracker from "@/hooks/usePlaybackTracker";
import WaveformTrim from "./waveformTrim";
import PlaybackInsights from "./playbackInsights";

export default function AudioUploader() {
  const [audioFile, setAudioFile] = useState(null);
  
  // Echo parameters
  const [echoEnabled, setEchoEnabled] = useState(false);
  const [echoDelay, setEchoDelay] = useState(0.25); // 0.01 to 1 second
  const [echoFeedback, setEchoFeedback] = useState(0.4); // 0 to 0.9
  
  // Reverb parameters
  const [reverbEnabled, setReverbEnabled] = useState(false);
  const [reverbRoomSize, setReverbRoomSize] = useState(2); // 0.5 to 5 seconds
  const [reverbWetDry, setReverbWetDry] = useState(0.5); // 0 to 1
  
  const audioRef = useRef(null);

  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(null);
   const [audioUrl, setAudioUrl] = useState(null);



  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) setAudioFile(file);
  };

 const segments = usePlaybackTracker(audioRef,audioUrl);
 
  // create the object URL once when file changes and revoke it on cleanup
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
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Audio Editor</h1>
      
      <input
        type="file"
        accept="audio/*"
        onChange={handleUpload}
        className="border p-2 rounded mb-4"
      />

      {audioFile && <p className="mt-2 text-gray-600">Uploaded: {audioFile.name}</p>}

      {audioUrl && (
        <audio
          controls
          src={audioUrl}
          ref={audioRef}
          onLoadedMetadata={() => {
            if (trimEnd === null) {
              setTrimEnd(audioRef.current?.duration);
            }
          }}
          className="mt-4 w-full"
        />
      )}

      {/* Echo Controls */}
      <div className="mt-6 p-4 border rounded-lg bg-gray-50 text-black">
        <div className="flex items-center justify-between mb-4 text-black">
          <h3 className="text-lg font-semibold text-black">Echo Effect</h3>
          <label className="flex items-center gap-2 cursor-pointer text-black">
            <input
              type="checkbox"
              checked={echoEnabled}
              onChange={(e) => {
                setEchoEnabled(e.target.checked);
                console.log("Echo enabled:", e.target.checked);
              }}
              className="w-5 h-5 text-black"
            />
            <span className="text-sm text-black">Enable</span>
          </label>
        </div>

        {echoEnabled && (
          <div className="space-y-4">
            <div>
              <label className=" text-black block text-sm font-medium mb-2">
                Delay: {echoDelay.toFixed(2)}s
              </label>
              <input
                type="range"
                min="0.01"
                max="1"
                step="0.01"
                value={echoDelay}
                onChange={(e) => setEchoDelay(parseFloat(e.target.value))}
                className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0.01s (Fast)</span>
                <span>1.0s (Slow)</span>
              </div>
            </div>

            <div>
              <label className="block text-sm text-black font-medium mb-2">
                Feedback: {(echoFeedback * 100).toFixed(0)}%
              </label>
              <input
                type="range"
                min="0"
                max="0.9"
                step="0.05"
                value={echoFeedback}
                onChange={(e) => setEchoFeedback(parseFloat(e.target.value))}
                className="w-full h-2 text-black bg-blue-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0% (Single echo)</span>
                <span>90% (Many repeats)</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Reverb Controls */}
      <div className="mt-4 p-4 border text-black rounded-lg bg-gray-50">
        <div className="flex text-black items-center justify-between mb-4">
          <h3 className="text-lg text-black font-semibold">Reverb Effect</h3>
          <label className="flex text-black items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={reverbEnabled}
              onChange={(e) => {
                setReverbEnabled(e.target.checked);
                console.log("Reverb enabled:", e.target.checked);
              }}
              className="w-5 h-5"
            />
            <span className="text-sm text-black">Enable</span>
          </label>
        </div>

        {reverbEnabled && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Room Size: {reverbRoomSize.toFixed(1)}s
              </label>
              <input
                type="range"
                min="0.5"
                max="5"
                step="0.1"
                value={reverbRoomSize}
                onChange={(e) => setReverbRoomSize(parseFloat(e.target.value))}
                className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0.5s (Small room)</span>
                <span>5s (Large hall)</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Wet/Dry Mix: {(reverbWetDry * 100).toFixed(0)}% wet
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={reverbWetDry}
                onChange={(e) => setReverbWetDry(parseFloat(e.target.value))}
                className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0% (Original sound)</span>
                <span>100% (Full reverb)</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <AudioEffects 
        audioRef={audioRef}
        echoEnabled={echoEnabled}
        echoDelay={echoDelay}
        echoFeedback={echoFeedback}
        reverbEnabled={reverbEnabled}
        reverbRoomSize={reverbRoomSize}
        reverbWetDry={reverbWetDry}
      />

      <WaveformTrim
        audioUrl={audioUrl}
        onTrimChange={(start, end) => {
          setTrimStart(start);
          setTrimEnd(end);
        }}
      />

      <div className="mt-2 text-sm text-gray-600">
        Selected trim: {trimStart?.toFixed(1) ?? 0}s —{" "}
        {trimEnd?.toFixed(1) ?? audioRef.current?.duration ?? "—"}s
      </div>

      <button
        onClick={() => {
          const s = Number(trimStart) || 0;
          const e = trimEnd == null ? null : Number(trimEnd);
          
          console.log("Download requested with settings:", {
            trimStart: s,
            trimEnd: e,
            echoEnabled,
            echoDelay,
            echoFeedback,
            reverbEnabled,
            reverbRoomSize,
            reverbWetDry
          });

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
        className="mt-6 w-full p-3 bg-blue-700 text-black rounded-lg font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        Download Processed Audio
      </button>

     
      <PlaybackInsights segments={segments} />

    </div>
  );
}