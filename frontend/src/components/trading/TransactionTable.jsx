import React from "react";
import { Clock } from "lucide-react";

function TransactionTable({ transactions }) {
  return (
    <div className="bg-white dark:bg-[#1a1d24] border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
      <table className="w-full text-left text-sm">

        <thead className="text-[10px] uppercase text-gray-400 bg-gray-50 dark:bg-gray-800/50">
          <tr>

            <th className="px-6 py-4 font-bold tracking-wider">Asset</th>
            <th className="px-6 py-4 font-bold tracking-wider">Action</th>
            <th className="px-6 py-4 font-bold tracking-wider text-right">Qty</th>
            <th className="px-6 py-4 font-bold tracking-wider">Status</th>
            <th className="px-6 py-4 font-bold tracking-wider text-right">Value</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {transactions.map((tx) => (

            <tr key={tx._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{tx.symbol}</td>
              <td className="px-6 py-4 text-gray-500 dark:text-gray-400">Market {tx.type === "BUY" ? "Buy" : "Sell"}</td>
              <td className="px-6 py-4 text-right font-medium dark:text-gray-300">{tx.quantity}</td>
              <td className="px-6 py-4">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                  tx.status === "COMPLETED"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : tx.status === "PENDING"
                    ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                }`}>
                  {tx.status}
                </span>
              </td>
              <td className="px-6 py-4 text-right font-bold text-gray-900 dark:text-white">
                ${(tx.price * tx.quantity).toLocaleString()}
              </td>
            </tr>
          ))}
          

          {transactions.length === 0 && (
            <tr>
              <td colSpan="5" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                <Clock className="w-6 h-6 mx-auto mb-2 opacity-50" />
                No transactions found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionTable;
