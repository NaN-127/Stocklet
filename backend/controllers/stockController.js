import axios from "axios"

const getStockBySymbol = async (req, res, next) => {
  try {


    const symbol = req.params.symbol.toUpperCase()

    const response = await axios.get(
      "https://finnhub.io/api/v1/quote",
      {
        params: {
          symbol: symbol,
          token: process.env.STOCK_API_KEY,
        },

      }
    )

    const stockData = response.data

    if (!stockData || stockData.c === 0) {
      return res.status(404).json({
        message: "Stock not found",
      })
    }

    res.json({
      symbol,
      price: stockData.c,
      high: stockData.h,
      low: stockData.l,
      previousClose: stockData.pc,

    })
  } catch (error) {
    
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    })
  }
}

export default getStockBySymbol