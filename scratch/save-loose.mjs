import fs from 'fs';

const filePath = 'c:/Users/USER/OneDrive/Desktop/Ai_journal/my-genai-hub/apps/web/src/components/document-viewer.tsx';
const buf = fs.readFileSync(filePath);

const decoder = new TextDecoder('utf-8', { fatal: false });
const decodedStr = decoder.decode(buf);

fs.writeFileSync('c:/Users/USER/OneDrive/Desktop/Ai_journal/my-genai-hub/scratch/document-viewer-loose.tsx', decodedStr, 'utf-8');
console.log('Saved loose version of file successfully.');
