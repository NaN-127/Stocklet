import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Bookmark, BookmarkMinus, ShieldCheck, TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import ChartComponent from "../components/stock/ChartComponent";

function StockDetailsPage() {
  const { symbol: urlSymbol } = useParams();
  const { user, watchlist, addToWatchlist, removeFromWatchlist } = useAuth();

  const [stock, setStock] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("30D");
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [tradeLoading, setTradeLoading] = useState(false);
  const [tradeMessage, setTradeMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (!urlSymbol) return;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setStock(null);
      setHistory([]);
      const days = period === "30D" ? 30 : period === "7D" ? 7 : 1;
      const sym = urlSymbol.toUpperCase();
      try {
        const quoteRes = await api.get(`/stocks/${sym}`);
        setStock(quoteRes.data);
        const histRes = await api.get(`/stocks/history/${sym}?days=${days}`);
        setHistory(histRes.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load stock. Check the symbol or try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [urlSymbol, period]);

  const handleTrade = async (type) => {
    const qty = Number(quantity);
    if (!qty || qty <= 0) {
      setTradeMessage({ type: "error", text: "Enter a valid quantity." });
      return;
    }
    setTradeLoading(true);
    setTradeMessage({ type: "", text: "" });
    try {
      await api.post("/transactions", {
        symbol: stock.symbol,
        type,
        quantity: qty,
        price: stock.price,
      });
      setTradeMessage({ type: "success", text: `${type} request submitted and pending approval.` });
      setQuantity("");
    } catch (err) {
      setTradeMessage({ type: "error", text: err.response?.data?.message || "Transaction failed." });
    } finally {
      setTradeLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-[#0f1115]">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || !stock) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-[#0f1115] text-gray-500 p-6 gap-4">
        <p className="text-sm">{error || "Stock not found."}</p>
      </div>
    );
  }

  const isPositive = Number(stock.changePercent) >= 0;
  const isWatchlisted = watchlist && watchlist.includes(stock.symbol);
  const estimatedTotal = (Number(quantity) * stock.price).toFixed(2);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-[#0f1115] transition-colors duration-200">
      <div className="max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8 space-y-6">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-300 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">NASDAQ</span>
              <span className="text-gray-500 font-semibold text-sm">{stock.symbol} Inc.</span>
            </div>
            <div className="flex items-baseline gap-4">
              <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight uppercase">{stock.symbol}</h1>
              <div>
                <span className={`text-xl font-bold flex items-center ${isPositive ? "text-green-500" : "text-red-500"}`}>
                  {isPositive ? <TrendingUp className="w-5 h-5 inline mr-1" /> : <TrendingDown className="w-5 h-5 inline mr-1" />}
                  ${stock.price.toFixed(2)}
                </span>
                <span className={`text-sm font-semibold block ${isPositive ? "text-green-500" : "text-red-500"}`}>
                  {isPositive ? "+" : ""}{stock.changePercent}% Today
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-8 bg-white dark:bg-[#1a1d24] p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Open</p>
              <p className="font-bold text-gray-900 dark:text-white">${stock.previousClose.toFixed(2)}</p>
            </div>
            <div className="hidden sm:block">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Day High</p>
              <p className="font-bold text-gray-900 dark:text-white">${stock.high.toFixed(2)}</p>
            </div>
            <div className="hidden sm:block">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Day Low</p>
              <p className="font-bold text-gray-900 dark:text-white">${stock.low.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Volume</p>
              <p className="font-bold text-gray-900 dark:text-white">52.4M</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-[#1a1d24] border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Price Performance</h3>
              <ChartComponent history={history} period={period} onPeriodChange={setPeriod} strokeColor="#3b82f6" />
            </div>

            <div className="bg-white dark:bg-[#1a1d24] border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="flex items-center gap-2 font-bold text-gray-900 dark:text-white">
                  <Bookmark size={16} className="text-blue-500" /> My Watchlist
                </h3>
                <button
                  onClick={() => isWatchlisted ? removeFromWatchlist(stock.symbol) : addToWatchlist(stock.symbol)}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:text-blue-700 transition-colors"
                >
                  {isWatchlisted ? <BookmarkMinus size={14} /> : <Bookmark size={14} />}
                  {isWatchlisted ? "Remove" : "Quick Add"}
                </button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {watchlist?.length > 0
                  ? `You have ${watchlist.length} symbol${watchlist.length > 1 ? "s" : ""} tracked.`
                  : "Your watchlist is empty. Add this asset to track it later."}
              </p>
            </div>
          </div>

          <div>
            <div className="bg-white dark:bg-[#1a1d24] border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-xl text-gray-900 dark:text-white">Trade Stock</h3>
                <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">Live</span>
              </div>

              {tradeMessage.text && (
                <div className={`p-3 mb-6 rounded-lg text-xs font-semibold border ${
                  tradeMessage.type === "error"
                    ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-900"
                    : "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-900"
                }`}>
                  {tradeMessage.text}
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Enter Quantity</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="0"
                      className="w-full text-right pr-20 pl-4 py-4 text-2xl font-bold bg-gray-50 dark:bg-[#0f1115] border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-colors"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400 uppercase tracking-wider">Shares</span>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-[#0f1115] border border-gray-100 dark:border-gray-800 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Market Price</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">${stock.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Estimated Total</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">${estimatedTotal}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={() => handleTrade("BUY")}
                    disabled={tradeLoading || !user}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-colors disabled:opacity-50"
                  >
                    {tradeLoading ? <RefreshCw className="w-5 h-5 animate-spin mx-auto" /> : `Buy ${stock.symbol}`}
                  </button>
                  <button
                    onClick={() => handleTrade("SELL")}
                    disabled={tradeLoading || !user}
                    className="w-full bg-white dark:bg-[#1a1d24] border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-white font-bold py-3.5 rounded-xl transition-colors disabled:opacity-50"
                  >
                    {tradeLoading ? <RefreshCw className="w-5 h-5 animate-spin mx-auto" /> : `Sell ${stock.symbol}`}
                  </button>
                </div>


              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StockDetailsPage;