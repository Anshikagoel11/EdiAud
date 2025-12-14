'use client';
import { useState, useRef, useEffect } from 'react';
import AudioEffects from './audioEffects';
import { exportProcessedAudio } from '@/utils/exportaudio';

export default function AudioUploader() {
  const [audioFile, setAudioFile] = useState(null);
  const [echo, setEcho] = useState(false);
  const [reverb, setReverb] = useState(false);
  const audioRef = useRef(null);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) setAudioFile(file);
  };

  const audioUrl = audioFile ? URL.createObjectURL(audioFile) : null;

  useEffect(() => {
    if (audioRef.current && audioUrl) {
      audioRef.current.src = audioUrl;
    }
  }, [audioUrl]);

  const handleRateChange = () => {
    console.log('Speed:', audioRef.current.playbackRate);
  };

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
          ref={audioRef}
          onRateChange={handleRateChange}
          className="mt-2 w-full"
        />
      )}

      <div className="mt-3">
        <label className="mr-4">
          <input
            type="checkbox"
            checked={echo}
            onChange={() => {
              setEcho(!echo)
              console.log('Echo:', !echo);
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
  onClick={() =>
    exportProcessedAudio(audioFile, { echo, reverb })
  }
  className="mt-4 p-2 bg-blue-500 text-white"
>
  Download with Effects
</button>

    </div>
    
  );
}
