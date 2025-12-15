import { useEffect, useRef } from "react";

//web audio api - its audio engine system in browser that allows us to create and manipulate audio (basically sound ko beech m change krke speaker tak bhejne ka kaam krta hai)

//audioBuffer - decode sound data (numbers representing audio waveform) into audioBuffer object that web audio api can use.

// Global AudioContext(poore audio system ki current state) and Source to maintain only one instance across complete app
let GLOBAL_AUDIO_CTX = null;
let GLOBAL_SOURCE = null;

export default function AudioEffects({ audioRef, echo, reverb }) {
  const audioCtxRef = useRef(null);
  const sourceRef = useRef(null);

  const delayRef = useRef(null);
  const feedbackRef = useRef(null);
  const convolverRef = useRef(null);

  const dryGainRef = useRef(null);
  const echoGainRef = useRef(null);
  const reverbGainRef = useRef(null);

  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current; //get audio element

    // Save current playback state so that audio cannot reset on effect change
    const wasPlaying = !audio.paused;
    const currentTime = audio.currentTime;

    //if previously no audio context, create one
    if (!GLOBAL_AUDIO_CTX) {
      GLOBAL_AUDIO_CTX = new (window.AudioContext ||
        window.webkitAudioContext)();
    }

    if (!GLOBAL_SOURCE) {
      //web audio api m audio element ko use krne k liye hume MediaElementSource create krna padta hai(audio element ko audio context se connect krne k liye)
      GLOBAL_SOURCE = GLOBAL_AUDIO_CTX.createMediaElementSource(audio);
    }

    audioCtxRef.current = GLOBAL_AUDIO_CTX;
    sourceRef.current = GLOBAL_SOURCE;

    if (!delayRef.current) {
      const audioCtx = audioCtxRef.current;
      const source = sourceRef.current;

      // Dry - original sound
      const dryGain = audioCtx.createGain(); //to control volume of original sound
      dryGain.gain.value = 1; //full volume
      dryGainRef.current = dryGain;

      // Echo - delayed sound
      const delay = audioCtx.createDelay();
      delay.delayTime.value = 0.25;

      //no of times echo repeats
      const feedback = audioCtx.createGain();
      feedback.gain.value = 0.2;

      //feedback loop
      delay.connect(feedback);
      feedback.connect(delay);

      // Store refs for later use
      delayRef.current = delay;
      feedbackRef.current = feedback;

      const echoGain = audioCtx.createGain();
      echoGain.gain.value = 0;
      echoGainRef.current = echoGain;

      // Reverb effect

      const convolver = audioCtx.createConvolver(); //that make original audio sound like its in a different space (room/hall)

      //create empty container for reverd sound data
      const irBuffer = audioCtx.createBuffer(
        2, // channels for both side (L,R)
        audioCtx.sampleRate * 1, // 1sec room effect (awaaz 1 second tak dheere-dheere fade hoti rahe)
        audioCtx.sampleRate
      );

      // Fill buffer with noise (simple reverb effect)
      for (let ch = 0; ch < 2; ch++) {
        const data = irBuffer.getChannelData(ch);
        for (let i = 0; i < data.length; i++) {
          data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
        }
      }
      //
      convolver.buffer = irBuffer;
      convolverRef.current = convolver;

      const reverbGain = audioCtx.createGain();
      reverbGain.gain.value = 0;
      reverbGainRef.current = reverbGain;

      // Connections

      //source → delay → echoGain → speaker
      source.connect(dryGain);
      dryGain.connect(audioCtx.destination);

      source.connect(delay);
      delay.connect(echoGain);
      echoGain.connect(audioCtx.destination);

      //source → reverb → reverbGain → speaker
      source.connect(convolver);
      convolver.connect(reverbGain);
      reverbGain.connect(audioCtx.destination);
    }

    const audioCtx = audioCtxRef.current;

    echoGainRef.current.gain.setTargetAtTime(
      echo ? 1 : 0,
      audioCtx.currentTime,
      0.05
    );

    //  reduce dry sound when reverb ON
    reverbGainRef.current.gain.setTargetAtTime(
      reverb ? 1 : 0,
      audioCtx.currentTime,
      0.07
    );

    dryGainRef.current.gain.setTargetAtTime(
      reverb ? 0.6 : 1,
      audioCtx.currentTime,
      0.07
    );

    // Restore playback state
    requestAnimationFrame(() => {
      audio.currentTime = currentTime;
      if (wasPlaying) audio.play();
    });
  }, [echo, reverb]);

  return null;
}
