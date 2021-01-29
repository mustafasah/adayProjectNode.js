const User = require("../models/User")


const sendTokenToCookie = (user,res) =>{

    const token = user.generateJwtFromUser()

    const {JWT_COOKIE,NODE_ENV} = process.env

    res
    .status(200)
    .cookie("access_token",token,{
        expires : new Date(Date.now() + parseInt(JWT_COOKIE) * 1000 * 60),
        // httpOnly: true,
        httpOnly: false,
        // secure : NODE_ENV === "development" ? false : true
        secure : false

    })
    .json({
        success : true,
        access_token: token,
        data : {
            name : user.name,
            email: user.email,
            profile_image: user.profile_image
        }
    })

}

const isTokenIncluded = (req) => {
    console.log(req);
    return req.headers.cookie && req.headers.cookie.startsWith("access_token=")
}

// const getAccessFromHeader = (req) =>{
//     const authorization = req.header.cookie
//     console.log(authorization);
//     const access_token = authorization.split("=")[1]
//     return access_token
    
// }

module.exports = {
    sendTokenToCookie,
    isTokenIncluded,
    // getAccessFromHeader
}