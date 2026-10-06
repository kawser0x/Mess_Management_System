import React from "react";
import { Loader2 } from "lucide-react";

export default function Spinner({ className = "w-8 h-8 text-amber-500", fullScreen = false }) {
  const spinnerElement = (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader2 className={`animate-spin ${className}`} />
      <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400 animate-pulse">
        Loading...
      </span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-4rem)] bg-zinc-50/50 dark:bg-zinc-950/50 backdrop-blur-sm z-50">
        {spinnerElement}
      </div>
    );
  }

  return spinnerElement;
}
