const express= require("express")
const router =express.Router()
const userController=require("../controller/login")
const isAuth = require("../midelware/auth");

router.post("/login", userController.login)
router.post("/signup", userController.register)
router.get("/users",isAuth, userController.getAllUser)
router.get("/self/user",isAuth, userController.getselfUser)


module.exports = router;