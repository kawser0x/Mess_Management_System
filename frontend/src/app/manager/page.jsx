"use client";

import React, { useEffect, useState } from "react";
import { Users, Utensils, Wallet, Bell, ArrowRight, Activity, TrendingUp, Clock } from "lucide-react";
import Link from "next/link";

export default function ManagerPage() {
  const [stats, setStats] = useState({
    members: 0,
    meals: 0,
    expenses: 0,
    notices: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardStats() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        
        // Fetch all data in parallel
        const [membersRes, mealsRes, financesRes, noticesRes] = await Promise.all([
          fetch(`${apiUrl}/api/members`).catch(() => null),
          fetch(`${apiUrl}/api/meals`).catch(() => null),
          fetch(`${apiUrl}/api/finances`).catch(() => null),
          fetch(`${apiUrl}/api/notices`).catch(() => null),
        ]);

        const members = membersRes?.ok ? await membersRes.json() : [];
        const meals = mealsRes?.ok ? await mealsRes.json() : [];
        const finances = financesRes?.ok ? await financesRes.json() : [];
        const notices = noticesRes?.ok ? await noticesRes.json() : [];

        // Calculate total meals
        let totalMealsCount = 0;
        meals.forEach(day => {
          if (day.records && Array.isArray(day.records)) {
            day.records.forEach(r => {
              totalMealsCount += (parseFloat(r.breakfast) || 0) + (parseFloat(r.lunch) || 0) + (parseFloat(r.dinner) || 0);
            });
          }
        });

        const totalIncome = finances
          .filter(f => f.type === "income")
          .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
          
        const totalExpenses = finances
          .filter(f => f.type === "expense" || !f.type)
          .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
          
        const netBalance = totalIncome - totalExpenses;

        setStats({
          members: members.length,
          meals: totalMealsCount,
          balance: netBalance,
          notices: notices.length,
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardStats();
  }, []);

  const statCards = [
    {
      title: "Total Members",
      value: stats.members,
      icon: Users,
      color: "from-blue-500 to-indigo-500",
      bgLight: "bg-blue-50 dark:bg-blue-500/10",
      textColor: "text-blue-500",
      link: "/manager/members",
    },
    {
      title: "Total Meals",
      value: stats.meals,
      icon: Utensils,
      color: "from-emerald-400 to-teal-500",
      bgLight: "bg-emerald-50 dark:bg-emerald-500/10",
      textColor: "text-emerald-500",
      link: "/manager/meals",
    },
    {
      title: "Mess Balance",
      value: `৳${stats.balance?.toLocaleString() || 0}`,
      icon: Wallet,
      color: "from-amber-400 to-orange-500",
      bgLight: "bg-amber-50 dark:bg-amber-500/10",
      textColor: "text-amber-500",
      link: "/manager/finances",
    },
    {
      title: "Active Notices",
      value: stats.notices,
      icon: Bell,
      color: "from-purple-500 to-pink-500",
      bgLight: "bg-purple-50 dark:bg-purple-500/10",
      textColor: "text-purple-500",
      link: "/manager/notices",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            Welcome back! Here's what's happening in your mess today.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            className="group bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.color} opacity-5 dark:opacity-10 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-500`} />
            
            <div className="relative flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2">
                  {card.title}
                </p>
                {loading ? (
                  <div className="h-8 w-24 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                ) : (
                  <h3 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                    {card.value}
                  </h3>
                )}
              </div>
              <div className={`p-3 rounded-2xl ${card.bgLight} ${card.textColor}`}>
                <card.icon className="w-6 h-6" />
              </div>
            </div>

            <Link
              href={card.link}
              className="mt-6 flex items-center text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors group/link"
            >
              View details
              <ArrowRight className="w-4 h-4 ml-1 opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all" />
            </Link>
          </div>
        ))}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 lg:col-span-2 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Activity className="w-5 h-5 text-amber-500" />
              System Status
            </h2>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800/80">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-500 rounded-xl mr-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">All Systems Operational</h4>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Database connection is active and APIs are responding.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800/80">
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mb-1">Last Backup</p>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-zinc-400" />
                  <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Today, 2:00 AM</span>
                </div>
              </div>
              <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800/80">
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mb-1">Active Sessions</p>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-zinc-400" />
                  <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">1 Manager</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-3xl p-6 shadow-md text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-20 -mt-20" />
          <h2 className="text-xl font-bold mb-2 relative z-10">Quick Actions</h2>
          <p className="text-amber-100 text-sm mb-6 relative z-10">Manage your mess effectively</p>
          
          <div className="space-y-3 relative z-10">
            <Link href="/manager/members" className="flex items-center justify-between w-full p-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-2xl transition-colors font-medium border border-white/10">
              Add New Member
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/manager/meals" className="flex items-center justify-between w-full p-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-2xl transition-colors font-medium border border-white/10">
              Update Meals
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/manager/finances" className="flex items-center justify-between w-full p-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-2xl transition-colors font-medium border border-white/10">
              Record Expense
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}