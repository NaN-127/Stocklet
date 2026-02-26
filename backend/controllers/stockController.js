import axios from "axios";

export const getStockBySymbol = async (req, res) => {
  try {
    const symbol = req.params.symbol.toUpperCase();

    const response = await axios.get("https://finnhub.io/api/v1/quote", {
      params: {
        symbol: symbol,
        token: process.env.STOCK_API_KEY,
      },
    });

    const stockData = response.data;

    if (!stockData || stockData.c === 0) {
      return res.status(404).json({ message: "Stock not found" });
    }

    res.json({
      symbol,
      price: stockData.c,
      high: stockData.h,
      low: stockData.l,
      previousClose: stockData.pc,
      changePercent: stockData.dp || Number(((stockData.c - stockData.pc) / stockData.pc * 100).toFixed(2)),
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const getHistoricalData = async (req, res) => {
  try {
    const symbol = req.params.symbol.toUpperCase();
    const days = parseInt(req.query.days) || 30;

    const response = await axios.get("https://finnhub.io/api/v1/quote", {
      params: {
        symbol: symbol,
        token: process.env.STOCK_API_KEY,
      },
    });

    const currentPrice = response.data.c || 150;

    const history = [];
    let virtualPrice = currentPrice * (1 - (Math.random() * 0.1 - 0.05));

    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      const change = virtualPrice * (Math.random() * 0.04 - 0.02);
      virtualPrice += change;

      if (i === 0) {
        virtualPrice = currentPrice;
      }

      history.push({
        date: date.toISOString().split("T")[0],
        price: Number(virtualPrice.toFixed(2)),
      });
    }

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export default getStockBySymbol;