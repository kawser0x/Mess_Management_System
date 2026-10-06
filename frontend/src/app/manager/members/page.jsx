"use client";

import React, { useEffect, useState } from "react";
import { Users, Mail, Phone, Home, Loader2, Search, UserPlus, Trash2, X, Eye } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

export default function MembersManagementPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [memberToDelete, setMemberToDelete] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    roomNo: "",
  });
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  async function fetchMembers() {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/members`);
      if (res.ok) {
        const data = await res.json();
        setMembers(data);
      }
    } catch (error) {
      console.error("Failed to fetch members:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMembers();
  }, []);

  const confirmDelete = async () => {
    if (!memberToDelete) return;
    setIsDeleting(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/members/${memberToDelete._id}`, { method: "DELETE" });
      if (res.ok) {
        setMembers(members.filter((m) => m._id !== memberToDelete._id));
        toast.success(`${memberToDelete.name} has been removed.`);
        setMemberToDelete(null);
      } else {
        toast.error("Failed to delete member.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting member.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/members/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setMembers(
          members.map((m) =>
            m._id === id ? { ...m, status: newStatus } : m
          )
        );
        toast.success(`Status updated to ${newStatus}.`);
      } else {
        toast.error("Failed to update status.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating status.");
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);

    try {
      // Use raw fetch with credentials: "omit" so we don't accidentally log out the manager
      // and log in as the newly created user!
      const frontendUrl = window.location.origin;
      const res = await fetch(`${frontendUrl}/api/auth/sign-up/email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "omit", // This is crucial to keep the manager logged in
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          phone: formData.phone,
          roomNo: formData.roomNo,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.error(data.message || data.error || "Failed to add member.");
      } else {
        // Success
        toast.success("Member added successfully!");
        setIsAddModalOpen(false);
        setFormData({ name: "", email: "", password: "", phone: "", roomNo: "" });
        // Refetch members
        fetchMembers();
      }
    } catch (err) {
      toast.error("An unexpected error occurred.");
    } finally {
      setFormLoading(false);
    }
  };

  const filteredMembers = members.filter((member) => {
    const matchesSearch = member.name?.toLowerCase().includes(search.toLowerCase()) ||
                          member.email?.toLowerCase().includes(search.toLowerCase());
    
    const memberStatus = member.status || "present";
    const matchesStatus = statusFilter === "all" ? true : memberStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Users className="w-6 h-6 text-amber-500" />
            Members Management
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-1">
            View, add, and remove borders in the mess.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3 w-full sm:w-auto">
          {/* Status Filter Tabs */}
          <div className="flex p-1 bg-zinc-100 dark:bg-zinc-800/50 rounded-xl">
            {["all", "present", "past"].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-4 py-1.5 text-xs font-medium rounded-lg capitalize transition-all ${
                  statusFilter === tab
                    ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-56">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-zinc-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all shadow-sm"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-semibold shadow-sm transition-colors whitespace-nowrap"
            >
              <UserPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Add</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Member Info</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Room</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center">
                    <Loader2 className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
                    <p className="text-zinc-500 mt-2 text-sm">Loading members...</p>
                  </td>
                </tr>
              ) : filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center">
                    <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users className="w-6 h-6 text-zinc-400" />
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-400 font-medium">No members found</p>
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr key={member._id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold shadow-md">
                          {member.name?.charAt(0).toUpperCase() || "?"}
                        </div>
                        <div>
                          <div className="font-semibold text-zinc-900 dark:text-zinc-100">{member.name}</div>
                          <div className="text-xs text-zinc-500 capitalize">{member.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
                          <Mail className="w-4 h-4 text-zinc-400" />
                          {member.email}
                        </div>
                        {member.phone && (
                          <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
                            <Phone className="w-4 h-4 text-zinc-400" />
                            {member.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        <Home className="w-4 h-4 text-amber-500" />
                        {member.roomNo || "Unassigned"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative inline-block">
                        <select
                          value={member.status || "present"}
                          onChange={(e) => {
                            if (e.target.value !== (member.status || "present")) {
                              handleStatusChange(member._id, e.target.value);
                            }
                          }}
                          className={`appearance-none px-3 py-1 pr-7 text-xs leading-5 font-semibold rounded-full border cursor-pointer outline-none transition-colors ${
                            (!member.status || member.status === "present")
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20 hover:bg-emerald-200 dark:hover:bg-emerald-500/30"
                              : "bg-zinc-100 text-zinc-800 dark:bg-zinc-500/20 dark:text-zinc-400 border-zinc-200 dark:border-zinc-500/20 hover:bg-zinc-200 dark:hover:bg-zinc-500/30"
                          }`}
                        >
                          <option value="present">Present</option>
                          <option value="past">Past</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-current opacity-70">
                          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right flex justify-end gap-2">
                      <button
                        onClick={() => setSelectedMember(member)}
                        className="p-2 text-zinc-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setMemberToDelete(member)}
                        className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Remove Member"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Member Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-md border border-zinc-200 dark:border-zinc-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-amber-500" />
                Add New Member
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Full Name</label>
                <input
                  required
                  type="text"
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-xl bg-transparent focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm dark:text-zinc-100"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Email</label>
                <input
                  required
                  type="email"
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-xl bg-transparent focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm dark:text-zinc-100"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Temporary Password</label>
                <input
                  required
                  type="password"
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-xl bg-transparent focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm dark:text-zinc-100"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Phone</label>
                  <input
                    required
                    type="tel"
                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-xl bg-transparent focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm dark:text-zinc-100"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Room No</label>
                  <input
                    required
                    type="text"
                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-xl bg-transparent focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm dark:text-zinc-100"
                    value={formData.roomNo}
                    onChange={(e) => setFormData({ ...formData, roomNo: e.target.value })}
                  />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-xl shadow-sm transition-colors disabled:opacity-70 flex items-center gap-2"
                >
                  {formLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {formLoading ? "Adding..." : "Add Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Member Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="relative h-24 bg-gradient-to-r from-amber-400 to-amber-600">
              <button
                onClick={() => setSelectedMember(null)}
                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors bg-black/20 hover:bg-black/40 rounded-full p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 pb-6 relative">
              <div className="w-20 h-20 -mt-10 mx-auto rounded-full bg-white dark:bg-zinc-900 border-4 border-white dark:border-zinc-900 flex items-center justify-center shadow-lg relative">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-2xl font-bold">
                  {selectedMember.name?.charAt(0).toUpperCase() || "?"}
                </div>
              </div>
              
              <div className="text-center mt-3 mb-6">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{selectedMember.name}</h3>
                <p className="text-sm font-medium text-amber-500 uppercase tracking-wider">{selectedMember.role}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                  <div className="p-2 bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-500 rounded-lg">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Email Address</p>
                    <p className="text-sm text-zinc-900 dark:text-zinc-100 font-medium">{selectedMember.email}</p>
                  </div>
                </div>

                {selectedMember.phone && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                    <div className="p-2 bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-500 rounded-lg">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Phone Number</p>
                      <p className="text-sm text-zinc-900 dark:text-zinc-100 font-medium">{selectedMember.phone}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                  <div className="p-2 bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-500 rounded-lg">
                    <Home className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Room Assigned</p>
                    <p className="text-sm text-zinc-900 dark:text-zinc-100 font-medium">{selectedMember.roomNo || "Unassigned"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {memberToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200 p-6 text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">Remove Member?</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
              Are you sure you want to remove <strong className="text-zinc-700 dark:text-zinc-300">{memberToDelete.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setMemberToDelete(null)}
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
                {isDeleting ? "Removing..." : "Yes, Remove"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
