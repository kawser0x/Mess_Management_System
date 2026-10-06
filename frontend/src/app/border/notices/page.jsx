"use client";

import React, { useEffect, useState } from "react";
import { Bell, Loader2, Calendar, FileText } from "lucide-react";
import { toast } from "react-toastify";
import { format } from "date-fns";

export default function BorderNoticesPage() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/notices`);
      
      if (res.ok) {
        const data = await res.json();
        // Sort by newest first
        setNotices(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      }
    } catch (error) {
      toast.error("Failed to load notices.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/70 dark:bg-zinc-900/40 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500 rounded-full opacity-5 blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
        <div className="relative z-10">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Bell className="w-6 h-6 text-amber-500" />
            Notice Board
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Stay updated with the latest announcements from the mess manager.
          </p>
        </div>
        <div className="bg-amber-50 dark:bg-amber-500/10 px-4 py-2 rounded-xl border border-amber-100 dark:border-amber-900/30 flex items-center gap-2 relative z-10">
          <FileText className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-bold text-amber-700 dark:text-amber-400">
            {notices.length} Notices
          </span>
        </div>
      </div>

      {/* Notices Feed */}
      <div className="space-y-4">
        {notices.length === 0 ? (
          <div className="bg-white/70 dark:bg-zinc-900/40 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-3xl p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
              <Bell className="w-8 h-8 text-zinc-400" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">No Announcements Yet</h3>
            <p className="text-zinc-500 mt-1 text-sm">When the manager posts a notice, it will appear here.</p>
          </div>
        ) : (
          notices.map((notice, index) => (
            <div 
              key={notice._id} 
              className={`bg-white/80 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm transition-all hover:shadow-md relative overflow-hidden group ${
                index === 0 ? 'border-amber-200 dark:border-amber-900/50' : ''
              }`}
            >
              {index === 0 && (
                <div className="absolute top-0 left-0 w-1 h-full bg-amber-500 rounded-l-3xl"></div>
              )}
              
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 pr-4">
                  {notice.title}
                  {index === 0 && (
                    <span className="ml-3 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50 align-middle">
                      New
                    </span>
                  )}
                </h2>
                
                <div className="shrink-0 flex items-center gap-1.5 text-xs font-bold text-zinc-500 bg-zinc-100 dark:bg-zinc-800/50 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800">
                  <Calendar className="w-3.5 h-3.5" />
                  {format(new Date(notice.createdAt), 'MMMM dd, yyyy - hh:mm a')}
                </div>
              </div>

              <div className="prose prose-zinc dark:prose-invert max-w-none">
                <p className="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {notice.message}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
