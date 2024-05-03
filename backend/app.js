const express= require("express")
const bodyparser =require("body-parser")
const cors = require("cors")
const backend= require("./router/index")
const app = express()

app.use(express.json())
app.use(bodyparser.json())
app.use(cors())
app.use(express.urlencoded({extended:false}))
app.use(express.static(__dirname))
app.use("/backend", backend)

module.exports=app