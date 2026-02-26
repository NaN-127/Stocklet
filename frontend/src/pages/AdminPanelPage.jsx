import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Check, X, Clock, TrendingUp, TrendingDown, RefreshCw, BarChart2, CheckCircle2 } from "lucide-react";

function AdminPanelPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const fetchTransactions = async () => {
    try {
      const res = await api.get("/transactions");
      setTransactions(res.data.transactions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleAction = async (id, action) => {

    setProcessingId(id);
    try {
      await api.put(`/transactions/${id}/${action}`);
      await fetchTransactions();
    } catch (err) {

      console.error(`Failed to ${action} transaction:`, err);
    } finally {
      setProcessingId(null);
    }
  };

  const pendingTxns = transactions.filter(t => t.status === "PENDING");
  const buyReqs = pendingTxns.filter(t => t.type === "BUY").length;
  const sellReqs = pendingTxns.filter(t => t.type === "SELL").length;
  const recentlyCompleted = transactions.filter(t => t.status !== "PENDING").slice(0, 3);

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
          <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest mb-3 inline-block">Oversight Panel</span>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Pending Approval Requests</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Manage buy and sell transactions awaiting administrative authorization.</p>
        </div>



        <div className="grid sm:grid-cols-3 gap-4 mb-2">
          <div className="bg-white dark:bg-[#1a1d24] border border-gray-200 dark:border-gray-800 rounded-xl p-5 relative overflow-hidden">
            <div className="absolute top-4 right-4 text-[9px] font-bold text-orange-500 bg-orange-100 dark:bg-orange-500/10 px-2 py-0.5 rounded uppercase">Active</div>
            <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center mb-4">
              <Clock className="text-orange-500 w-5 h-5" />
            </div>
            <p className="text-[10px] font-bold tracking-widest uppercase text-gray-500 dark:text-gray-400 mb-1">Total Pending</p>
            <h2 className="text-3xl font-extrabold">{pendingTxns.length}</h2>
          </div>


          <div className="bg-white dark:bg-[#1a1d24] border border-gray-200 dark:border-gray-800 rounded-xl p-5">
            <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-500/10 flex items-center justify-center mb-4">
              <TrendingUp className="text-green-500 w-5 h-5" />
            </div>
            <p className="text-[10px] font-bold tracking-widest uppercase text-gray-500 dark:text-gray-400 mb-1">Buy Requests</p>
            <h2 className="text-3xl font-extrabold">{buyReqs}</h2>
          </div>

          <div className="bg-white dark:bg-[#1a1d24] border border-gray-200 dark:border-gray-800 rounded-xl p-5">
            <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-500/10 flex items-center justify-center mb-4">
              <TrendingDown className="text-red-500 w-5 h-5" />
            </div>
            <p className="text-[10px] font-bold tracking-widest uppercase text-gray-500 dark:text-gray-400 mb-1">Sell Requests</p>
            <h2 className="text-3xl font-extrabold">{sellReqs}</h2>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1a1d24] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded">
                <BarChart2 size={16} />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white">Transaction Queue</h3>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="text-[10px] font-bold tracking-widest uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-[#12141a]">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Asset</th>
                  <th className="px-6 py-4">Qty</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                {pendingTxns.map((tx) => (
                  <tr key={tx._id} className="hover:bg-gray-50 dark:hover:bg-[#1f232b] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold text-gray-600 dark:text-gray-300 text-sm">
                          {tx.user?.name?.charAt(0) || tx.userName?.charAt(0) || "U"}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white">{tx.user?.name || tx.userName || "User"}</p>
                          <p className="text-[10px] text-gray-500 font-semibold">{tx.user?.email || tx.userEmail || `#${tx._id?.slice(-6)}`}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-widest uppercase flex items-center w-fit gap-1
                        ${tx.type === "BUY" ? "bg-green-50 text-green-600 dark:bg-green-900/20" : "bg-red-50 text-red-600 dark:bg-red-900/20"}
                      `}>
                        <div className={`w-1 h-1 rounded-full ${tx.type === "BUY" ? "bg-green-600" : "bg-red-600"}`} />
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-[10px] font-bold border border-gray-200 dark:border-gray-700">
                          {tx.symbol.charAt(0)}
                        </div>
                        <p className="font-bold text-gray-900 dark:text-white uppercase">{tx.symbol}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                      {tx.quantity.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      ${tx.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 font-extrabold text-gray-900 dark:text-white">
                      ${(tx.quantity * tx.price).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleAction(tx._id, "approve")}
                          disabled={processingId === tx._id}
                          className="w-8 h-8 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center transition-colors shadow-sm disabled:opacity-50"
                        >
                          {processingId === tx._id ? <RefreshCw size={12} className="animate-spin" /> : <Check size={16} strokeWidth={3} />}
                        </button>
                        <button
                          onClick={() => handleAction(tx._id, "reject")}
                          disabled={processingId === tx._id}
                          className="w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-500 flex items-center justify-center transition-colors disabled:opacity-50"
                        >
                          <X size={16} strokeWidth={3} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {pendingTxns.length === 0 && (

                  <tr>
                    <td colSpan="7" className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                      <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-green-500 opacity-50" />
                      No pending transactions.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-3">

          <h3 className="flex items-center gap-2 font-bold text-gray-900 dark:text-white">
            <Clock size={16} className="text-blue-500" /> Recent Activity
          </h3>
          <div className="bg-white dark:bg-[#1a1d24] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden divide-y divide-gray-100 dark:divide-gray-800 shadow-sm">
            {recentlyCompleted.map((tx, idx) => (
              <div key={tx._id} className="p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-[#1f232b] transition-colors">
                <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 border ${
                  tx.status === "COMPLETED"
                    ? "bg-green-50 border-green-200 text-green-600 dark:bg-green-900/20 dark:border-green-800"
                    : "bg-red-50 border-red-200 text-red-600 dark:bg-red-900/20 dark:border-red-800"
                }`}>
                  {tx.status === "COMPLETED" ? <Check size={14} /> : <X size={14} />}
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                  <span className={`font-bold ${tx.status === "COMPLETED" ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"}`}>
                    {tx.status === "COMPLETED" ? "Approved" : "Rejected"}
                  </span>{" "}
                  <span className="font-bold uppercase">{tx.type} {tx.symbol}</span> — {tx.quantity} shares @ ${tx.price.toFixed(2)}
                </p>
                <span className="text-xs text-gray-400 shrink-0">{idx * 12 + 2}m ago</span>
              </div>
            ))}
            {recentlyCompleted.length === 0 && (
              <div className="p-4 text-sm text-gray-500 dark:text-gray-400">No recent activity</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default AdminPanelPage;