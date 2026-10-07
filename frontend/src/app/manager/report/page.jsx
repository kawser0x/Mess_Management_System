"use client";

import React, { useEffect, useState } from "react";
import { FileText, Loader2, ArrowDownToLine, ArrowUpFromLine, TrendingUp, Archive, Printer } from "lucide-react";
import { toast } from "react-toastify";

export default function ReportPage() {
  const [reportData, setReportData] = useState([]);
  const [mealRate, setMealRate] = useState(0);
  const [totalMeals, setTotalMeals] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    async function fetchReportData() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        
        const [membersRes, mealsRes, financesRes, paymentsRes] = await Promise.all([
          fetch(`${apiUrl}/api/members`).catch(() => null),
          fetch(`${apiUrl}/api/meals`).catch(() => null),
          fetch(`${apiUrl}/api/finances`).catch(() => null),
          fetch(`${apiUrl}/api/payments`).catch(() => null),
        ]);

        const members = membersRes?.ok ? await membersRes.json() : [];
        const meals = mealsRes?.ok ? await mealsRes.json() : [];
        const finances = financesRes?.ok ? await financesRes.json() : [];
        const payments = paymentsRes?.ok ? await paymentsRes.json() : [];

        // 1. Calculate Total Meals
        let totalMealsCount = 0;
        meals.forEach(day => {
          if (day.records && Array.isArray(day.records)) {
            day.records.forEach(r => {
              totalMealsCount += (parseFloat(r.breakfast) || 0) + (parseFloat(r.lunch) || 0) + (parseFloat(r.dinner) || 0);
            });
          }
        });

        // 2. Calculate Total Expenses (Finances)
        const totalExpenses = finances
          .filter(f => f.type === "expense" || !f.type)
          .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

        // 3. Calculate Current Meal Rate
        const currentMealRate = totalMealsCount > 0 ? (totalExpenses / totalMealsCount) : 0;
        setMealRate(currentMealRate);
        setTotalMeals(totalMealsCount);
        setTotalExpenses(totalExpenses);

        // 4. Calculate Data for Each Member
        const report = members.map(member => {
          // Total Meals for this member
          let memberTotalMeal = 0;
          meals.forEach(day => {
            if (day.records && Array.isArray(day.records)) {
              const record = day.records.find(r => r.memberId === member._id.toString());
              if (record) {
                memberTotalMeal += (parseFloat(record.breakfast) || 0) + (parseFloat(record.lunch) || 0) + (parseFloat(record.dinner) || 0);
              }
            }
          });

          // Payments categorized by type for this member
          const memberPaymentsData = payments.filter(p => p.memberId === member._id.toString());
          
          const memberTotalPayment = memberPaymentsData
            .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

          const memberTotalRent = memberPaymentsData
            .filter(p => p.type === "rent")
            .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

          const memberTotalDuePay = memberPaymentsData
            .filter(p => p.type === "due_pay")
            .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

          // Total Meal Cost
          const memberTotalMealCost = memberTotalMeal * currentMealRate;

          // Due (Total Pay After the Month) and Return
          const totalMemberCost = memberTotalMealCost;
          const balance = memberTotalPayment - totalMemberCost;
                  
          const dueAmount = balance < 0 ? Math.abs(balance) : 0;
          const returnAmount = balance > 0 ? balance : 0;

          return {
            id: member._id,
            name: member.name,
            totalMeal: memberTotalMeal,
            totalPayment: memberTotalPayment,
            totalMealCost: memberTotalMealCost,
            rent: memberTotalRent,
            duePay: memberTotalDuePay,
            dueAmount,
            returnAmount,
          };
        });

        setReportData(report);
      } catch (error) {
        console.error("Error fetching report data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchReportData();
  }, []);

  const handleCloseMonth = async () => {
    if (!confirm("Are you sure you want to close this month? This will archive all current meals and finances, and start a new month with carried forward balances.")) {
      return;
    }
    
    setIsClosing(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const month = new Date().toISOString().substring(0, 7); // e.g., "2026-10"
      
      const payload = {
        month,
        reportData,
        mealRate,
        totalMeals,
        totalExpenses
      };

      const res = await fetch(`${apiUrl}/api/months/close`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("Month closed successfully! Balances carried forward.");
        // Refresh page to show clean state
        setTimeout(() => window.location.reload(), 1500);
      } else {
        toast.error("Failed to close month.");
      }
    } catch (error) {
      toast.error("An error occurred.");
    } finally {
      setIsClosing(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { size: landscape; margin: 10mm; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          table { font-size: 12px; }
          th, td { padding-left: 8px !important; padding-right: 8px !important; }
        }
      `}} />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <FileText className="w-6 h-6 text-amber-500" />
            Monthly Calculation Report
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-1">
            Overview of member meals, costs, and remaining balances.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Meal Rate Badge */}
          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 px-4 py-2 rounded-xl flex items-center gap-2 font-semibold">
            <TrendingUp className="w-5 h-5" />
            Current Meal Rate: ৳{mealRate.toFixed(2)}
          </div>
          
          <div className="flex items-center gap-2 print:hidden">
            {/* Print Report Button */}
            <button
              onClick={() => window.print()}
              disabled={loading || reportData.length === 0}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              <Printer className="w-4 h-4 text-zinc-500" />
              Print Report
            </button>

            {/* Close Month Button */}
            <button
              onClick={handleCloseMonth}
              disabled={isClosing || loading || reportData.length === 0}
              className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-amber-500/20"
            >
              {isClosing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Archive className="w-4 h-4" />}
              Close Month
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm overflow-hidden backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Member Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-center">Total Meal</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-center">Total Payment</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-center">Total Meal Cost</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-center">Rent</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-center">Due Pay</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-center">Current Balance (Due)</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-center">Total Return</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse bg-zinc-50/50 dark:bg-zinc-900/50">
                    <td className="px-6 py-4">
                      <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-24"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-16 mx-auto"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-20 mx-auto"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-20 mx-auto"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-16 mx-auto"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-16 mx-auto"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-6 bg-zinc-200 dark:bg-zinc-700 rounded-lg w-20 mx-auto"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-6 bg-zinc-200 dark:bg-zinc-700 rounded-lg w-20 mx-auto"></div>
                    </td>
                  </tr>
                ))
              ) : reportData.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center text-zinc-500">
                    No active members found.
                  </td>
                </tr>
              ) : (
                reportData.map((row) => (
                  <tr key={row.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-zinc-900 dark:text-zinc-100 font-bold">
                        {row.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center font-medium text-zinc-600 dark:text-zinc-400">
                        {row.totalMeal.toFixed(1)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-emerald-600 dark:text-emerald-400 font-semibold">
                        ৳{row.totalPayment.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-amber-600 dark:text-amber-500 font-semibold">
                        ৳{row.totalMealCost.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-rose-600 dark:text-rose-400 font-semibold">
                        ৳{row.rent.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-rose-600 dark:text-rose-400 font-semibold">
                        ৳{row.duePay.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {row.dueAmount > 0 ? (
                          <span className="inline-flex items-center gap-1 text-red-600 dark:text-red-400 font-bold bg-red-50 dark:bg-red-500/10 px-2 py-1 rounded-lg">
                            <ArrowDownToLine className="w-4 h-4" />
                            ৳{row.dueAmount.toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-zinc-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {row.returnAmount > 0 ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-lg">
                            <ArrowUpFromLine className="w-4 h-4" />
                            ৳{row.returnAmount.toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-zinc-400">-</span>
                        )}
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
