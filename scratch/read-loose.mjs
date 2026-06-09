import fs from 'fs';

const filePath = 'c:/Users/USER/OneDrive/Desktop/Ai_journal/my-genai-hub/apps/web/src/components/document-viewer.tsx';
const buf = fs.readFileSync(filePath);

// Let's decode with a non-fatal TextDecoder to get a string
const decoder = new TextDecoder('utf-8', { fatal: false });
const decodedStr = decoder.decode(buf);

// Find where the replacement characters are
const searchChar = '\uFFFD';
let idx = decodedStr.indexOf(searchChar);
while (idx !== -1) {
  console.log(`\nFound replacement character at string index ${idx}`);
  
  // Print some lines before and after
  const start = Math.max(0, idx - 200);
  const end = Math.min(decodedStr.length, idx + 200);
  console.log('--- Context ---');
  console.log(decodedStr.slice(start, end));
  console.log('---------------');
  
  idx = decodedStr.indexOf(searchChar, idx + 1);
}
