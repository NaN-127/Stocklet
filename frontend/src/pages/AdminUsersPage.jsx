import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Users, Shield, RefreshCw, Search } from "lucide-react";

function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/users");
      setUsers(res.data.users || []);
    } catch (err) {
      setError("Failed to load users. Make sure you are logged in as admin.");
      console.error(err);
    } finally {
      setLoading(false);

    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);


  const filtered = users.filter(u =>

    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalUsers = users.length;
  const adminCount = users.filter(u => u.role === "admin").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-[#0f1115]">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-[#0f1115] text-gray-900 dark:text-gray-100 transition-colors duration-200 pb-12">
      <div className="max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8 space-y-6">

        <div className="mb-6">
          <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest mb-3 inline-block">User Management</span>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Registered Users</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">All registered accounts on the platform.</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-[#1a1d24] border border-gray-200 dark:border-gray-800 rounded-xl p-5">
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center mb-4">
              <Users className="text-blue-500 w-5 h-5" />
            </div>
            <p className="text-[10px] font-bold tracking-widest uppercase text-gray-500 dark:text-gray-400 mb-1">Total Users</p>
            <h2 className="text-3xl font-extrabold">{totalUsers}</h2>
          </div>

          <div className="bg-white dark:bg-[#1a1d24] border border-gray-200 dark:border-gray-800 rounded-xl p-5">
            <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center mb-4">
              <Shield className="text-purple-500 w-5 h-5" />
            </div>
            <p className="text-[10px] font-bold tracking-widest uppercase text-gray-500 dark:text-gray-400 mb-1">Admins</p>
            <h2 className="text-3xl font-extrabold">{adminCount}</h2>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="bg-white dark:bg-[#1a1d24] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded">
                <Users size={16} />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white">All Accounts</h3>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name or email..."
                className="pl-9 pr-4 py-2 w-full sm:w-64 bg-gray-50 dark:bg-[#0f1115] border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="text-[10px] font-bold tracking-widest uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-[#12141a]">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Joined</th>
                  <th className="px-6 py-4">Watchlist</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                {filtered.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-[#1f232b] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                          {u.name?.charAt(0).toUpperCase()}
                        </div>
                        <p className="font-bold text-gray-900 dark:text-white">{u.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold tracking-widest uppercase ${
                        u.role === "admin"
                          ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                          : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300 font-semibold">
                      {u.watchList?.length || 0} stocks
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-gray-500 dark:text-gray-400 text-sm">
                      {search ? `No users matching "${search}"` : "No users found."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="bg-gray-50 dark:bg-[#12141a] border-t border-gray-100 dark:border-gray-800 px-6 py-3">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Showing <span className="font-bold text-gray-700 dark:text-gray-300">{filtered.length}</span> of {totalUsers} users
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AdminUsersPage;
