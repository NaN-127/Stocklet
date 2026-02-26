import {
    createTransaction,
    getMyTransaction,
    getAllTransactions,
    approveTransaction,
    rejectTransaction
} from "../controllers/transactionController.js"

import express from "express";

import authMiddleware from "../middleware/authMiddleware.js"
import adminMiddleware from "../middleware/adminMiddleware.js"

const router = express.Router()

router.post("/", authMiddleware, createTransaction)
router.get("/my-transactions", authMiddleware, getMyTransaction)
router.get("/", authMiddleware, adminMiddleware, getAllTransactions)
router.put("/:id/approve", authMiddleware, adminMiddleware, approveTransaction)
router.put("/:id/reject", authMiddleware, adminMiddleware, rejectTransaction)

export default router