
import Transaction from "../models/Transaction.js";



export const createTransaction = async (req, res) => {
    try{
        const {symbol, type, quantity, price} = req.body;


        const transaction = await Transaction.create({
            user: req.user.id,
            symbol,
            type,
            quantity,
            price
        })

        res.status(201).json({
            message: "Transaction created successfully",
            transaction
        })
    }catch(err){
        res.status(500).json({
            message: "Internal server error" + err.message
        })
    }
}


export const getMyTransaction = async(req, res) => {
    try {
        const transactions = await Transaction.find({user: req.user.id})

        res.status(200).json({
            transactions
        })
    } catch(err) {
        res.status(500).json({ message: "Internal server error: " + err.message })
    }
}


export const getAllTransactions = async(req, res) => {
    try {
        const transactions = await Transaction.find()

        res.status(200).json({
            transactions
        })
    } catch(err) {
        res.status(500).json({ message: "Internal server error: " + err.message })
    }
}


export const approveTransaction = async(req, res) => {
    try{
        const transaction = await Transaction.findById(req.params.id)

        if(!transaction){
            return res.status(404).json({
                message: "Transaction not found"
            })
        }

        transaction.status = "COMPLETED"
        await transaction.save()

        res.status(200).json({
            message: "Transaction approved successfully",
            transaction
        })
    }catch(err){
        res.status(500).json({
            message: "Internal server error" + err.message
        })
    }
}



export const rejectTransaction = async(req, res) => {
    try{
        const transaction = await Transaction.findById(req.params.id)

        if(!transaction){
            return res.status(404).json({
                message: "Transaction not found"
            })
        }

        transaction.status = "CANCELLED"
        await transaction.save()

        res.status(200).json({
            message: "Transaction rejected successfully",
            transaction
        })
    }catch(err){
        res.status(500).json({
            message: "Internal server error" + err.message
        })
    }
}