import express from "express"
import { getStockBySymbol, getHistoricalData } from "../controllers/stockController.js"

const router = express.Router()

router.get("/history/:symbol", getHistoricalData)
router.get("/:symbol", getStockBySymbol)

export default router