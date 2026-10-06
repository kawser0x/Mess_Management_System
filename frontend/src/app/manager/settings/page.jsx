"use client";

import React, { useEffect, useState } from "react";
import { Settings, User, Phone, Mail, Shield, Save, Loader2, LogOut, Camera } from "lucide-react";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    image: "",
  });

  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        phone: session.user.phone || "",
        image: session.user.image || "",
      });
    }
  }, [session]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageUploading(true);
    const form = new FormData();
    form.append("image", file);

    try {
      const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
      if (!apiKey) {
        toast.error("ImgBB API key is missing. Please add NEXT_PUBLIC_IMGBB_API_KEY to frontend/.env");
        return;
      }

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: form,
      });

      const data = await res.json();
      if (data.success) {
        setFormData(prev => ({ ...prev, image: data.data.url }));
        toast.success("Image uploaded! Don't forget to click Save Changes.");
      } else {
        toast.error("Failed to upload image to ImgBB.");
      }
    } catch (error) {
      toast.error("Error uploading image.");
    } finally {
      setImageUploading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!session?.user?.id) return;
    
    setIsSaving(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      // Update backend profile
      const res = await fetch(`${apiUrl}/api/users/${session.user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        // We also need to update the Better Auth session user profile if possible, 
        // but for now updating our DB is sufficient for our app's logic.
        // authClient.updateUser({ name: formData.name }) is supported by better-auth.
        try {
           await authClient.updateUser({
             name: formData.name,
             image: formData.image,
           });
        } catch (err) {
           console.log("better-auth update non-critical error", err);
        }

        toast.success("Profile updated successfully!");
      } else {
        toast.error("Failed to update profile.");
      }
    } catch (error) {
      toast.error("An error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authClient.signOut();
      router.push("/login");
    } catch (error) {
      toast.error("Failed to sign out.");
      setIsLoggingOut(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Settings className="w-6 h-6 text-amber-500" />
            Account Settings
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-1">
            Manage your personal profile and mess preferences.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Settings Navigation Sidebar */}
        <div className="md:col-span-1 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-amber-500/10 to-transparent text-amber-600 dark:text-amber-500 border-l-2 border-amber-500 rounded-r-2xl font-semibold transition-all">
            <User className="w-5 h-5" />
            Profile Settings
          </button>
          <button 
            disabled 
            className="w-full flex items-center gap-3 px-4 py-3 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 rounded-2xl font-medium transition-all opacity-50 cursor-not-allowed border-l-2 border-transparent"
            title="Coming soon"
          >
            <Shield className="w-5 h-5" />
            Security & Password
          </button>
          
          <div className="pt-4 mt-4 border-t border-zinc-200 dark:border-zinc-800">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl font-semibold transition-all border-l-2 border-transparent"
            >
              {isLoggingOut ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogOut className="w-5 h-5" />}
              {isLoggingOut ? "Signing out..." : "Sign Out"}
            </button>
          </div>
        </div>

        {/* Profile Settings Form */}
        <div className="md:col-span-2">
          <div className="bg-white/70 dark:bg-zinc-900/40 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">Personal Information</h2>
            
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="flex items-center gap-6 mb-8">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-4xl font-bold shadow-xl overflow-hidden ring-4 ring-white dark:ring-zinc-900">
                    {formData.image ? (
                      <img src={formData.image} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      formData.name?.charAt(0).toUpperCase() || "?"
                    )}
                  </div>
                  <label className="absolute inset-0 bg-black/50 text-white rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    {imageUploading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <>
                        <Camera className="w-6 h-6 mb-1" />
                        <span className="text-[10px] font-medium">Upload</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={imageUploading} />
                      </>
                    )}
                  </label>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{session?.user?.name || "Manager"}</h3>
                  <p className="text-amber-600 dark:text-amber-500 text-sm font-medium uppercase tracking-wider">{session?.user?.role || "Manager"}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                    <User className="w-4 h-4 text-zinc-400" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 bg-transparent border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all text-sm text-zinc-900 dark:text-zinc-100 hover:border-zinc-400 dark:hover:border-zinc-600"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-zinc-400" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-transparent border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all text-sm text-zinc-900 dark:text-zinc-100 hover:border-zinc-400 dark:hover:border-zinc-600"
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-zinc-400" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={session?.user?.email || ""}
                    disabled
                    className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none text-sm text-zinc-500 dark:text-zinc-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-zinc-500">Email address cannot be changed.</p>
                </div>
              </div>

              <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-sm transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  {isSaving ? "Saving Changes..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
