"use client";

export function Footer() {
  return (
    <footer className="hidden md:flex h-12 border-t border-slate-800 bg-slate-950 items-center justify-between px-8 shrink-0 z-20 text-[11px] text-slate-500 select-none font-sans">
      <div className="flex items-center gap-1">
        <span>© 2026 GenAI Academy & Hub.</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-slate-400 font-medium">Gateway: Connected</span>
        </div>
        <div className="w-px h-3 bg-slate-800" />
        <span className="hover:text-slate-400 transition-colors">v1.2.0</span>
      </div>
    </footer>
  );
}
