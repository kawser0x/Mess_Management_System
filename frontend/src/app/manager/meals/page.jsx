"use client";

import React, { useEffect, useState } from "react";
import { Utensils, Calendar, Save, Loader2, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "react-toastify";

export default function MealsManagementPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [members, setMembers] = useState([]);
  const [existingMealDoc, setExistingMealDoc] = useState(null);
  const [mealRecords, setMealRecords] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch present members and meals data
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        
        // 1. Fetch members
        const membersRes = await fetch(`${apiUrl}/api/members`);
        const membersData = membersRes.ok ? await membersRes.json() : [];
        const presentMembers = membersData.filter(m => !m.status || m.status === "present");
        setMembers(presentMembers);

        // 2. Fetch meals to see if today's record exists
        const mealsRes = await fetch(`${apiUrl}/api/meals`);
        const mealsData = mealsRes.ok ? await mealsRes.json() : [];
        
        const todaysMeal = mealsData.find(m => m.date === selectedDate);
        setExistingMealDoc(todaysMeal || null);

        // Initialize state
        const initialRecords = {};
        if (todaysMeal && todaysMeal.records) {
          // Pre-fill from existing
          todaysMeal.records.forEach(r => {
            initialRecords[r.memberId] = { breakfast: r.breakfast, lunch: r.lunch, dinner: r.dinner };
          });
        }
        
        // Ensure all present members have an entry
        presentMembers.forEach(m => {
          if (!initialRecords[m._id]) {
            initialRecords[m._id] = { breakfast: 0, lunch: 1, dinner: 1 }; // Default values
          }
        });

        setMealRecords(initialRecords);

      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("Error loading data.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [selectedDate]);

  const handleMealChange = (memberId, mealType, value) => {
    setMealRecords(prev => ({
      ...prev,
      [memberId]: {
        ...prev[memberId],
        [mealType]: value
      }
    }));
  };

  const changeDate = (days) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().split("T")[0]);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      
      const recordsArray = members.map(m => ({
        memberId: m._id,
        name: m.name,
        breakfast: parseFloat(mealRecords[m._id]?.breakfast) || 0,
        lunch: parseFloat(mealRecords[m._id]?.lunch) || 0,
        dinner: parseFloat(mealRecords[m._id]?.dinner) || 0,
      }));

      const payload = {
        date: selectedDate,
        records: recordsArray,
      };

      let res;
      if (existingMealDoc) {
        // Update
        res = await fetch(`${apiUrl}/api/meals/${existingMealDoc._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        // Create new
        res = await fetch(`${apiUrl}/api/meals`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        const result = await res.json();
        // Update existing meal doc if it was a POST
        if (!existingMealDoc && result.insertedId) {
          setExistingMealDoc({ _id: result.insertedId, ...payload });
        }
        toast.success(`Meals saved for ${new Date(selectedDate).toLocaleDateString()}`);
      } else {
        toast.error("Failed to save meals.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error saving meals.");
    } finally {
      setSaving(false);
    }
  };

  const totalBreakfast = Object.values(mealRecords).reduce((acc, curr) => acc + (parseFloat(curr.breakfast) || 0), 0);
  const totalLunch = Object.values(mealRecords).reduce((acc, curr) => acc + (parseFloat(curr.lunch) || 0), 0);
  const totalDinner = Object.values(mealRecords).reduce((acc, curr) => acc + (parseFloat(curr.dinner) || 0), 0);
  const grandTotal = totalBreakfast + totalLunch + totalDinner;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Utensils className="w-6 h-6 text-amber-500" />
            Meals Management
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-1">
            Update and track daily meal counts for all present members.
          </p>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-1.5 rounded-2xl shadow-sm">
          <button 
            onClick={() => changeDate(-1)}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors text-zinc-500"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 px-3 py-1 font-semibold text-zinc-800 dark:text-zinc-200 min-w-[140px] justify-center">
            <Calendar className="w-4 h-4 text-amber-500" />
            {new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>

          <button 
            onClick={() => changeDate(1)}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors text-zinc-500"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Main Table Area */}
        <div className="lg:col-span-3 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm overflow-hidden backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
                  <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Member Name</th>
                  <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-center">Breakfast</th>
                  <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-center">Lunch</th>
                  <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-center">Dinner</th>
                  <th className="px-6 py-4 text-xs font-semibold text-amber-500 uppercase tracking-wider text-center">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-16 text-center">
                      <Loader2 className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
                      <p className="text-zinc-500 mt-3 text-sm">Loading members and meals...</p>
                    </td>
                  </tr>
                ) : members.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-16 text-center text-zinc-500">
                      No present members found. Please add members first.
                    </td>
                  </tr>
                ) : (
                  members.map((member) => {
                    const bStr = mealRecords[member._id]?.breakfast;
                    const lStr = mealRecords[member._id]?.lunch;
                    const dStr = mealRecords[member._id]?.dinner;
                    
                    const b = parseFloat(bStr) || 0;
                    const l = parseFloat(lStr) || 0;
                    const d = parseFloat(dStr) || 0;
                    const total = b + l + d;
                    
                    return (
                      <tr key={member._id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-300 font-bold text-xs">
                              {member.name?.charAt(0).toUpperCase() || "?"}
                            </div>
                            <span className="font-medium text-zinc-900 dark:text-zinc-100">{member.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <input 
                            type="number" 
                            step="0.5" 
                            min="0"
                            value={bStr !== undefined ? bStr : 0}
                            onChange={(e) => handleMealChange(member._id, 'breakfast', e.target.value)}
                            className="w-16 px-2 py-1 text-center bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-zinc-900 dark:text-zinc-100 font-medium"
                          />
                        </td>
                        <td className="px-6 py-4 text-center">
                          <input 
                            type="number" 
                            step="0.5" 
                            min="0"
                            value={lStr !== undefined ? lStr : 0}
                            onChange={(e) => handleMealChange(member._id, 'lunch', e.target.value)}
                            className="w-16 px-2 py-1 text-center bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-zinc-900 dark:text-zinc-100 font-medium"
                          />
                        </td>
                        <td className="px-6 py-4 text-center">
                          <input 
                            type="number" 
                            step="0.5" 
                            min="0"
                            value={dStr !== undefined ? dStr : 0}
                            onChange={(e) => handleMealChange(member._id, 'dinner', e.target.value)}
                            className="w-16 px-2 py-1 text-center bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-zinc-900 dark:text-zinc-100 font-medium"
                          />
                        </td>
                        <td className="px-6 py-4 text-center font-bold text-amber-600 dark:text-amber-500">
                          {total}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar Summary Area */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500 opacity-5 dark:opacity-10 rounded-full blur-2xl -mr-10 -mt-10" />
            
            <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
              <Utensils className="w-5 h-5 text-amber-500" />
              Daily Summary
            </h3>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-500 dark:text-zinc-400">Total Breakfast</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">{totalBreakfast}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-500 dark:text-zinc-400">Total Lunch</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">{totalLunch}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-500 dark:text-zinc-400">Total Dinner</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">{totalDinner}</span>
              </div>
              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
                <span className="font-bold text-zinc-900 dark:text-zinc-100">Total Meals</span>
                <span className="text-2xl font-black text-amber-500">{grandTotal}</span>
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={loading || saving}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 group"
            >
              {saving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : existingMealDoc ? (
                <CheckCircle2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
              ) : (
                <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
              )}
              {saving ? "Saving..." : existingMealDoc ? "Update Meals" : "Save Meals"}
            </button>

            {existingMealDoc && (
              <p className="text-xs text-center text-emerald-600 dark:text-emerald-400 mt-3 font-medium">
                Meals for this date are already saved. You can update them above.
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
