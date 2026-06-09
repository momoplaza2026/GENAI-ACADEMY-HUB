import fs from 'fs';

const filePath = 'c:/Users/USER/OneDrive/Desktop/Ai_journal/my-genai-hub/apps/web/src/components/document-viewer.tsx';
const buf = fs.readFileSync(filePath);

try {
  const decoder = new TextDecoder('utf-8', { fatal: true });
  decoder.decode(buf);
  console.log('Verification Success: TextDecoder with fatal:true succeeded! The file is now valid UTF-8.');
} catch (e) {
  console.error('Verification Failure: TextDecoder failed:', e.message);
}
