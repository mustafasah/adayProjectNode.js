const User = require("../models/User")
const Candidate = require("../models/User")
const CustomError = require("../helpers/CustomError")
const asynchandler = require("express-async-handler")
const { sendTokenToCookie } = require("../helpers/tokenHelpers")
const {inputDogrula,comparePassword} = require("../helpers/inputhelpers")
const sendMail = require("../helpers/sendMail")


const register = asynchandler ( async (req,res,next) => {

        const {name,email,password,role} = req.body

        user = await User.create({
            name,
            email,
            password,
            role
        })
        
        sendTokenToCookie(user,res)

})

const login = asynchandler ( async (req,res,next) => {

    const {email,password} = req.body

    if (!inputDogrula(email,password)) {
        return next(new CustomError("Lütfen tüm Alanları doldurun",400))
    }

    const user = await User.findOne({email}).select("+password")

    if (!user) {
        return next(new CustomError("Kayıtlı mail adresi bulunamadı",400))
    }

    if (!comparePassword(password,user.password)) {
        return next(new CustomError("Yanlış parola girdiniz",400))
    }

     sendTokenToCookie(user,res)

})

const logout = asynchandler ( async (req,res,next) => {

    res
    .status(200)
    .clearCookie("access_token")
    .json({
        success : true,
        message : "Çıkış tamamlandı"
    })

})

const getUser = (req,res,next) => {
    res.json({
        success:true,
        data: req.user
    })
}

const imageUpload = asynchandler ( async (req,res,next) => {

    // const user = await Candidate.findByIdAndUpdate(req.user.id,{
    //     "profile_image" : req.savedProfileImage
    // },{
    //     new : true,
    //     runValidators : true
    // })

    const user = await User.findByIdAndUpdate(req.user.id,{
        "profile_image" : req.savedProfileImage
    },{
        new : true,
        runValidators : true
    })

    res.status(200)
    .json({
        success:true,
        message:"Resim Yükleme Başarılı",
        data : user
    })

})

const forgotpassword = asynchandler ( async (req,res,next) => {

    const resetlenecekEmail = req.body.email  

    const user = await User.findOne({ email : resetlenecekEmail })

    if (!user) {
        return next(new CustomError("Kayıtlı mail adresi bulunamadı",400))
    }

    const resetPasswordToken = user.getResetPasswordTokenFromUser()

    await user.save()

    const resetPasswordUrl = `${process.env.SERVER_URL}/api/auth/resetpassword?resetPasswordToken=${resetPasswordToken}`

    const emailTemplate = `<h3>Reset Password</h3>
    <h4><p>Bu <a href = '${resetPasswordUrl}' target = '_blank'>Link</a> 1 saat geçerlidir</p></h4>`

    try {
        await sendMail({
            // from : process.env.SMTP_USER,
            from : "mustafasahin.25@hotmail.com",
            to : resetlenecekEmail,
            subject : "Parolanızı Sıfırlama Talebi",
            html : emailTemplate
        })

        return res.status(200)
        .json({
            success: true,
            message: "Sıfırlama linki mail adresinize gönderildi",
            data : user
        })
    }
    catch (err) {
        user.resetPasswordToken  = undefined
        user.resetPasswordExpire = undefined

        await user.save()

        return next(new CustomError("Email Gönderilemedi",500))
    }
})

const resetPassowrd = asynchandler ( async (req,res,next) => {

    // const {resetPasswordToken} = req.query
    const resetPasswordToken = req.headers.referer.split("=")[1]
    const {password} = req.body

    if (!resetPasswordToken) {
        return next(new CustomError("Lütfen bir parola girin"),400)
    }

    let user = await User.findOne({
        resetPasswordToken : resetPasswordToken,
        resetPasswordExpire : { $gt: Date.now() }
    })
    
    if (!user) {
        return next(new CustomError("Yanlış token veya süresi bitmiş",404))
    }

    user.password = password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save()

    return res
    .status(200)
    .json({
        success : true,
        message : "Parolanız sıfırlanmıştır."
    })

})

const editUser = asynchandler ( async (req,res,next) =>{

    const editlenecekObjeler = req.body

    const user = await User.findByIdAndUpdate(req.user.id,editlenecekObjeler,{
        new : true,
        runValidators : true
    })


    return res
    .status(200)
    .json({
        success: true,
        message: "Güncellendi"
    })
})

// const hatatestfonk = (req,res,next) => {
//    next(new SyntaxError("SyntaxError Message : HATA!", 400))
// }

module.exports = {
    register,
    getUser,
    logout,
    login,
    imageUpload,
    forgotpassword,
    resetPassowrd,
    editUser
}