import React from "react";
import { Link } from "react-router-dom";
import { TrendingUp, TrendingDown, Plus } from "lucide-react";

function StockCard({ stock }) {
  const isPositive = Number(stock.changePercent) >= 0;

  return (
    <div className="bg-white dark:bg-[#1a1d24] rounded-xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6 mb-8 border-b border-gray-100 dark:border-gray-800 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xl font-bold">
            {stock.symbol.charAt(0)}
          </div>
          <div>

            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white uppercase">{stock.symbol}</h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">NASDAQ</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">US Equity</p>
          </div>
        </div>
        <Link

          to={`/stocks/${stock.symbol}`}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors text-sm w-fit"
        >
          <Plus className="w-4 h-4" /> Trade
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">

        <div>
          <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 tracking-wider uppercase mb-1">Price</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">${stock.price.toFixed(2)}</h3>
            <span className={`text-sm font-semibold flex items-center ${isPositive ? "text-green-500" : "text-red-500"}`}>
              {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
              {isPositive ? "+" : ""}{stock.changePercent}%
            </span>
          </div>
        </div>
        <div>

          <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 tracking-wider uppercase mb-1">Day High</p>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">${stock.high.toFixed(2)}</h3>
        </div>
        <div>

          <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 tracking-wider uppercase mb-1">Day Low</p>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">${stock.low.toFixed(2)}</h3>
        </div>
        <div>
            
          <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 tracking-wider uppercase mb-1">Previous Close</p>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">${stock.previousClose.toFixed(2)}</h3>
        </div>
      </div>
    </div>
  );
}

export default StockCard;
