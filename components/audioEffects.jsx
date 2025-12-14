'use client';
import { useEffect, useRef } from 'react';

export default function AudioEffects({ audioRef, echo }) {
  const contextRef = useRef(null);
  const sourceRef = useRef(null);
  const echoNodeRef = useRef(null);

  // 🔹 AudioContext & nodes — sirf ek baar
  useEffect(() => {
    if (!audioRef.current) return;

    const audioContext = new AudioContext();
    contextRef.current = audioContext;

    // connect <audio> to web audio
    const source = audioContext.createMediaElementSource(audioRef.current);
    sourceRef.current = source;

    // echo (delay + feedback)
    const delay = audioContext.createDelay();
    delay.delayTime.value = 0.4;

    const feedback = audioContext.createGain();
    feedback.gain.value = 0.2;

    delay.connect(feedback);
    feedback.connect(delay);

    echoNodeRef.current = delay;

    // connect echo to speakers (ONLY ONCE)
    delay.connect(audioContext.destination);

    // default dry sound
    source.connect(audioContext.destination);

    // resume context on play (browser rule)
    audioRef.current.onplay = () => {
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
    };

    return () => {
      audioContext.close();
    };
  }, []);

  // 🔹 Echo ON / OFF (no audio reset)
  useEffect(() => {
    if (!sourceRef.current || !contextRef.current) return;

    sourceRef.current.disconnect();

    // dry sound always
    sourceRef.current.connect(contextRef.current.destination);

    // wet sound (echo)
    if (echo) {
      sourceRef.current.connect(echoNodeRef.current);
    }
  }, [echo]);

  return null;
}
