"use client";

import React, { useEffect, useState } from "react";
import { Wallet, Plus, Trash2, Loader2, ArrowUpRight, ArrowDownRight, IndianRupee } from "lucide-react";
import { toast } from "react-toastify";

export default function FinancesManagementPage() {
  const [finances, setFinances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    description: "",
    amount: "",
    type: "expense", // could be 'income' if they collect money
  });

  const fetchFinances = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/finances`);
      if (res.ok) {
        const data = await res.json();
        // Sort by date descending
        data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setFinances(data);
      }
    } catch (error) {
      toast.error("Failed to fetch records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinances();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddRecord = async (e) => {
    e.preventDefault();
    if (!formData.description || !formData.amount) {
      toast.warning("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount),
      };

      const res = await fetch(`${apiUrl}/api/finances`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("Record added successfully!");
        setFormData({ ...formData, description: "", amount: "" });
        fetchFinances(); // Refresh list
      } else {
        toast.error("Failed to add record.");
      }
    } catch (error) {
      toast.error("An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!recordToDelete) return;
    setIsDeleting(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/finances/${recordToDelete._id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Record deleted.");
        setFinances(finances.filter(f => f._id !== recordToDelete._id));
      } else {
        toast.error("Failed to delete record.");
      }
    } catch (error) {
      toast.error("Error deleting record.");
    } finally {
      setIsDeleting(false);
      setRecordToDelete(null);
    }
  };

  const totalExpenses = finances
    .filter(f => f.type === "expense")
    .reduce((sum, curr) => sum + (Number(curr.amount) || 0), 0);

  const totalIncome = finances
    .filter(f => f.type === "income")
    .reduce((sum, curr) => sum + (Number(curr.amount) || 0), 0);

  const balance = totalIncome - totalExpenses;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Wallet className="w-6 h-6 text-amber-500" />
            Finances & Expenses
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-1">
            Track daily bazaar costs, utility bills, and member deposits.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 rounded-2xl">
            <ArrowDownRight className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Income</p>
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">৳{totalIncome.toLocaleString()}</h3>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-2xl">
            <ArrowUpRight className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Expenses</p>
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">৳{totalExpenses.toLocaleString()}</h3>
          </div>
        </div>
        <div className="bg-gradient-to-br from-amber-400 to-amber-600 rounded-3xl p-6 shadow-sm flex items-center gap-4 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-20 rounded-full blur-2xl -mr-10 -mt-10" />
          <div className="p-4 bg-white/20 rounded-2xl relative z-10">
            <IndianRupee className="w-6 h-6" />
          </div>
          <div className="relative z-10">
            <p className="text-sm font-medium text-amber-100">Net Balance</p>
            <h3 className="text-2xl font-bold">৳{balance.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Add Record Form */}
        <div className="lg:col-span-1 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
          <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2">
            <Plus className="w-5 h-5 text-amber-500" />
            Add New Record
          </h3>
          
          <form onSubmit={handleAddRecord} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Type</label>
              <select 
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all text-sm"
              >
                <option value="expense">Expense (Bazaar, Bills)</option>
                <option value="income">Income (Deposits, Fees)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Date</label>
              <input 
                type="date" 
                name="date"
                required
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Description</label>
              <input 
                type="text" 
                name="description"
                placeholder="e.g., Daily Bazaar"
                required
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Amount (৳)</label>
              <input 
                type="number" 
                name="amount"
                placeholder="0.00"
                min="0"
                step="0.01"
                required
                value={formData.amount}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all text-sm"
              />
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-6 py-3 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-bold rounded-xl shadow-sm transition-all flex justify-center items-center gap-2"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Record"}
            </button>
          </form>
        </div>

        {/* Records Table */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm overflow-hidden backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
                  <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-right">Amount</th>
                  <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-16 text-center">
                      <Loader2 className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
                      <p className="text-zinc-500 mt-3 text-sm">Loading financial records...</p>
                    </td>
                  </tr>
                ) : finances.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-16 text-center text-zinc-500">
                      No financial records found.
                    </td>
                  </tr>
                ) : (
                  finances.map((record) => (
                    <tr key={record._id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                        {new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 text-zinc-900 dark:text-zinc-100 font-medium">
                        {record.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className={`font-bold ${record.type === 'income' ? 'text-emerald-500' : 'text-red-500'}`}>
                          {record.type === 'income' ? '+' : '-'} ৳{Number(record.amount).toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => setRecordToDelete(record)}
                          className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Delete Confirmation Modal */}
      {recordToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200 p-6 text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">Delete Record?</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
              Are you sure you want to delete this <strong className="text-zinc-700 dark:text-zinc-300">{recordToDelete.type}</strong> record for <strong className="text-zinc-700 dark:text-zinc-300">৳{recordToDelete.amount}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setRecordToDelete(null)}
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
