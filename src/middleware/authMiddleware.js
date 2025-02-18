const User =require("../model/userModel")
const bcrypt=require("bcrypt")
const JWT=require("jsonwebtoken")
const JWT_SECRET_KEY=process.env.JWT_SECRET_KEY

const authMiddleware=(req,res,next)=>{
    let token =req.headers.token 
    if(!token ){
        res.status(401).send({message:"token must be required"})
    }
    try {
        const decodeUser=JWT.verify(token,JWT_SECRET_KEY)
       req.user=decodeUser
       if(decodeUser.role==101){
        req.userIsAdmin=true
       }
       next()
    } catch (error) {
        res.status(503).send({message:error.message})
        
    }
}
module.exports=authMiddleware