import express from "express";
import { getAllUsers, deleteUser } from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleWare from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, adminMiddleWare, getAllUsers);
router.delete("/:id", authMiddleware, adminMiddleWare, deleteUser);

export default router;
