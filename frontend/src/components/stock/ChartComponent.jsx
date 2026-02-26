import React from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Activity } from "lucide-react";

function ChartComponent({ history, period, onPeriodChange, strokeColor, fillColor }) {
  const color = strokeColor || "#10b981";
  const gradientId = "chartGradient";

  return (

    <div className="h-[300px] mt-4 relative">
        
      <div className="absolute top-0 right-0 z-10 flex gap-1 bg-gray-100/50 dark:bg-gray-800/50 p-1 rounded-lg">
        {["1D", "7D", "30D"].map((p) => (
          <button
            key={p}

            onClick={() => onPeriodChange(p)}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              period === p
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {history.length > 0 ? (

        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={history} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
            <defs>

              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" hide />
            <YAxis domain={["auto", "auto"]} hide />
            <Tooltip

              contentStyle={{ backgroundColor: "#1a1d24", border: "none", borderRadius: "8px", color: "#fff", fontSize: "12px" }}
              itemStyle={{ color: color, fontWeight: "bold" }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={color}
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#${gradientId})`}

            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400 border border-dashed rounded-xl dark:border-gray-800">
          <Activity className="w-5 h-5 mr-2 opacity-50" /> Building chart...
        </div>
      )}
    </div>
  );
}

export default ChartComponent;
