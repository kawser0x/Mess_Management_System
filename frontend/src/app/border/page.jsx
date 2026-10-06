"use client";

import React, { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Utensils, PieChart, IndianRupee, Bell, Loader2, Calendar } from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";

export default function BorderPage() {
  const { data: session, isPending } = authClient.useSession();
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    myMeals: 0,
    totalMessMeals: 0,
    totalExpenses: 0,
    mealRate: 0,
    myMealCost: 0,
  });
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    if (!session?.user) return;
    fetchDashboardData();
  }, [session]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      
      const [mealsRes, financesRes, noticesRes] = await Promise.all([
        fetch(`${apiUrl}/api/meals`),
        fetch(`${apiUrl}/api/finances`),
        fetch(`${apiUrl}/api/notices`),
      ]);

      const meals = mealsRes.ok ? await mealsRes.json() : [];
      const finances = financesRes.ok ? await financesRes.json() : [];
      const noticesData = noticesRes.ok ? await noticesRes.json() : [];

      setNotices(noticesData.slice(0, 3)); // Top 3 latest notices

      // Calculate Meals
      let totalMessMeals = 0;
      let myMeals = 0;

      meals.forEach(day => {
        if (day.records && Array.isArray(day.records)) {
          day.records.forEach(r => {
            const sum = (parseFloat(r.breakfast) || 0) + (parseFloat(r.lunch) || 0) + (parseFloat(r.dinner) || 0);
            totalMessMeals += sum;
            if (r.memberId === session.user.id) {
              myMeals += sum;
            }
          });
        }
      });

      // Calculate Finances
      const totalExpenses = finances
        .filter(f => f.type === "expense" || !f.type)
        .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

      // Meal Rate
      const mealRate = totalMessMeals > 0 ? (totalExpenses / totalMessMeals) : 0;
      const myMealCost = myMeals * mealRate;

      setStats({
        myMeals,
        totalMessMeals,
        totalExpenses,
        mealRate,
        myMealCost,
      });

    } catch (error) {
      toast.error("Failed to load dashboard data.");
    } finally {
      setLoading(false);
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 dark:from-zinc-900 dark:to-black rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500 rounded-full opacity-20 blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 right-32 w-48 h-48 bg-orange-500 rounded-full opacity-20 blur-3xl -mb-10"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border-2 border-white/20 flex items-center justify-center text-3xl font-bold shadow-lg overflow-hidden">
              {session?.user?.image ? (
                <img src={session.user.image} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                session?.user?.name?.charAt(0).toUpperCase() || "U"
              )}
            </div>
            <div>
              <p className="text-amber-400 font-medium tracking-wide uppercase text-sm mb-1">Welcome back,</p>
              <h1 className="text-3xl sm:text-4xl font-bold">{session?.user?.name}</h1>
              <p className="text-zinc-400 text-sm mt-1 flex items-center gap-2">
                Room No: <strong className="text-white bg-white/10 px-2 py-0.5 rounded">{session?.user?.roomNo || "N/A"}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/70 dark:bg-zinc-900/40 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-500/10 text-blue-500 rounded-2xl group-hover:scale-110 transition-transform">
              <Utensils className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">My Total Meals</p>
          <h3 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">{stats.myMeals.toFixed(1)}</h3>
        </div>

        <div className="bg-white/70 dark:bg-zinc-900/40 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-amber-50 dark:bg-amber-500/10 text-amber-500 rounded-2xl group-hover:scale-110 transition-transform">
              <PieChart className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Current Meal Rate</p>
          <h3 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">৳{stats.mealRate.toFixed(2)}</h3>
        </div>

        <div className="bg-white/70 dark:bg-zinc-900/40 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-2xl group-hover:scale-110 transition-transform">
              <IndianRupee className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Mess Expense</p>
          <h3 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">৳{stats.totalExpenses.toLocaleString()}</h3>
        </div>

        <div className="bg-gradient-to-br from-amber-400 to-amber-600 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-20 rounded-full blur-2xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500" />
          <div className="relative z-10 flex justify-between items-start mb-4">
            <div className="p-3 bg-white/20 rounded-2xl">
              <IndianRupee className="w-6 h-6" />
            </div>
          </div>
          <div className="relative z-10">
            <p className="text-sm font-medium text-amber-100">My Total Cost (Est.)</p>
            <h3 className="text-3xl font-bold mt-1">৳{stats.myMealCost.toFixed(2)}</h3>
          </div>
        </div>
      </div>

      {/* Notices Section */}
      <div className="bg-white/70 dark:bg-zinc-900/40 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-500" />
            Recent Notices
          </h2>
          <Link href="/border/notices" className="text-sm font-medium text-amber-500 hover:text-amber-600 transition-colors">
            View All
          </Link>
        </div>

        <div className="space-y-4">
          {notices.length === 0 ? (
            <div className="text-center p-8 text-zinc-500 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl">
              No recent notices from the manager.
            </div>
          ) : (
            notices.map((notice) => (
              <div key={notice._id} className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800/50 hover:border-amber-500/30 transition-all">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="font-bold text-zinc-900 dark:text-zinc-100">{notice.title}</h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 whitespace-pre-wrap line-clamp-2">
                      {notice.message}
                    </p>
                  </div>
                  <div className="shrink-0 flex items-center gap-1.5 text-xs font-medium text-zinc-500 bg-white dark:bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(notice.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}