const User =require("../model/userModel")
const bcrypt=require("bcrypt")
const JWT=require("jsonwebtoken")

const JWT_SECRET_KEY =process.env.JWT_SECRET_KEY
const authCtrl={

    signup:async (req,res)=>{
      try {
  const {firstname ,lastname,email}=req.body

if(!firstname||!lastname||!email||!req.body.password){
    return res.status(403).json({message:""})
}
const oldUser= await User.findOne({email})
if(oldUser){
    return res.status(400).json({message:""})
}
const hashPassword=await bcrypt.hash(req.body.password,10)
req.body.password=hashPassword
if(req.body.role){
  req.body.role=Number(req.body.role)
}
const user=new User(req.body)
await user.save()
const {password,...other}=user._doc
const token =JWT.sign(other,JWT_SECRET_KEY)//{expiresIn:"24h"}
res.status(201).json({message:"signup ",user:other,token})


} catch (error) {
    console.log(error);
    res.status(403).json({message: error.message})
    
}},
  
    login: async (req, res) => {
        try {
          const { email, password } = req.body;

          if (!email || !password) {
            return res.status(403).send({ message: "" });
          }
          const user = await User.findOne({ email });
          if (!user) {
            return res.status(400).send({ message: "" });
          }
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            return res.status(400).send({ message: "" });
          }
          delete user._doc.password;

          const token = JWT.sign(user._doc, process.env.JWT_SECRET_KEY);

          res.status(200).send({ message: "Login success", user: user._doc, token });

        } catch (error) {
          console.log(error);
          res.status(403).send({ message: error.message });
        }
      },
}

module.exports=authCtrl