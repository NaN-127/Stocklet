import jwt from "jsonwebtoken"
import User from "../models/User.js"



const authMiddleware = async(req, res, next) => {
    let token



    if(req.headers && req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        token = req.headers.authorization.split(" ")[1]
    }


    if(!token){
        return res.status(401).json({
            "message": "Unauthorized"
        })
    }


    try{
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        req.user = await User.findById(decode.id).select("-password")
        next()

    }catch(err){
        res.status(401).json({
            message: "Token Invalid"
        })
    }
}


export default authMiddleware