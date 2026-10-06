"use client";

import React, { useEffect, useState } from "react";
import { Bell, Plus, Trash2, Loader2, Megaphone, Calendar } from "lucide-react";
import { toast } from "react-toastify";

export default function NoticesManagementPage() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [noticeToDelete, setNoticeToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    message: "",
  });

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/notices`);
      if (res.ok) {
        const data = await res.json();
        setNotices(data);
      }
    } catch (error) {
      toast.error("Failed to fetch notices.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddNotice = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.message) {
      toast.warning("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/notices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Notice published successfully!");
        setFormData({ title: "", message: "" });
        fetchNotices();
      } else {
        toast.error("Failed to publish notice.");
      }
    } catch (error) {
      toast.error("An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!noticeToDelete) return;
    setIsDeleting(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/notices/${noticeToDelete._id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Notice deleted.");
        setNotices(notices.filter(n => n._id !== noticeToDelete._id));
      } else {
        toast.error("Failed to delete notice.");
      }
    } catch (error) {
      toast.error("Error deleting notice.");
    } finally {
      setIsDeleting(false);
      setNoticeToDelete(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-amber-500" />
            Notice Board
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-1">
            Publish announcements and rules for all mess members.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Create Notice Form */}
        <div className="lg:col-span-1 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm sticky top-6">
          <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2">
            <Plus className="w-5 h-5 text-amber-500" />
            Publish Notice
          </h3>
          
          <form onSubmit={handleAddNotice} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Title</label>
              <input 
                type="text" 
                name="title"
                placeholder="e.g., Monthly Meeting"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Message</label>
              <textarea 
                name="message"
                placeholder="Write your announcement here..."
                required
                rows="5"
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all text-sm resize-none"
              />
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-sm transition-all flex justify-center items-center gap-2"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Megaphone className="w-5 h-5" />}
              {isSubmitting ? "Publishing..." : "Publish Notice"}
            </button>
          </form>
        </div>

        {/* Notices List */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-16 text-center shadow-sm">
              <Loader2 className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
              <p className="text-zinc-500 mt-3 text-sm">Loading notices...</p>
            </div>
          ) : notices.length === 0 ? (
            <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-16 text-center shadow-sm">
              <Bell className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">No active notices</h3>
              <p className="text-zinc-500 mt-1 text-sm">Publish a notice to notify mess members.</p>
            </div>
          ) : (
            notices.map((notice) => (
              <div key={notice._id} className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm relative group overflow-hidden hover:shadow-md transition-all">
                <div className="absolute top-0 left-0 w-1 h-full bg-amber-500 rounded-l-3xl" />
                
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{notice.title}</h3>
                    <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-2 mb-4">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(notice.createdAt).toLocaleDateString('en-US', { 
                        weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </div>
                    <p className="text-zinc-700 dark:text-zinc-300 text-sm whitespace-pre-wrap leading-relaxed">
                      {notice.message}
                    </p>
                  </div>

                  <button
                    onClick={() => setNoticeToDelete(notice)}
                    className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors shrink-0"
                    title="Delete notice"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {noticeToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200 p-6 text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">Delete Notice?</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
              Are you sure you want to delete <strong className="text-zinc-700 dark:text-zinc-300">"{noticeToDelete.title}"</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setNoticeToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-xl shadow-sm transition-colors disabled:opacity-70 flex items-center gap-2"
              >
                {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
