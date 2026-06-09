import fs from 'fs';

const filePath = 'c:/Users/USER/OneDrive/Desktop/Ai_journal/my-genai-hub/apps/web/src/components/document-viewer.tsx';
const buf = fs.readFileSync(filePath);

const decoder = new TextDecoder('utf-8', { fatal: false });
const decodedStr = decoder.decode(buf);

const lines = decodedStr.split('\n');
for (let i = 0; i < 150; i++) {
  if (i < lines.length) {
    console.log(`${i + 1}: ${lines[i]}`);
  }
}
