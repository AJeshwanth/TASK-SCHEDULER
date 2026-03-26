const user=require("../MODELS/user")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
exports.login = async(req, res)=>{
    try{
        const {email, password}=req.body
        const exists=await user.findOne({email})
        if(!exists){
            return res.status(400).json({"message":"USER DOESN'T EXIST"})
        }else{
            const match=await bcrypt.compare(password, exists.password)
            if (!match){
                return res.status(400).json({"message": "INVALID PASSWORD"})
            }
            const token=jwt.sign(
                {id:exists._id},
                "secret key",
                {expiresIn : "1h"}
            );
            return res.json({token});
        }
    }catch(error){
        res.status(500).json({"message": "BAD REQUEST"})
    };
};
exports.signup = async(req, res) =>{
    try{
        console.log(req.body)
        const {name, email, password}=req.body
        const exists=await user.findOne({email})
        if(exists){
            return res.status(400).json({"Message" : "USER ALREADY EXISTS"})
        }
        const hash=await bcrypt.hash(password, 10)
        await user.create({
            name,
            email,
            password:hash
        });
        res.status(200).json({"message": "USER SUCCESSFULLY REGISTERED"})
    }catch(error){
        res.status(500).json({"message": "BAD REQUEST"})
    };
    
}