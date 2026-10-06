"use client";

import React, { useEffect, useState } from "react";
import { DollarSign, Plus, Trash2, Loader2, User, Calendar, CreditCard, Activity } from "lucide-react";
import { toast } from "react-toastify";
import { format } from "date-fns";

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);

  // Form State
  const [selectedMember, setSelectedMember] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split("T")[0]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const [payRes, memRes] = await Promise.all([
        fetch(`${apiUrl}/api/payments`),
        fetch(`${apiUrl}/api/users`) // Fetch all users to map names, or just members
      ]);

      if (payRes.ok && memRes.ok) {
        const payData = await payRes.json();
        const memData = await memRes.json();
        
        setPayments(payData);
        setMembers(memData.filter(m => m.role === 'member'));
      }
    } catch (error) {
      toast.error("Failed to load payments data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleAddPayment = async (e) => {
    e.preventDefault();
    if (!selectedMember || !amount) {
      toast.error("Please fill required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      
      const memberInfo = members.find(m => m._id === selectedMember);
      
      const payload = {
        memberId: selectedMember,
        memberName: memberInfo?.name || "Unknown",
        amount: parseFloat(amount),
        description: description || "Deposit",
        date: paymentDate
      };

      const res = await fetch(`${apiUrl}/api/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const newPayment = await res.json();
        toast.success("Payment recorded successfully!");
        setPayments(prev => [
          { ...payload, _id: newPayment.insertedId },
          ...prev
        ].sort((a, b) => new Date(b.date) - new Date(a.date)));
        
        // Reset form
        setAmount("");
        setDescription("");
      } else {
        toast.error("Failed to add payment.");
      }
    } catch (error) {
      toast.error("An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this payment record?")) return;
    
    setIsDeleting(id);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/payments/${id}`, { method: "DELETE" });

      if (res.ok) {
        toast.success("Payment deleted.");
        setPayments(prev => prev.filter(p => p._id !== id));
      } else {
        toast.error("Failed to delete.");
      }
    } catch (error) {
      toast.error("An error occurred.");
    } finally {
      setIsDeleting(null);
    }
  };

  const totalCollected = payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <DollarSign className="w-8 h-8 text-amber-500" />
            Payment System
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-1">
            Manage member deposits and track total collected funds.
          </p>
        </div>
        
        <div className="bg-amber-50 dark:bg-amber-500/10 px-6 py-3 rounded-2xl border border-amber-100 dark:border-amber-900/30 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center">
            <Activity className="w-5 h-5 text-amber-600 dark:text-amber-500" />
          </div>
          <div>
            <p className="text-xs font-medium text-amber-600/80 dark:text-amber-500/80 uppercase tracking-wider">Total Collected</p>
            <span className="text-2xl font-black text-amber-700 dark:text-amber-400">৳ {totalCollected.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Add Payment Form */}
        <div className="lg:col-span-1">
          <div className="bg-white/70 dark:bg-zinc-900/40 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm sticky top-6">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5 text-amber-500" />
              Record New Deposit
            </h2>

            <form onSubmit={handleAddPayment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Member</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-zinc-400" />
                  </div>
                  <select
                    value={selectedMember}
                    onChange={(e) => setSelectedMember(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none text-zinc-900 dark:text-zinc-100 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all appearance-none"
                    required
                  >
                    <option value="" disabled>Select Member</option>
                    {members.map(m => (
                      <option key={m._id} value={m._id}>{m.name} (Room: {m.roomNo || 'N/A'})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Amount (৳)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CreditCard className="h-4 w-4 text-zinc-400" />
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none text-zinc-900 dark:text-zinc-100 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all font-bold"
                    placeholder="Enter amount"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Date</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-4 w-4 text-zinc-400" />
                  </div>
                  <input
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none text-zinc-900 dark:text-zinc-100 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Description / Note</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none text-zinc-900 dark:text-zinc-100 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                  placeholder="e.g. October Mess Deposit"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                Add Deposit
              </button>
            </form>
          </div>
        </div>

        {/* Payments Table */}
        <div className="lg:col-span-2">
          <div className="bg-white/70 dark:bg-zinc-900/40 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm overflow-hidden h-full flex flex-col">
            <div className="px-6 py-5 border-b border-zinc-200 dark:border-zinc-800">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Transaction History</h2>
            </div>
            
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
                    <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Member</th>
                    <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-right">Amount</th>
                    <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {payments.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-16 text-center">
                        <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                          <DollarSign className="w-8 h-8 text-zinc-400" />
                        </div>
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">No Payments Found</h3>
                        <p className="text-zinc-500 mt-1 text-sm">Record a deposit to see it here.</p>
                      </td>
                    </tr>
                  ) : (
                    payments.map((payment) => (
                      <tr key={payment._id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                            {format(new Date(payment.date), 'MMM dd, yyyy')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-700 dark:text-zinc-300">
                              {payment.memberName.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{payment.memberName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-1">{payment.description}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-bold bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-900/30">
                            + ৳{parseFloat(payment.amount).toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button
                            onClick={() => handleDelete(payment._id)}
                            disabled={isDeleting === payment._id}
                            className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                          >
                            {isDeleting === payment._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
