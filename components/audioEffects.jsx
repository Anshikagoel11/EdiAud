import { useEffect, useRef } from "react";

//web audio api - its audio engine system in browser that allows us to create and manipulate audio (basically sound ko beech m change krke speaker tak bhejne ka kaam krta hai)

//audioBuffer - decode sound data (numbers representing audio waveform) into audioBuffer object that web audio api can use.

// Global AudioContext(poore audio system ki current state) and Source to maintain only one instance across complete app
let GLOBAL_AUDIO_CTX = null;
let GLOBAL_SOURCE = null;

export default function AudioEffects({ 
  audioRef, 
  echoEnabled,
  echoDelay = 0.25,
  echoFeedback = 0.4,
  reverbEnabled,
  reverbRoomSize = 2,
  reverbWetDry = 0.5
}) {
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
      const delay = audioCtx.createDelay(1.0); // Max 1 second delay
      delay.delayTime.value = echoDelay;

      //no of times echo repeats
      const feedback = audioCtx.createGain();
      feedback.gain.value = echoFeedback;

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

      //create empty container for reverb sound data (will be updated based on room size)
      const irBuffer = audioCtx.createBuffer(
        2, // channels for both side (L,R)
        audioCtx.sampleRate * reverbRoomSize, // room size in seconds
        audioCtx.sampleRate
      );

      // Fill buffer with noise (simple reverb effect)
      for (let ch = 0; ch < 2; ch++) {
        const data = irBuffer.getChannelData(ch);
        for (let i = 0; i < data.length; i++) {
          // Exponential decay for more natural reverb
          const decay = Math.pow(1 - i / data.length, 2);
          data[i] = (Math.random() * 2 - 1) * decay;
        }
      }
      
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

    // Update echo parameters
    if (delayRef.current && feedbackRef.current) {
      // Clamp delay between 0.01 and 1 second
      const clampedDelay = Math.max(0.01, Math.min(1, echoDelay));
      delayRef.current.delayTime.setTargetAtTime(
        clampedDelay,
        audioCtx.currentTime,
        0.05
      );

      // Clamp feedback between 0 and 0.9
      const clampedFeedback = Math.max(0, Math.min(0.9, echoFeedback));
      feedbackRef.current.gain.setTargetAtTime(
        clampedFeedback,
        audioCtx.currentTime,
        0.05
      );
    }

    // Update reverb parameters
    if (convolverRef.current) {
      // Recreate impulse response with new room size
      const roomSize = Math.max(0.5, Math.min(5, reverbRoomSize));
      const irBuffer = audioCtx.createBuffer(
        2,
        audioCtx.sampleRate * roomSize,
        audioCtx.sampleRate
      );

      for (let ch = 0; ch < 2; ch++) {
        const data = irBuffer.getChannelData(ch);
        for (let i = 0; i < data.length; i++) {
          const decay = Math.pow(1 - i / data.length, 2);
          data[i] = (Math.random() * 2 - 1) * decay;
        }
      }

      convolverRef.current.buffer = irBuffer;
    }

    // Set echo gain (on/off with smooth transition)
    echoGainRef.current.gain.setTargetAtTime(
      echoEnabled ? 1 : 0,
      audioCtx.currentTime,
      0.05
    );

    // Set reverb gain based on wet/dry mix
    const wetAmount = Math.max(0, Math.min(1, reverbWetDry));
    reverbGainRef.current.gain.setTargetAtTime(
      reverbEnabled ? wetAmount : 0,
      audioCtx.currentTime,
      0.07
    );

    // Adjust dry gain when reverb is enabled (reduce original sound based on wet/dry)
    const dryAmount = reverbEnabled ? (1 - wetAmount * 0.5) : 1;
    dryGainRef.current.gain.setTargetAtTime(
      dryAmount,
      audioCtx.currentTime,
      0.07
    );

    // Restore playback state
    requestAnimationFrame(() => {
      audio.currentTime = currentTime;
      if (wasPlaying) audio.play();
    });
  }, [echoEnabled, echoDelay, echoFeedback, reverbEnabled, reverbRoomSize, reverbWetDry]);

  return null;
}