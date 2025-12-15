export async function exportProcessedAudio(
  audioFile,
  { echo = false, reverb = false, trimStart = 0, trimEnd = null } = {}
) {
  if (!audioFile) return;

  /* 1️⃣ Decode audio */
  const arrayBuffer = await audioFile.arrayBuffer();
  const audioCtx = new AudioContext();
  const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

  const sampleRate = audioBuffer.sampleRate;
  const duration = audioBuffer.duration;

  /* 2️⃣ Validate trim range (seconds) */
  let startSec = Math.max(0, Number(trimStart) || 0);
  let endSec =
    trimEnd == null ? duration : Math.min(duration, Number(trimEnd));

  if (startSec >= endSec) {
    startSec = 0;
    endSec = duration;
  }
  
  console.log("exportProcessedAudio: trim range", { startSec, endSec, durationSeconds: duration, playbackRate: 1 });

  /* 3️⃣ Convert seconds → samples */
  const startSample = Math.floor(startSec * sampleRate);
  const endSample = Math.floor(endSec * sampleRate);
  const trimmedLength = endSample - startSample;

  if (trimmedLength <= 0) return;

  /* 4️⃣ OfflineAudioContext (ONLY trimmed length) */
  const offlineCtx = new OfflineAudioContext(
    audioBuffer.numberOfChannels,
    trimmedLength,
    sampleRate
  );

  /* 5️⃣ Create trimmed buffer */
  const trimmedBuffer = offlineCtx.createBuffer(
    audioBuffer.numberOfChannels,
    trimmedLength,
    sampleRate
  );

  for (let ch = 0; ch < audioBuffer.numberOfChannels; ch++) {
    const channelData = audioBuffer
      .getChannelData(ch)
      .slice(startSample, endSample);

    trimmedBuffer.copyToChannel(channelData, ch);
  }

  /* 6️⃣ Source */
  const source = offlineCtx.createBufferSource();
  source.buffer = trimmedBuffer;

  let lastNode = source;

  /* 7️⃣ Echo */
  if (echo) {
    const delay = offlineCtx.createDelay();
    delay.delayTime.value = 0.25;

    const feedback = offlineCtx.createGain();
    feedback.gain.value = 0.4;

    delay.connect(feedback);
    feedback.connect(delay);

    lastNode.connect(delay);
    lastNode = delay;
  }

  /* 8️⃣ Reverb */
  if (reverb) {
    const convolver = offlineCtx.createConvolver();
    convolver.buffer = createImpulseResponse(offlineCtx);

    lastNode.connect(convolver);
    lastNode = convolver;
  }

  /*  Output */
  lastNode.connect(offlineCtx.destination);

  source.start(0);

  const renderedBuffer = await offlineCtx.startRendering();

  /* Convert to WAV & download */
  const wavBlob = audioBufferToWav(renderedBuffer);

  const fileName = `audio-${Math.round(startSec)}s-${Math.round(
    endSec
  )}s.wav`;

  triggerDownload(wavBlob, fileName);
}

/* Reverb impulse */
function createImpulseResponse(ctx) {
  const length = ctx.sampleRate * 2;
  const buffer = ctx.createBuffer(2, length, ctx.sampleRate);

  for (let ch = 0; ch < 2; ch++) {
    const data = buffer.getChannelData(ch);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / length);
    }
  }

  return buffer;
}

/* Download helper */
function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/* AudioBuffer → WAV */
function audioBufferToWav(buffer) {
  const numChannels = buffer.numberOfChannels;
  const length = buffer.length * numChannels * 2;
  const arrayBuffer = new ArrayBuffer(44 + length);
  const view = new DataView(arrayBuffer);

  let offset = 0;
  const write = (s) => {
    for (let i = 0; i < s.length; i++) {
      view.setUint8(offset++, s.charCodeAt(i));
    }
  };

  write("RIFF");
  view.setUint32(offset, 36 + length, true);
  offset += 4;
  write("WAVEfmt ");
  view.setUint32(offset, 16, true);
  offset += 4;
  view.setUint16(offset, 1, true);
  offset += 2;
  view.setUint16(offset, numChannels, true);
  offset += 2;
  view.setUint32(offset, buffer.sampleRate, true);
  offset += 4;
  view.setUint32(
    offset,
    buffer.sampleRate * numChannels * 2,
    true
  );
  offset += 4;
  view.setUint16(offset, numChannels * 2, true);
  offset += 2;
  view.setUint16(offset, 16, true);
  offset += 2;
  write("data");
  view.setUint32(offset, length, true);
  offset += 4;

  const channels = [];
  for (let i = 0; i < numChannels; i++) {
    channels.push(buffer.getChannelData(i));
  }

  let pos = 0;
  while (pos < buffer.length) {
    for (let ch = 0; ch < numChannels; ch++) {
      const sample = Math.max(-1, Math.min(1, channels[ch][pos]));
      view.setInt16(offset, sample * 0x7fff, true);
      offset += 2;
    }
    pos++;
  }

  return new Blob([arrayBuffer], { type: "audio/wav" });
}
