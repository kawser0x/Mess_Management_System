"use client";

import React, { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { User, Mail, Phone, Home, Calendar, Camera, Loader2, Save } from "lucide-react";
import { toast } from "react-toastify";
import { format } from "date-fns";

export default function BorderProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: "",
    phone: "",
    roomNo: "",
    email: "",
    image: "",
    createdAt: null
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (session?.user) {
      setProfileData({
        name: session.user.name || "",
        phone: session.user.phone || "",
        roomNo: session.user.roomNo || "",
        email: session.user.email || "",
        image: session.user.image || "",
        createdAt: session.user.createdAt || new Date()
      });
      setImagePreview(session.user.image || null);
      setLoading(false);
    }
  }, [session]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size must be less than 2MB");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadToImgBB = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    // We assume NEXT_PUBLIC_IMGBB_API_KEY is available in .env
    const imgbbKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY || "fb3cf5b47a95786438dc20f18bd4d567"; // Fallback key or empty
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
      method: 'POST',
      body: formData,
    });
    
    const data = await res.json();
    if (data.success) {
      return data.data.url;
    }
    throw new Error("Failed to upload image");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profileData.name) {
      toast.error("Name is required");
      return;
    }

    setSaving(true);
    try {
      let finalImageUrl = profileData.image;

      if (imageFile) {
        toast.info("Uploading image...");
        finalImageUrl = await uploadToImgBB(imageFile);
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      
      const payload = {
        name: profileData.name,
        phone: profileData.phone,
        image: finalImageUrl
      };

      const res = await fetch(`${apiUrl}/api/users/${session.user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("Profile updated successfully!");
        setProfileData(prev => ({ ...prev, image: finalImageUrl }));
        // Note: Better-auth session might not instantly update without a reload or explicit session refresh
        // You can reload or leave it to next session fetch.
      } else {
        toast.error("Failed to update profile.");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "An error occurred.");
    } finally {
      setSaving(false);
    }
  };

  if (isPending || loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/70 dark:bg-zinc-900/40 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500 rounded-full opacity-5 blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
        <div className="relative z-10">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <User className="w-6 h-6 text-amber-500" />
            My Profile
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Manage your personal information and preferences.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Avatar & Basic Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white/70 dark:bg-zinc-900/40 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex flex-col items-center text-center">
            
            <div className="relative group mb-4">
              <div className="w-32 h-32 rounded-full border-4 border-white dark:border-zinc-800 shadow-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                {imagePreview ? (
                  <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-zinc-400" />
                )}
              </div>
              
              <label className="absolute bottom-0 right-0 p-2 bg-amber-500 text-white rounded-full shadow-lg cursor-pointer hover:bg-amber-600 transition-colors transform group-hover:scale-110">
                <Camera className="w-4 h-4" />
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </label>
            </div>

            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{profileData.name}</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium mt-1 uppercase tracking-wider">Member</p>
            
            <div className="mt-6 w-full space-y-3">
              <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800/80">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="truncate">{profileData.email}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-zinc-600 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800/80">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Joined</span>
                </div>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">
                  {profileData.createdAt ? format(new Date(profileData.createdAt), 'MMM yyyy') : 'N/A'}
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Edit Form */}
        <div className="lg:col-span-2">
          <div className="bg-white/70 dark:bg-zinc-900/40 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-6">Edit Information</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-zinc-400" />
                    </div>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none text-zinc-900 dark:text-zinc-100 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Phone Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-4 w-4 text-zinc-400" />
                    </div>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none text-zinc-900 dark:text-zinc-100 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all font-medium"
                      placeholder="e.g. 01XXXXXXXXX"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Room Number <span className="text-xs font-normal text-zinc-500">(Contact manager to change)</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Home className="h-4 w-4 text-zinc-400" />
                  </div>
                  <input
                    type="text"
                    value={profileData.roomNo}
                    readOnly
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none text-zinc-500 dark:text-zinc-500 cursor-not-allowed font-medium"
                  />
                </div>
              </div>
              
              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-sm transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  Save Changes
                </button>
              </div>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
