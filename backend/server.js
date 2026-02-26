import expresss from "express"
import cors from "cors"
import dotenv from "dotenv"
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js"

import stockRoutes from "./routes/stockRoutes.js"

import transactionRoutes from "./routes/transactionRoutes.js"

import watchlistRoutes from "./routes/watchlistRoutes.js"

dotenv.config();
connectDB()
const app = expresss();




app.use(cors());

app.use(expresss.json());



app.use("/api/auth", authRoutes)

app.use("/api/stocks", stockRoutes)

app.use("/api/transactions", transactionRoutes)

app.use("/api/watchlist", watchlistRoutes)

const PORT = process.env.PORT || 8000;


app.listen(PORT, () => console.log(`Server running on port ${PORT}`))