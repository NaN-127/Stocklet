import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { ArrowRightLeft, CheckCircle2, ClipboardList, Loader2, Bookmark, TrendingUp } from "lucide-react";
import TransactionTable from "../components/trading/TransactionTable";

function UserPanelPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [watchlist, setWatchlist] = useState([]);
  const [watchlistStocks, setWatchlistStocks] = useState([]);

  useEffect(() => {

    const fetchAll = async () => {
      try {
        const [txRes, wlRes] = await Promise.all([
          api.get("/transactions/my-transactions"),
          api.get("/watchlist"),
        ]);
        setTransactions(txRes.data.transactions || []);
        const symbols = wlRes.data.watchList || [];
        setWatchlist(symbols);
        if (symbols.length > 0) {
          const stockResults = await Promise.allSettled(
            symbols.map(sym => api.get(`/stocks/${sym}`))
          );
          setWatchlistStocks(
            stockResults
              .filter(r => r.status === "fulfilled")
              .map(r => r.value.data)
          );
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const totalTxns = transactions.length;

  const executedTxns = transactions.filter(t => t.status === "COMPLETED").length;
  const pendingTxns = transactions.filter(t => t.status === "PENDING").length;

  if (loading) {

    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-[#0f1115]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-[#0f1115] text-gray-900 dark:text-white transition-colors duration-200">
      <div className="max-w-[1400px] mx-auto p-6 md:p-8 space-y-8">

        <div className="mb-2">
          <h1 className="text-3xl font-bold tracking-tight mb-1">Transaction History</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">All your buy and sell orders in one place.</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-[#1a1d24] border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
            <ArrowRightLeft className="text-gray-400 dark:text-gray-500 mb-8" size={24} />
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Total Volume</p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{totalTxns}</h2>
              <span className="text-gray-500 text-sm font-semibold italic">txns</span>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1a1d24] border border-gray-100 dark:border-gray-800 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-green-500/5 mix-blend-overlay pointer-events-none" />
            <CheckCircle2 className="text-green-500 mb-8" size={24} />
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Executed</p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl font-bold text-green-500">{executedTxns}</h2>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1a1d24] border border-gray-100 dark:border-gray-800 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-orange-500/5 mix-blend-overlay pointer-events-none" />
            <ClipboardList className="text-orange-500 mb-8" size={24} />
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Pending Review</p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl font-bold text-orange-400">{pendingTxns}</h2>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1a1d24] border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 dark:bg-[#12141a] border-b border-gray-100 dark:border-gray-800">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold tracking-widest uppercase text-gray-400 dark:text-gray-500">Asset Details</th>
                  <th className="px-6 py-4 text-[10px] font-bold tracking-widest uppercase text-gray-400 dark:text-gray-500">Direction</th>
                  <th className="px-6 py-4 text-[10px] font-bold tracking-widest uppercase text-gray-400 dark:text-gray-500">Volume</th>
                  <th className="px-6 py-4 text-[10px] font-bold tracking-widest uppercase text-gray-400 dark:text-gray-500">Timestamp</th>
                  <th className="px-6 py-4 text-[10px] font-bold tracking-widest uppercase text-gray-400 dark:text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                {transactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-gray-50 dark:hover:bg-[#1f232b] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded shrink-0 flex items-center justify-center font-bold text-xs
                          ${tx.symbol === "AAPL" ? "bg-gray-200 text-gray-900" :
                            tx.symbol === "TSLA" ? "bg-red-600 text-white" :
                            tx.symbol === "MSFT" ? "bg-blue-600 text-white" :
                            tx.symbol === "AMZN" ? "bg-orange-500 text-white" :
                            "bg-green-600 text-white"}`}>
                          {tx.symbol.substring(0, 2)}
                        </div>
                        <div>
                          <p className="font-bold tracking-wide text-gray-900 dark:text-white">{tx.symbol}</p>
                          <p className="text-[10px] text-gray-500 font-semibold">{tx.symbol} Inc.</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded text-[9px] font-extrabold tracking-wider uppercase ${
                        tx.type === "BUY"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                          : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 border border-red-200 dark:border-red-800"
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-900 dark:text-white">{tx.quantity.toFixed(2)}</span>{" "}
                      <span className="text-gray-500 text-xs">shares</span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-sm">
                      {new Date(tx.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          tx.status === "COMPLETED" ? "bg-green-500" :
                          tx.status === "PENDING" ? "bg-orange-500 animate-pulse" :
                          "bg-red-500"
                        }`} />
                        <span className={`text-[10px] font-extrabold tracking-widest uppercase ${
                          tx.status === "COMPLETED" ? "text-green-500" :
                          tx.status === "PENDING" ? "text-orange-500" :
                          "text-red-500"
                        }`}>
                          {tx.status}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}

                {transactions.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400 text-sm">
                      No transactions found. Go to Market to place trades.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="bg-gray-50 dark:bg-[#12141a] border-t border-gray-100 dark:border-gray-800 px-6 py-3">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {transactions.length === 0 ? "No transactions yet" : `${transactions.length} transaction${transactions.length > 1 ? "s" : ""} total`}
            </span>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <Bookmark size={16} className="text-blue-500" />
            <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">My Watchlist</h2>
            <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">{watchlist.length} tracked</span>
          </div>

          {watchlist.length === 0 ? (
            <div className="bg-white dark:bg-[#1a1d24] border border-gray-100 dark:border-gray-800 rounded-xl px-6 py-10 text-center text-gray-500 dark:text-gray-400 text-sm">
              Your watchlist is empty. Add stocks from the Market page.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {watchlistStocks.map(stock => {
                const isPositive = Number(stock.changePercent) >= 0;
                return (
                  <Link
                    key={stock.symbol}
                    to={`/stocks/${stock.symbol}`}
                    className="bg-white dark:bg-[#1a1d24] border border-gray-100 dark:border-gray-800 rounded-xl p-5 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center text-base font-bold">
                        {stock.symbol.charAt(0)}
                      </div>
                      <TrendingUp size={14} className={isPositive ? "text-green-500" : "text-red-500 rotate-180"} />
                    </div>
                    <p className="font-extrabold text-gray-900 dark:text-white text-sm uppercase tracking-wide group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{stock.symbol}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">NASDAQ</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">${stock.price.toFixed(2)}</p>
                    <p className={`text-xs font-semibold mt-0.5 ${isPositive ? "text-green-500" : "text-red-500"}`}>
                      {isPositive ? "+" : ""}{stock.changePercent}% today
                    </p>
                  </Link>
                );
              })}
              {watchlist.length > watchlistStocks.length && (
                watchlist
                  .filter(sym => !watchlistStocks.find(s => s.symbol === sym))
                  .map(sym => (
                    <Link key={sym} to={`/stocks/${sym}`} className="bg-white dark:bg-[#1a1d24] border border-gray-100 dark:border-gray-800 rounded-xl p-5 flex items-center justify-center text-gray-400 dark:text-gray-600 text-sm">
                      {sym}
                    </Link>
                  ))
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default UserPanelPage;