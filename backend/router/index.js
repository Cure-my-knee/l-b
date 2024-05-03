const express =require("express")
const router = express.Router()
const user=require("./user")
const userdata=require("./userdata")

router.use( user)
router.use( userdata)


module.exports=router