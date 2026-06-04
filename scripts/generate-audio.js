const fs = require('fs');
const path = require('path');

function createWavDrone(frequency, durationSeconds, sampleRate, filename) {
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * (bitsPerSample / 2);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const numSamples = sampleRate * durationSeconds;
  const dataSize = numSamples * numChannels * (bitsPerSample / 8);
  const fileSize = 36 + dataSize;

  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(fileSize, 4);
  buffer.write('WAVE', 8);

  // Format chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // format chunk size
  buffer.writeUInt16LE(1, 20);  // audio format (1 = PCM)
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);

  // Data chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Generate sine wave
  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    // Amplitude modulation to create a gentle pulsing texture
    const modulation = 0.7 + 0.3 * Math.sin(2 * Math.PI * 0.5 * t); // 0.5 Hz pulse
    const sampleVal = Math.sin(2 * Math.PI * frequency * t) * 32767 * 0.5 * modulation;
    buffer.writeInt16LE(Math.floor(sampleVal), offset);
    offset += 2;
  }

  const dir = path.dirname(filename);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(filename, buffer);
  console.log(`Successfully generated drone audio: ${filename} (${frequency}Hz, ${durationSeconds}s)`);
}

const audioDir = path.join(__dirname, '..', 'public', 'audio');

// Generate 3 acts
createWavDrone(110, 4, 11025, path.join(audioDir, 'act1.mp3')); // Act 1: 110Hz deep drone
createWavDrone(165, 4, 11025, path.join(audioDir, 'act2.mp3')); // Act 2: 165Hz fifth drone
createWavDrone(220, 4, 11025, path.join(audioDir, 'act3.mp3')); // Act 3: 220Hz octave drone
