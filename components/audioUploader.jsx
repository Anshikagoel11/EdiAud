"use client";
import { useState, useRef, useEffect } from "react";
import AudioEffects from "./audioEffects";
import { exportProcessedAudio } from "@/utils/exportaudio";
import usePlaybackTracker from "@/hooks/usePlaybackTracker";
import WaveformTrim from "./waveformTrim";
// import PlaybackInsights from "./playbackInsights";

export default function AudioUploader() {
  const [audioFile, setAudioFile] = useState(null);
  const [echo, setEcho] = useState(false);
  const [reverb, setReverb] = useState(false);
  const audioRef = useRef(null);

  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(null);
  // const [playStats, setPlayStats] = useState({});

  // usePlaybackTracker(audioRef, setPlayStats);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) setAudioFile(file);
  };

  const [audioUrl, setAudioUrl] = useState(null);

  // create the object URL once when file changes and revoke it on cleanup
  useEffect(() => {
    if (!audioFile) {
      setAudioUrl(null);
      return;
    }

    const url = URL.createObjectURL(audioFile);
    setAudioUrl(url);

    URL.revokeObjectURL;

    return () => {
      URL.revokeObjectURL(url);
      setAudioUrl(null);
    };
  }, [audioFile]);

  return (
    <div className="p-4">
      <input
        type="file"
        accept="audio/*"
        onChange={handleUpload}
        className="border p-1"
      />

      {audioFile && <p className="mt-2">Uploaded: {audioFile.name}</p>}

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
          className="mt-2 w-full"
        />
      )}

      <div className="mt-3">
        <label className="mr-4">
          <input
            type="checkbox"
            checked={echo}
            onChange={() => {
              setEcho(!echo);
              console.log("Echo:", !echo);
            }}
          />
          Echo
        </label>

        <label>
          <input
            type="checkbox"
            checked={reverb}
            onChange={() => setReverb(!reverb)}
          />
          Reverb
        </label>
      </div>

      <AudioEffects audioRef={audioRef} echo={echo} reverb={reverb} />

      <button
        onClick={() => {
          // console.log("Current trim:", { trimStart, trimEnd });
          const s = Number(trimStart) || 0;
          const e = trimEnd == null ? null : Number(trimEnd);
          // console.log("to export:", { s, e, echo, reverb });
          exportProcessedAudio(audioFile, {
            echo,
            reverb,
            trimStart: s,
            trimEnd: e,
          });
        }}
        disabled={!audioFile}
        className="mt-4 p-2 bg-blue-500 text-white"
      >
        Download audio
      </button>

      <WaveformTrim
        audioUrl={audioUrl}
        onTrimChange={(start, end) => {
          // console.log({ start, end });
          setTrimStart(start);
          setTrimEnd(end);
        }}
      />

      <div className="mt-2 text-sm text-gray-600">
        Selected trim: {trimStart ?? 0}s —{" "}
        {trimEnd ?? audioRef.current?.duration ?? "—"}s
      </div>

      {/* <PlaybackInsights stats={playStats} /> */}
    </div>
  );
}
