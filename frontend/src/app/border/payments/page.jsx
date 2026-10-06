"use client";

import React, { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { CreditCard, Loader2, IndianRupee, ArrowDownRight } from "lucide-react";
import { toast } from "react-toastify";
import { format } from "date-fns";

export default function BorderPaymentsPage() {
  const { data: session, isPending } = authClient.useSession();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [stats, setStats] = useState({
    totalDeposit: 0,
    totalCost: 0,
    balance: 0
  });

  const fetchPaymentData = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      
      const [payRes, mealsRes, financesRes] = await Promise.all([
        fetch(`${apiUrl}/api/payments`),
        fetch(`${apiUrl}/api/meals`),
        fetch(`${apiUrl}/api/finances`),
      ]);

      if (payRes.ok && mealsRes.ok && financesRes.ok) {
        const allPayments = await payRes.json();
        const allMeals = await mealsRes.json();
        const allFinances = await financesRes.json();

        // 1. Filter my payments
        const myPayments = allPayments.filter(p => p.memberId === session.user.id);
        setPayments(myPayments);

        // 2. Calculate Total Deposit
        const totalDeposit = myPayments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);

        // 3. Calculate My Total Cost
        let totalMessMeals = 0;
        let myMealsCount = 0;

        allMeals.forEach(day => {
          if (day.records && Array.isArray(day.records)) {
            day.records.forEach(r => {
              const sum = (parseFloat(r.breakfast) || 0) + (parseFloat(r.lunch) || 0) + (parseFloat(r.dinner) || 0);
              totalMessMeals += sum;
              if (r.memberId === session.user.id) {
                myMealsCount += sum;
              }
            });
          }
        });

        const totalExpenses = allFinances
          .filter(f => f.type === "expense" || !f.type)
          .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

        const mealRate = totalMessMeals > 0 ? (totalExpenses / totalMessMeals) : 0;
        const totalCost = myMealsCount * mealRate;

        // 4. Calculate Balance
        const balance = totalDeposit - totalCost;

        setStats({
          totalDeposit,
          totalCost,
          balance
        });
      }
    } catch (error) {
      toast.error("Failed to load payment history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchPaymentData();
    }
  }, [session]);

  if (isPending || loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-amber-500" />
            My Payments
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Track your deposits and current balance.
          </p>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 rounded-xl">
            <ArrowDownRight className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-zinc-500 uppercase">Total Deposited</p>
            <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100">৳{stats.totalDeposit.toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-500/10 text-amber-500 rounded-xl">
            <IndianRupee className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-zinc-500 uppercase">Total Meal Cost</p>
            <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100">৳{stats.totalCost.toFixed(2)}</p>
          </div>
        </div>

        <div className={`border rounded-2xl p-5 shadow-sm flex items-center gap-4 ${stats.balance >= 0 ? 'bg-emerald-500 border-emerald-600 text-white' : 'bg-rose-500 border-rose-600 text-white'}`}>
          <div className="p-3 bg-white/20 rounded-xl">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-white/80 uppercase">Current Balance</p>
            <p className="text-xl font-bold flex items-center gap-1">
              {stats.balance >= 0 ? '+' : '-'} ৳{Math.abs(stats.balance).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white/70 dark:bg-zinc-900/40 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Deposit History</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-12 text-center text-zinc-500">
                    No deposits found.
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {format(new Date(payment.date), 'MMMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                      {payment.description || "Deposit"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
                        + ৳{parseFloat(payment.amount).toFixed(2)}
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
