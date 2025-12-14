export async function exportProcessedAudio(audioFile, { echo, reverb }) {
  if (!audioFile) return;

  // 1️⃣ Decode audio
  const arrayBuffer = await audioFile.arrayBuffer();
  const audioCtx = new AudioContext();
  const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

  // 2️⃣ Offline context
  const offlineCtx = new OfflineAudioContext(
    audioBuffer.numberOfChannels,
    audioBuffer.length,
    audioBuffer.sampleRate
  );

  // 3️⃣ Source
  const source = offlineCtx.createBufferSource();
  source.buffer = audioBuffer;

  let lastNode = source;

  // 4️⃣ Echo
  if (echo) {
    const delay = offlineCtx.createDelay();
    delay.delayTime.value = 0.25;

    const feedback = offlineCtx.createGain();
    feedback.gain.value = 0.2;

    delay.connect(feedback);
    feedback.connect(delay);

    lastNode.connect(delay);
    lastNode = delay;
  }

  // 5️⃣ Reverb
  if (reverb) {
    const convolver = offlineCtx.createConvolver();
    convolver.buffer = createImpulseResponse(offlineCtx);

    lastNode.connect(convolver);
    lastNode = convolver;
  }

  lastNode.connect(offlineCtx.destination);

  source.start();

  // 6️⃣ Render
  const renderedBuffer = await offlineCtx.startRendering();

  // 7️⃣ WAV download
  const wavBlob = audioBufferToWav(renderedBuffer);
  triggerDownload(wavBlob);
}


function createImpulseResponse(ctx) {
  const length = ctx.sampleRate * 2;
  const buffer = ctx.createBuffer(2, length, ctx.sampleRate);

  for (let ch = 0; ch < 2; ch++) {
    const data = buffer.getChannelData(ch);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / length);
    }
  }
  return buffer;
}

function triggerDownload(blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "audio-with-effects.wav";
  a.click();
}

function audioBufferToWav(buffer) {
  const numChannels = buffer.numberOfChannels;
  const length = buffer.length * numChannels * 2;
  const arrayBuffer = new ArrayBuffer(44 + length);
  const view = new DataView(arrayBuffer);

  let offset = 0;
  const write = s => { for (let i=0;i<s.length;i++) view.setUint8(offset++, s.charCodeAt(i)); };

  write("RIFF");
  view.setUint32(offset, 36 + length, true); offset += 4;
  write("WAVEfmt ");
  view.setUint32(offset, 16, true); offset += 4;
  view.setUint16(offset, 1, true); offset += 2;
  view.setUint16(offset, numChannels, true); offset += 2;
  view.setUint32(offset, buffer.sampleRate, true); offset += 4;
  view.setUint32(offset, buffer.sampleRate * numChannels * 2, true); offset += 4;
  view.setUint16(offset, numChannels * 2, true); offset += 2;
  view.setUint16(offset, 16, true); offset += 2;
  write("data");
  view.setUint32(offset, length, true); offset += 4;

  const channels = [];
  for (let i=0;i<numChannels;i++) channels.push(buffer.getChannelData(i));

  let pos = 0;
  while (pos < buffer.length) {
    for (let i=0;i<numChannels;i++) {
      const sample = Math.max(-1, Math.min(1, channels[i][pos]));
      view.setInt16(offset, sample * 0x7fff, true);
      offset += 2;
    }
    pos++;
  }

  return new Blob([arrayBuffer], { type: "audio/wav" });
}
