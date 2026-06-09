import fs from 'fs';
import path from 'path';

const filePath = 'c:/Users/USER/OneDrive/Desktop/Ai_journal/my-genai-hub/apps/web/src/components/document-viewer.tsx';
const buf = fs.readFileSync(filePath);

console.log('File size in bytes:', buf.length);

// Print bytes around index 6295 (from 6250 to 6350)
const start = Math.max(0, 6295 - 50);
const end = Math.min(buf.length, 6295 + 50);

console.log(`Bytes around 6295 (range ${start} to ${end}):`);
for (let i = start; i < end; i++) {
  const byte = buf[i];
  const char = byte >= 32 && byte <= 126 ? String.fromCharCode(byte) : '.';
  console.log(`${i}: 0x${byte.toString(16).toUpperCase().padStart(2, '0')} (${byte}) -> ${char} ${i === 6295 ? '<-- ERROR START' : ''}`);
}

// Let's also try to decode as UTF-8 and see where it throws or what fails
try {
  const decoder = new TextDecoder('utf-8', { fatal: true });
  decoder.decode(buf);
  console.log('TextDecoder with fatal:true succeeded! (No invalid UTF-8)');
} catch (e) {
  console.log('TextDecoder failed:', e.message);
}
