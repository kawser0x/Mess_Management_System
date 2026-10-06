"use client";

import React, { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Utensils, Loader2, Calendar } from "lucide-react";
import { toast } from "react-toastify";

export default function MyMealsPage() {
  const { data: session, isPending } = authClient.useSession();
  
  const [loading, setLoading] = useState(true);
  const [myMealsLog, setMyMealsLog] = useState([]);
  const [totalMyMeals, setTotalMyMeals] = useState(0);
  const [mealDefaults, setMealDefaults] = useState({
    breakfast: { active: true, count: 1 },
    lunch: { active: true, count: 1 },
    dinner: { active: true, count: 1 }
  });
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    if (!session?.user) return;
    fetchMeals();
  }, [session]);

  const fetchMeals = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const [mealsRes, usersRes] = await Promise.all([
        fetch(`${apiUrl}/api/meals`),
        fetch(`${apiUrl}/api/users`)
      ]);

      if (usersRes.ok) {
        const users = await usersRes.json();
        const me = users.find(u => u._id === session.user.id);
        if (me) {
          setMealDefaults(me.mealDefaults || {
            breakfast: { active: true, count: 1 },
            lunch: { active: true, count: 1 },
            dinner: { active: true, count: 1 }
          });
        }
      }

      if (mealsRes.ok) {
        const allDays = await mealsRes.json();
        
        // Process data to only extract this member's meals
        const myLog = [];
        let totalCount = 0;

        allDays.forEach(day => {
          if (day.records && Array.isArray(day.records)) {
            const myRecord = day.records.find(r => r.memberId === session.user.id);
            if (myRecord) {
              const breakfast = parseFloat(myRecord.breakfast) || 0;
              const lunch = parseFloat(myRecord.lunch) || 0;
              const dinner = parseFloat(myRecord.dinner) || 0;
              const dayTotal = breakfast + lunch + dinner;
              
              if (dayTotal > 0) {
                totalCount += dayTotal;
                myLog.push({
                  date: day.date,
                  breakfast,
                  lunch,
                  dinner,
                  dayTotal,
                  mealId: day._id
                });
              }
            }
          }
        });

        // Sort by date (newest first)
        myLog.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        setMyMealsLog(myLog);
        setTotalMyMeals(totalCount);
      } else {
        toast.error("Failed to load meal history.");
      }
    } catch (error) {
      toast.error("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const updateMealDefault = async (mealType, field, value) => {
    setIsUpdatingStatus(true);
    
    const newDefaults = {
      ...mealDefaults,
      [mealType]: {
        ...mealDefaults[mealType],
        [field]: value
      }
    };

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/users/${session.user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mealDefaults: newDefaults }),
      });

      if (res.ok) {
        setMealDefaults(newDefaults);
        if (field === 'active') {
          toast.success(`${mealType.charAt(0).toUpperCase() + mealType.slice(1)} is now ${value ? 'ON' : 'OFF'}`);
        } else {
          toast.success(`${mealType.charAt(0).toUpperCase() + mealType.slice(1)} count updated to ${value}`);
        }
      } else {
        toast.error(`Failed to update ${mealType} settings.`);
      }
    } catch (error) {
      toast.error("An error occurred.");
    } finally {
      setIsUpdatingStatus(false);
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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      
      {/* Header Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Utensils className="w-6 h-6 text-amber-500" />
              My Meal History
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-1">
              Track your daily meal consumption managed by the mess manager.
            </p>
          </div>
          
          <div className="bg-amber-50 dark:bg-amber-500/10 px-6 py-3 rounded-2xl border border-amber-100 dark:border-amber-900/30 flex items-center gap-3">
            <p className="text-sm font-medium text-amber-600 dark:text-amber-500">Total Meals Consumed:</p>
            <span className="text-2xl font-bold text-amber-700 dark:text-amber-400">{totalMyMeals.toFixed(1)}</span>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 p-5 md:p-6 rounded-3xl shadow-sm w-full relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500 rounded-full opacity-5 blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
          
          <div className="relative z-10 flex-shrink-0">
            <h2 className="text-base md:text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-500" />
              My Daily Meal Plan
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              These counts will auto-apply every day.
            </p>
          </div>

          <div className="flex flex-row items-center justify-start md:justify-end gap-5 sm:gap-8 relative z-10 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            {['breakfast', 'lunch', 'dinner'].map((meal) => (
              <div key={meal} className="flex flex-col items-center gap-2 min-w-[70px]">
                <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
                  {meal}
                </span>
                
                <div className="flex items-center gap-2 bg-zinc-950/50 p-1.5 rounded-xl border border-zinc-800/80 shadow-inner">
                  <button
                    onClick={() => updateMealDefault(meal, 'active', !mealDefaults[meal].active)}
                    disabled={isUpdatingStatus}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${
                      mealDefaults[meal].active ? 'bg-amber-500' : 'bg-zinc-700'
                    } ${isUpdatingStatus ? 'opacity-50 cursor-not-allowed' : ''}`}
                    role="switch"
                    aria-checked={mealDefaults[meal].active}
                  >
                    <span className="sr-only">Toggle {meal}</span>
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        mealDefaults[meal].active ? 'translate-x-2' : '-translate-x-2'
                      }`}
                    />
                  </button>

                  {mealDefaults[meal].active ? (
                    <input 
                      type="number" 
                      step="0.5" 
                      min="0.5" 
                      value={mealDefaults[meal].count} 
                      onChange={(e) => updateMealDefault(meal, 'count', parseFloat(e.target.value) || 1)}
                      className="w-10 h-6 text-center bg-zinc-950 border border-zinc-700 rounded outline-none text-[11px] font-black text-amber-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all"
                    />
                  ) : (
                    <div className="w-10 h-6 flex items-center justify-center text-[10px] font-bold text-zinc-600 bg-zinc-950/50 rounded border border-zinc-800 cursor-not-allowed">
                      OFF
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Meals Table */}
      <div className="bg-white/70 dark:bg-zinc-900/40 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-center">Breakfast</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-center">Lunch</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-center">Dinner</th>
                <th className="px-6 py-4 text-xs font-bold text-amber-600 dark:text-amber-500 uppercase tracking-wider text-right">Daily Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {myMealsLog.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center">
                    <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Utensils className="w-8 h-8 text-zinc-400" />
                    </div>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">No Meals Found</h3>
                    <p className="text-zinc-500 mt-1 text-sm">You haven't been assigned any meals yet.</p>
                  </td>
                </tr>
              ) : (
                myMealsLog.map((log) => (
                  <tr key={log.mealId} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-zinc-400 group-hover:text-amber-500 transition-colors" />
                        <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                          {new Date(log.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center justify-center min-w-[2.5rem] px-2 py-1 rounded-lg text-sm font-bold ${log.breakfast > 0 ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100' : 'text-zinc-300 dark:text-zinc-600 font-normal'}`}>
                        {log.breakfast}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center justify-center min-w-[2.5rem] px-2 py-1 rounded-lg text-sm font-bold ${log.lunch > 0 ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100' : 'text-zinc-300 dark:text-zinc-600 font-normal'}`}>
                        {log.lunch}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center justify-center min-w-[2.5rem] px-2 py-1 rounded-lg text-sm font-bold ${log.dinner > 0 ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100' : 'text-zinc-300 dark:text-zinc-600 font-normal'}`}>
                        {log.dinner}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className="text-base font-black text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-500/10 px-3 py-1 rounded-lg">
                        {log.dayTotal.toFixed(1)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
