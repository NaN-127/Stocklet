import React, { useEffect, useState } from "react";
import { Search, Loader2, TrendingUp } from "lucide-react";
import api from "../services/api";
import StockCard from "../components/stock/StockCard";

const POPULAR_SYMBOLS = ["AAPL", "TSLA", "MSFT", "AMZN", "GOOGL", "NVDA", "META", "NFLX"];

function MarketPage() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const results = await Promise.allSettled(
          POPULAR_SYMBOLS.map(sym => api.get(`/stocks/${sym}`))
        );
        const loaded = results
          .filter(r => r.status === "fulfilled")
          .map(r => r.value.data);
        setStocks(loaded);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    const sym = search.trim().toUpperCase();
    if (!sym) return;
    setSearchLoading(true);
    setSearchError(null);
    setSearchResult(null);
    try {
      const res = await api.get(`/stocks/${sym}`);
      setSearchResult(res.data);
    } catch {
      setSearchError(`No results found for "${sym}". Check the symbol and try again.`);
    } finally {
      setSearchLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-[#0f1115]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-[#0f1115] text-gray-900 dark:text-gray-100 transition-colors duration-200 pb-12">
      <div className="max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8 space-y-6">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Market</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Browse and trade popular stocks.</p>
          </div>
          <form onSubmit={handleSearch} className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search symbol e.g. AAPL..."
              className="w-full pl-9 pr-20 py-2.5 bg-white dark:bg-[#1a1d24] border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:text-white text-sm"
            />
            <button
              type="submit"
              disabled={searchLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-md transition-colors disabled:opacity-50"
            >
              {searchLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Search"}
            </button>
          </form>
        </div>

        {searchError && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-900/50 text-sm">
            {searchError}
          </div>
        )}

        {searchResult && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Search Result</h2>
              <button onClick={() => setSearchResult(null)} className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">Clear</button>
            </div>
            <StockCard stock={searchResult} />
          </div>
        )}

        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-blue-500" />
            <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Popular Stocks</h2>
          </div>
          <div className="space-y-4">
            {stocks.map(stock => (
              <StockCard key={stock.symbol} stock={stock} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default MarketPage;
