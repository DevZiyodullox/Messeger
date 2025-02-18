const chatCtrl=require("../controller/chatCtrl")
const authMiddlewere = require("../middleware/authMiddleware")
const router=require("express").Router()

router.get("/chat/:firstId/:secondId",authMiddlewere, chatCtrl.findChat)
router.get("/chat",authMiddlewere, chatCtrl.userChat)
router.delete("/chat/:chatId",authMiddlewere, chatCtrl.deleteChat)


module.exports=router

//  678eca029a30910fccba0a70 
// 678eca7e9a30910fccba0a76
