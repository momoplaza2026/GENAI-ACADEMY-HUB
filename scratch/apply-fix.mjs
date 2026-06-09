import fs from 'fs';

const filePath = 'c:/Users/USER/OneDrive/Desktop/Ai_journal/my-genai-hub/apps/web/src/components/document-viewer.tsx';
const buf = fs.readFileSync(filePath);

// Loose decode to UTF-8 string
const decoder = new TextDecoder('utf-8', { fatal: false });
const text = decoder.decode(buf);

const lines = text.split('\n');

// We want to replace lines from 186 to 271 (0-based: 185 to 270)
// Let's verify line contents first to be absolutely sure we're replacing the correct block.
console.log('Line 186 (index 185):', lines[185]);
console.log('Line 187 (index 186):', lines[186]);
console.log('Line 271 (index 270):', lines[270]);
console.log('Line 272 (index 271):', lines[271]);

const correctedBlock = `  if (!doc) {
    return (
      <div 
        className="flex-1 flex flex-col items-center justify-start p-8 pt-8 sm:pt-12 bg-cover bg-center bg-no-repeat overflow-y-auto relative"
        style={{ backgroundImage: "url('/indian-flag-bg.png')" }}
      >
        {/* Dark overlay for premium readability */}
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[1.5px] pointer-events-none" />

        <div className="max-w-2xl w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative z-10">
          
          <div className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-4">
              <div className="relative group/logo flex items-center justify-center shrink-0">
                {/* Animated yellow glow rings */}
                <div className="absolute -inset-2 rounded-full border border-yellow-400/20 scale-115 group-hover/logo:scale-130 group-hover/logo:border-yellow-400/50 group-hover/logo:rotate-180 transition-all duration-700 ease-out pointer-events-none" />
                <div className="absolute -inset-1 rounded-full border border-dashed border-amber-400/40 scale-105 group-hover/logo:scale-115 group-hover/logo:border-amber-400 group-hover/logo:rotate-90 transition-all duration-500 ease-out pointer-events-none" />
                
                {/* Logo container with yellow ring */}
                <div className="w-16 h-16 rounded-full bg-slate-900/95 border-2 border-yellow-400/80 flex items-center justify-center overflow-hidden p-2 shadow-lg shadow-yellow-500/10 group-hover/logo:border-yellow-400 group-hover/logo:shadow-yellow-500/30 transition-all duration-300">
                  <img 
                    src="/logo-mark.png" 
                    alt="GenAI Academy & Hub Logo" 
                    className="w-full h-full object-contain group-hover/logo:scale-110 transition-transform duration-300" 
                  />
                </div>
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] text-center sm:text-left">
                Welcome to GenAI Academy & Hub
              </h2>
            </div>
            <p className="text-slate-200 text-lg max-w-xl mx-auto drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
              Your AI-powered research and learning assistant. Get started with these features:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            {/* Guide Cards */}
            <div className="p-5 rounded-2xl bg-slate-950/85 border border-indigo-500/30 hover:border-indigo-400/60 shadow-xl transition-all duration-300 group/card">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center mb-4 transition-transform group-hover/card:scale-110">
                <BookOpen className="w-5 h-5 text-indigo-400" />
              </div>
              <h3 className="font-bold text-indigo-300 mb-2 text-base">1. Explore Research</h3>
              <p className="text-sm text-slate-300 leading-relaxed font-normal">
                Scroll through the left sidebar to discover the latest AI/ML papers from Arxiv. Click any paper to read the PDF.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/85 border border-purple-500/30 hover:border-purple-400/60 shadow-xl transition-all duration-300 group/card">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4 transition-transform group-hover/card:scale-110">
                <Presentation className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="font-bold text-purple-300 mb-2 text-base">2. Watch PPTs</h3>
              <p className="text-sm text-slate-300 leading-relaxed font-normal">
                Click the <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold mx-1"><Presentation className="w-3 h-3"/> Watch PPT</span> button in the top bar to view a beautiful animated presentation of any paper.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/85 border border-emerald-500/30 hover:border-emerald-400/60 shadow-xl transition-all duration-300 group/card">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center mb-4 transition-transform group-hover/card:scale-110">
                <Volume2 className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="font-bold text-emerald-300 mb-2 text-base">3. AI Audio Reader</h3>
              <p className="text-sm text-slate-300 leading-relaxed font-normal">
                Highlight text in the PDF, press Ctrl+C, then click <span className="text-emerald-400 font-medium">Read Copied Text</span> to hear an AI read and explain it to you.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/85 border border-orange-500/30 hover:border-orange-400/60 shadow-xl transition-all duration-300 group/card">
              <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center mb-4 transition-transform group-hover/card:scale-110">
                <ArrowLeftRight className="w-5 h-5 text-orange-400" />
              </div>
              <h3 className="font-bold text-orange-300 mb-2 text-base">4. Compare Papers</h3>
              <p className="text-sm text-slate-300 leading-relaxed font-normal">
                Toggle <span className="text-orange-400 font-medium">Compare Mode</span> to view two papers side-by-side with synchronized scrolling and generate AI comparison reports.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }`;

// Replace lines 186 to 271 (indices 185 to 270) with our corrected block
lines.splice(185, 270 - 185 + 1, correctedBlock);

const updatedText = lines.join('\n');

// Write back to document-viewer.tsx in UTF-8
fs.writeFileSync(filePath, updatedText, 'utf-8');
console.log('Successfully updated document-viewer.tsx with the clean, corrected UTF-8 content!');
