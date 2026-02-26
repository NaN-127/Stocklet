



const adminMiddleWare = (req, res, next) => {
    if(req.user && req.user.role == "admin"){
        next()
    }else{
        res.status(403).json({
            message: "Admin can only access this route"
        })
    }
}


export default adminMiddleWare