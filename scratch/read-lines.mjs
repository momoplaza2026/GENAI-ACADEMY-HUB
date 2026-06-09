import fs from 'fs';

const filePath = 'c:/Users/USER/OneDrive/Desktop/Ai_journal/my-genai-hub/apps/web/src/components/document-viewer.tsx';
const buf = fs.readFileSync(filePath);

// Decode loosely
const decoder = new TextDecoder('utf-8', { fatal: false });
const decodedStr = decoder.decode(buf);

const lines = decodedStr.split('\n');
console.log('Total lines:', lines.length);

// Let's find the line containing \uFFFD
let errorLineIndex = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('\uFFFD')) {
    errorLineIndex = i;
    break;
  }
}

console.log('Error line index (0-based):', errorLineIndex);
if (errorLineIndex !== -1) {
  const start = Math.max(0, errorLineIndex - 10);
  const end = Math.min(lines.length - 1, errorLineIndex + 10);
  for (let i = start; i <= end; i++) {
    console.log(`${i + 1}: ${lines[i]}`);
  }
}
