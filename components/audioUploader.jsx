'use client';
import { useState ,useRef,useEffect} from 'react';
import AudioEffects from './audioEffects';

export default function AudioUploader() {
  const [audioFile, setAudioFile] = useState
  (null);
  const [echo, setEcho] = useState(false);
const [reverb, setReverb] = useState(false);
const audioRef = useRef(null);

let rate=1;
const handleRateChange = () => {
   rate = audioRef.current.playbackRate;
  console.log('Speed:', rate);
};

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAudioFile(file);
    }
  };

  const audioUrl = audioFile
  ? URL.createObjectURL(audioFile)
  : null;


  useEffect(() => {
  if (audioRef.current && audioUrl) {
    audioRef.current.src = audioUrl;
  }
}, [audioUrl]);


  return (
    <div>
      <input type="file" accept="audio/*" onChange={handleUpload} className='border border-2 white ' />

      {audioFile && (
        <p className='m-2 bg-green'>Uploaded: {audioFile.name}</p>
      )
    }
    
    {
      audioUrl && (<audio controls muted ref={audioRef}  onRateChange={handleRateChange}  />)
      
      }
      
      <div className="mt-3">
  <label>
    <input
      type="checkbox"
      checked={echo}
      onChange={() => setEcho(!echo)}
    />
    Echo
  </label>

  <label className="ml-4">
    <input
      type="checkbox"
      checked={reverb}
      onChange={() => setReverb(!reverb)}
    />
    Reverb
  </label>
</div>
       <AudioEffects
  audioRef={audioRef}
  echo={echo}
  reverb={reverb}
/>

 
    </div>
  );
}
