const messageCtrl=require("../controller/messageCtrl")
const express=require("express")
const router=express.Router()
const authMiddleware=require("../middleware/authMiddleware")

router.post("/message",authMiddleware,messageCtrl.addMessage)
router.get("/message/:chatId",authMiddleware,messageCtrl.getMessage)
router.delete("/message/:messageId",authMiddleware,messageCtrl.deleteMessage)
router.put("/message/:messageId", authMiddleware, messageCtrl.updateMessage);


module.exports=router
