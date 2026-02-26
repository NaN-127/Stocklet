import {
    addToWatchList, removeFromwatchList, getWatchList
} from "../controllers/watchlistController.js"

import express from "express";


import authMiddleware from "../middleware/authMiddleware.js"

const router = express.Router()



router.post("/", authMiddleware, addToWatchList)
router.get("/", authMiddleware, getWatchList)
router.delete("/:symbol", authMiddleware, removeFromwatchList)

export default router