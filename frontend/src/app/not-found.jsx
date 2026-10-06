"use client";

import Link from "next/link";
import { Button } from "@heroui/react";
import { Home, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4 text-center bg-zinc-50 dark:bg-zinc-950 relative overflow-hidden">
      
      {/* Background decorations */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />
      
      {/* 404 Card */}
      <div className="relative z-10 flex flex-col items-center p-8 sm:p-12 max-w-lg bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-2xl rounded-3xl">
        <div className="p-4 bg-amber-500/10 dark:bg-amber-500/20 rounded-full mb-6">
          <Compass className="w-16 h-16 text-amber-500 animate-[spin_10s_linear_infinite]" />
        </div>
        
        <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-amber-400 to-amber-600 mb-2">
          404
        </h1>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
          Page Not Found
        </h2>
        
        <p className="text-zinc-600 dark:text-zinc-400 mb-8 max-w-sm text-sm sm:text-base leading-relaxed">
          Oops! It looks like you&apos;ve wandered off the map. The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <Link href="/">
          <Button 
            className="bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/30 transition-transform hover:scale-105 px-8 py-6 rounded-xl font-semibold flex items-center gap-2"
          >
            <Home className="w-5 h-5" />
            <span>Return Home</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
