"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HelpCircle, Menu, X } from "lucide-react";

export interface HeaderProps {
  papersCount?: number;
  coursesCount?: number;
  showStats?: boolean;
  onOpenHelp?: () => void;
}

export function Header({
  papersCount = 0,
  coursesCount = 0,
  showStats = true,
  onOpenHelp,
}: HeaderProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isLinkActive = (href: string) => {
    return pathname === href;
  };

  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-950 flex items-center justify-between px-4 sm:px-6 shrink-0 z-30 select-none relative">
      {/* Left Side: Logo & Brand */}
      <Link href="/" className="flex items-center gap-2 sm:gap-3.5 group/logo-link">
        <div className="relative group/logo flex items-center justify-center shrink-0">
          {/* Animated yellow glow rings */}
          <div className="absolute inset-0 rounded-full border border-yellow-400/20 scale-120 group-hover/logo-link:scale-135 group-hover/logo-link:border-yellow-400/50 group-hover/logo-link:rotate-180 transition-all duration-700 ease-out pointer-events-none" />
          <div className="absolute inset-0 rounded-full border border-dashed border-amber-400/40 scale-110 group-hover/logo-link:scale-120 group-hover/logo-link:border-amber-400 group-hover/logo-link:rotate-90 transition-all duration-500 ease-out pointer-events-none" />
          
          {/* Logo container with yellow ring */}
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-900 border-2 border-yellow-400/80 flex items-center justify-center overflow-hidden p-1 shadow-md shadow-yellow-500/10 group-hover/logo-link:border-yellow-400 group-hover/logo-link:shadow-yellow-500/30 transition-all duration-300">
            <img 
              src="/logo-mark.png" 
              alt="GenAI Academy & Hub Logo" 
              className="w-full h-full object-contain group-hover/logo-link:scale-110 transition-transform duration-300" 
            />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] sm:text-sm font-extrabold tracking-wider bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            GENAI ACADEMY & HUB
          </span>
          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-none hidden sm:block">
            AI-Powered Research Workspace
          </span>
        </div>
      </Link>

      {/* Middle Side: Navigation Links */}
      <div className="hidden md:flex items-center text-sm text-slate-400">
        <nav className="flex items-center gap-6 font-semibold">
          <Link
            href="/"
            className={`transition-colors hover:text-foreground relative py-1 ${
              isLinkActive("/") 
                ? "text-slate-100 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-violet-400 after:to-cyan-400" 
                : ""
            }`}
          >
            Home
          </Link>
          <Link
            href="/articles"
            className={`transition-colors hover:text-foreground relative py-1 ${
              isLinkActive("/articles") 
                ? "text-slate-100 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-violet-400 after:to-cyan-400" 
                : ""
            }`}
          >
            AI Articles
          </Link>
          <Link
            href="/about"
            className={`transition-colors hover:text-foreground relative py-1 ${
              isLinkActive("/about") 
                ? "text-slate-100 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-violet-400 after:to-cyan-400" 
                : ""
            }`}
          >
            About
          </Link>
          <Link
            href="/contact"
            className={`transition-colors hover:text-foreground relative py-1 ${
              isLinkActive("/contact") 
                ? "text-slate-100 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-violet-400 after:to-cyan-400" 
                : ""
            }`}
          >
            Contact
          </Link>
        </nav>
      </div>

      {/* Right Side: Help and Mobile Nav Toggle */}
      <div className="flex items-center gap-2">
        {onOpenHelp && (
          <button
            onClick={onOpenHelp}
            className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 flex items-center justify-center border border-slate-800 transition-colors cursor-pointer shrink-0"
            title="Quick User Guide"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        )}

        {/* Hamburger Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 flex items-center justify-center border border-slate-800 transition-colors cursor-pointer shrink-0 relative z-50"
          title="Toggle Navigation Menu"
        >
          {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu Drawer */}
      {isMenuOpen && (
        <>
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden" 
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="absolute top-16 left-0 right-0 bg-slate-950/95 border-b border-slate-800/85 p-5 z-40 md:hidden flex flex-col gap-4 shadow-2xl animate-in slide-in-from-top-3 duration-200 backdrop-blur-md">
            <nav className="flex flex-col gap-3.5">
              <Link 
                href="/" 
                onClick={() => setIsMenuOpen(false)}
                className={`text-sm font-semibold py-2 px-3 rounded-lg transition-colors hover:bg-slate-900 ${
                  isLinkActive("/") ? "text-slate-100 bg-slate-900/50" : "text-slate-400 hover:text-foreground"
                }`}
              >
                Home
              </Link>
              <Link 
                href="/articles" 
                onClick={() => setIsMenuOpen(false)}
                className={`text-sm font-semibold py-2 px-3 rounded-lg transition-colors hover:bg-slate-900 ${
                  isLinkActive("/articles") ? "text-slate-100 bg-slate-900/50" : "text-slate-400 hover:text-foreground"
                }`}
              >
                AI Articles
              </Link>
              <Link 
                href="/about" 
                onClick={() => setIsMenuOpen(false)}
                className={`text-sm font-semibold py-2 px-3 rounded-lg transition-colors hover:bg-slate-900 ${
                  isLinkActive("/about") ? "text-slate-100 bg-slate-900/50" : "text-slate-400 hover:text-foreground"
                }`}
              >
                About
              </Link>
              <Link 
                href="/contact" 
                onClick={() => setIsMenuOpen(false)}
                className={`text-sm font-semibold py-2 px-3 rounded-lg transition-colors hover:bg-slate-900 ${
                  isLinkActive("/contact") ? "text-slate-100 bg-slate-900/50" : "text-slate-400 hover:text-foreground"
                }`}
              >
                Contact
              </Link>
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
