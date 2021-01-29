const express  = require("express")
const candidate = require("./candidate")
const auth     = require("./auth")
const user     = require("./user")
const admin    = require("./admin")


const router = express.Router()

// router.get("/",(req,res,next)=>{
//     res.send("Api Ana sayfası")
// })

router.use("/candidate",candidate)
router.use("/auth",auth)
router.use("/user",user)
router.use("/admin",admin)


module.exports = router