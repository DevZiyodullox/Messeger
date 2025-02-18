const Message=require("../model/messageModel")
const fs=require("fs")
const path=require("path")
const {v4}=require("uuid")
const messageCtrl={
//
addMessage:async(req,res)=>{
try {
    const {chatId,senderId,text}=req.body
    if(!chatId||!senderId||!text){
        return res.status(404).json({message:"Invalid credent"})
    }
    if(req.files){
        const {image}=req.files
        const format=path.extname(image.name)
        if(format!==".png" && format!==".jpg" &&format!==".jpeg"){
return res.status(403).json({ message: "file format trash"})   
        }
        const nameImg= v4()+format
        image.mv(path.join(__dirname,"../","public",nameImg),(err)=>{
            if(err)throw err
        })
        req.body.file=nameImg
       

      } //end files 
         
      const message=new Message(req.body)
      await message.save()

        return res.status(201).json({message:" Message created" ,newMessage:message})





} catch (error) {
    res.status(503).send({message:error.message})
}

},
getMessage:async(req,res)=>{
try {
   const {chatId}=req.params
   const messages=await Message.find({chatId})
   return res.status(200).json({message:"chat a message",messages})




} catch (error) {res.status(503).send({message:error.message})}

},
deleteMessage:async(req,res)=>{
try {
   const {messageId}=req.params
   const message = await Message.findById(messageId)
   if(!message){
    return res.status(404).send({message:"Message is not found"})
   }
if(req.user._id== message.senderId||req.userIsAdmin){
    await message.deleteOne()
}
  if(message.file!=""){
    fs.unlink(path.join(__dirname,"../","public",message.file),(err)=>{
        if(err)throw err
    })
                }

 res.status(200).send({message:"message deleted " ,deleteMessage:message})
   




} catch (error) {res.status(503).send({message:error.message})}

},
updateMessage: async (req, res) => {
    try {
      const { messageId } = req.params;
      const { text } = req.body;
      const message = await Message.findById(messageId);
      if (!message) {
        return res.status(404).send({ message: "Message not found" });
      }
      if (req.user._id == message.senderId || req.userIsAdmin) {
        if (req.files) {
          const { image } = req.files;
          const format = path.extname(image.name);
          if (format !== ".png" && format !== ".jpg" && format !== ".jpeg") {
            return res.status(403).json({ message: "File format not supported" });
          }
          if (message.file != "") {
            fs.unlink(path.join(__dirname, "../", "public", message.file), (err) => {
              if (err) throw err;
            });
          }
          const nameImg = v4() + format;
          image.mv(path.join(__dirname, "../", "public", nameImg), (err) => {
            if (err) throw err;
          });
          message.file = nameImg;
        }
        if (text) {
          message.text = text;
        }
        await message.save();
        res.status(200).send({ message: "Message updated", updatedMessage: message });
      } else {
        res.status(403).send({ message: "Unauthorized" });
      }
    } catch (error) {
      res.status(503).send({ message: error.message });
    }
  },





}
module.exports=messageCtrl