const authCtrl=require("../controller/authCtrl")
const router=require("express").Router()

router.post("/signup",authCtrl.signup)
router.post("/login",authCtrl.login)

module.exports=router
