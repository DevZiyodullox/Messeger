const usereCtrl=require("../controller/userCtrl")
const router=require("express").Router()
const authMiddleware=require("../middleware/authMiddleware")

router.get("/user",usereCtrl.getAll)
router.get("/user/:id",usereCtrl.getOne)
router.delete("/user/:id",authMiddleware,usereCtrl.deleteUser)
router.put("/user/:id",authMiddleware,usereCtrl.updateUser)

module.exports=router


