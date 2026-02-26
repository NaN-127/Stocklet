import User from "../models/User.js";

import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

import dotenv from "dotenv"

dotenv.config()

const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    )
}

const authController = async (req, res) => {
    try{
        const {name, email, password} = req.body;

        if(!name || !email || !password){
            return res.status(400).json({message: "All fields are required"})
        }

        const userExists = await User.findOne({email})

        if(userExists){
            return res.status(400).json({
                "messsage": "User Already Exists"
            })
        }

        const user = await User.create({
            name,
            email,
            password
        })

        res.status(201).json({
            "message": "User Created Successfully",
            "_id":  user._id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            
        })

    }catch(err){
        console.log(err);
        res.status(500).json({message: "Internal server error" + err.message})
    }
}


const loginController = async (req, res) => {
    try {
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                "message": "All fields are required"
            })
        }

        const user = await User.findOne({email})

        if(!user){
            return res.status(400).json({
                "message": "Invalid User"
            })
        }



        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            return res.status(400).json({
                "message": "Invalid Password"
            })
        }


        res.status(200).json({
            "message": "Login Successful",
            "_id": user._id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "token": generateToken(user)
        })

    }catch(err){
        return res.status(500).json({message: "Internal server error" + err.message})
    }
}


export {authController, loginController}