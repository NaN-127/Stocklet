import mongoose from "mongoose"



const transactionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        symbol: {
            type: String,
            required: true,
            uppercase: true
        },

        type: {
            type: String,
            enum: ["BUY", "SELL"],
            required: true
        },

        quantity: {
            type: Number,
            required: true
        },

        price: {
            type: Number,
            required: true
        },

        status: {
            type: String,
            enum: ["PENDING", "COMPLETED", "CANCELLED"],
            default: "PENDING"
        }
    },{
        timestamps: true
    }
)

const Transaction = mongoose.model("Transaction", transactionSchema)

export default Transaction
