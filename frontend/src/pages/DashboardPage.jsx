import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Loader2, Bookmark, TrendingUp, TrendingDown, BookmarkX } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import StockCard from "../components/stock/StockCard";
import ChartComponent from "../components/stock/ChartComponent";
import TransactionTable from "../components/trading/TransactionTable";

function DashboardPage() {
  const { watchlist, removeFromWatchlist } = useAuth();

  const [symbol, setSymbol] = useState("AAPL");
  const [searchInput, setSearchInput] = useState("");
  const [stock, setStock] = useState(null);
  const [history, setHistory] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("30D");
  const [error, setError] = useState(null);

  const [watchlistStocks, setWatchlistStocks] = useState([]);

  const fetchData = async (searchSymbol) => {

    setLoading(true);
    setError(null);


    const days = period === "30D" ? 30 : period === "7D" ? 7 : 1;

    try {
      const [quoteRes, historyRes, txRes] = await Promise.all([

        api.get(`/stocks/${searchSymbol}`),
        api.get(`/stocks/history/${searchSymbol}?days=${days}`),

        api.get("/transactions/my-transactions"),
      ]);
      setStock(quoteRes.data);
      setHistory(historyRes.data);
      setTransactions(txRes.data.transactions?.slice(0, 5) || []);
      setSymbol(searchSymbol.toUpperCase());

    } catch (err) {

      console.error(err);
      setError("Failed to fetch stock data. Check the symbol or try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData("AAPL");
  }, []);

  useEffect(() => {
    if (stock) fetchData(symbol);
  }, [period]);

  useEffect(() => {
    if (!watchlist || watchlist.length === 0) {
      setWatchlistStocks([]);
      return;
    }

    const fetchWatchlistPrices = async () => {
      const results = await Promise.allSettled(
        watchlist.map(sym => api.get(`/stocks/${sym}`))
      );
      setWatchlistStocks(
        results.filter(r => r.status === "fulfilled").map(r => r.value.data)
      );
    };

    fetchWatchlistPrices();

  }, [watchlist]);

  const handleSearch = (e) => {
    
    e.preventDefault();
    if (searchInput.trim()) {
      fetchData(searchInput.trim());
      setSearchInput("");
    }
  };

  if (loading && !stock) {

    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-[#0f1115]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-[#0f1115] transition-colors duration-200">
      <div className="max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8 space-y-6">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Market Overview</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Real-time performance metrics and market trends.</p>
          </div>
          <form onSubmit={handleSearch} className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search symbol..."
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#1a1d24] border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:text-white text-sm"
            />
          </form>
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-900/50 text-sm">
            {error}
          </div>
        )}

        {stock && (
          <div>
            <StockCard stock={stock} />
            <div className="bg-white dark:bg-[#1a1d24] border border-gray-100 dark:border-gray-800 rounded-xl px-6 pb-6 shadow-sm mt-[-1px] border-t-0 rounded-tl-none rounded-tr-none">
              <ChartComponent history={history} period={period} onPeriodChange={setPeriod} strokeColor="#10b981" />
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-[#1a1d24] border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <Bookmark size={15} className="text-blue-500" />
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">My Watchlist</h3>
              <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 text-[10px] font-bold px-1.5 py-0.5 rounded">
                {watchlist?.length || 0}
              </span>
            </div>
            <Link to="/transactions" className="text-xs font-semibold text-blue-500 hover:text-blue-600">
              View All →
            </Link>
          </div>

          {!watchlist || watchlist.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-400 dark:text-gray-600 text-sm">
              <Bookmark className="w-6 h-6 mx-auto mb-2 opacity-40" />
              No stocks in your watchlist yet. Search a stock and add it.
            </div>
          ) : (
            <div className="divide-y divide-gray-50 dark:divide-gray-800/50">
              {watchlistStocks.length === 0 ? (
                <div className="px-6 py-4 flex items-center gap-2 text-sm text-gray-400">
                  <Loader2 size={14} className="animate-spin" /> Loading prices...
                </div>
              ) : (
                watchlistStocks.map(ws => {
                  const isPositive = Number(ws.changePercent) >= 0;
                  return (
                    <div key={ws.symbol} className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 dark:hover:bg-[#1f232b] transition-colors group">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm shrink-0">
                        {ws.symbol.charAt(0)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 dark:text-white text-sm uppercase">{ws.symbol}</p>
                        <p className="text-[10px] text-gray-500">NASDAQ</p>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-gray-900 dark:text-white text-sm">${ws.price.toFixed(2)}</p>
                        <p className={`text-[10px] font-semibold flex items-center justify-end gap-0.5 ${isPositive ? "text-green-500" : "text-red-500"}`}>
                          {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                          {isPositive ? "+" : ""}{ws.changePercent}%
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Link
                          to={`/stocks/${ws.symbol}`}
                          className="px-3 py-1 text-[10px] font-bold bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                        >
                          Trade
                        </Link>
                        <button
                          onClick={() => removeFromWatchlist(ws.symbol)}
                          className="p-1.5 text-gray-300 dark:text-gray-700 hover:text-red-500 dark:hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                          title="Remove from watchlist"
                        >
                          <BookmarkX size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Recent Transactions</h3>
            <Link to="/transactions" className="text-sm font-semibold text-green-500 hover:text-green-600">View All</Link>
          </div>
          <TransactionTable transactions={transactions} />
        </div>

      </div>
    </div>
  );
}

export default DashboardPage;