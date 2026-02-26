import express from "express"


import authMiddleware from "../middleware/authMiddleware.js"

import getStockBySymbol from "../controllers/stockController.js"

const router  = express.Router()



router.get("/:symbol", authMiddleware, getStockBySymbol)

export default router