import express from "express"

import {authController, loginController} from "../controllers/authController.js"
import authMiddleware from "../middleware/authMiddleware.js"
import adminMiddleWare from "../middleware/adminMiddleware.js"


const router = express.Router()

router.post("/register", authController)
router.post("/login", loginController)




/*router.get("/profile", authMiddleware, (req, res) => {
    res.json(req.user)
})

router.get("/admin/dashboard", authMiddleware, adminMiddleWare, (req, res) => {
    res.json("Welcome admin")
})*/


export default router