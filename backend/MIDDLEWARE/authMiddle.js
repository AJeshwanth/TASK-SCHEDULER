const jwt=require("jsonwebtoken")
exports.auth = (req, res, next) =>{
    try{
        const tokenhead=req.header("Authorization")
        if(!tokenhead){
            return res.status(401).json({Message: "No token access denied"})
        }
        const token=tokenhead.split(" ")[1]
        const decode=jwt.verify(token, "secret key")
        req.user=decode
        next()
    }catch(error){
        return res.status(500).json({Message:"Invalid Token"})
    }
}