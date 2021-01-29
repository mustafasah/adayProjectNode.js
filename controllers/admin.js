const CustomError = require("../helpers/CustomError")
const asynchandler = require("express-async-handler")
const User = require("../models/User")


const admin = asynchandler ( async (req,res,next) => {

    res
    .status(200)
    .json({
        success : true,
        message : "Admin Sayfası",
    })

})


const blockUser = asynchandler ( async (req,res,next) => {

    user = await User.findById(req.params.id)

    user.blocked = !user.blocked

    await user.save()

    return res
    .status(200)
    .json({
        success : true,
        message : "User Blocklandı/Block Kaldırıldı",
    })

})

const deleteUser = asynchandler ( async (req,res,next) => {

    user = await User.findById(req.params.id)

    await user.remove()

    res
    .status(200)
    .json({
        success : true,
        message : "User Silindi",
    })

})

module.exports = {admin,blockUser,deleteUser}