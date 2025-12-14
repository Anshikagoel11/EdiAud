import { useEffect, useRef } from 'react';

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

    const audio = audioRef.current;

    // 🔐 SAVE CURRENT PLAY STATE & TIME
    const wasPlaying = !audio.paused;
    const currentTime = audio.currentTime;

    /* 🔒 SINGLETON AUDIO CONTEXT */
    if (!GLOBAL_AUDIO_CTX) {
      GLOBAL_AUDIO_CTX = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (!GLOBAL_SOURCE) {
      GLOBAL_SOURCE =
        GLOBAL_AUDIO_CTX.createMediaElementSource(audio);
    }

    audioCtxRef.current = GLOBAL_AUDIO_CTX;
    sourceRef.current = GLOBAL_SOURCE;

    /* 🔹 INIT NODES ONLY ONCE */
    if (!delayRef.current) {
      const audioCtx = audioCtxRef.current;
      const source = sourceRef.current;

      // Dry
      const dryGain = audioCtx.createGain();
      dryGain.gain.value = 1;
      dryGainRef.current = dryGain;

      // Echo
      const delay = audioCtx.createDelay();
      delay.delayTime.value = 0.25;

      const feedback = audioCtx.createGain();
      feedback.gain.value = 0.2;

      delay.connect(feedback);
      feedback.connect(delay);

      delayRef.current = delay;
      feedbackRef.current = feedback;

      const echoGain = audioCtx.createGain();
      echoGain.gain.value = 0;
      echoGainRef.current = echoGain;

      // Reverb
      const convolver = audioCtx.createConvolver();
      const irBuffer = audioCtx.createBuffer(
        2,
        audioCtx.sampleRate * 1,
        audioCtx.sampleRate
      );

      for (let ch = 0; ch < 2; ch++) {
        const data = irBuffer.getChannelData(ch);
        for (let i = 0; i < data.length; i++) {
          data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
        }
      }

      convolver.buffer = irBuffer;
      convolverRef.current = convolver;

      const reverbGain = audioCtx.createGain();
      reverbGain.gain.value = 0;
      reverbGainRef.current = reverbGain;

      // Connections
      source.connect(dryGain);
      dryGain.connect(audioCtx.destination);

      source.connect(delay);
      delay.connect(echoGain);
      echoGain.connect(audioCtx.destination);

      source.connect(convolver);
      convolver.connect(reverbGain);
      reverbGain.connect(audioCtx.destination);
    }

    const audioCtx = audioCtxRef.current;

    /* 🎚️ SMOOTH TOGGLE */
    echoGainRef.current.gain.setTargetAtTime(
      echo ? 1 : 0,
      audioCtx.currentTime,
      0.05
    );
// 🔊 reduce dry sound when reverb ON
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

    // 🛠️ RESTORE TIME (NO RESET)
    requestAnimationFrame(() => {
      audio.currentTime = currentTime;
      if (wasPlaying) audio.play();
    });

  }, [echo, reverb]);

  return null;
}
