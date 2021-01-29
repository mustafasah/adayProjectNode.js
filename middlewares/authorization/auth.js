const CustomError = require("../../helpers/CustomError")
const jwt = require("jsonwebtoken")
const {isTokenIncluded,getAccessFromHeader} = require("../../helpers/tokenHelpers")
const asynchandler = require("express-async-handler")
const User = require("../../models/User")
const Candidate = require("../../models/Candidate")


const getAccessToRoute = (req,res,next) => {

        if (!isTokenIncluded(req)) {
            next(new CustomError("Erişiminiz yok.(Lütfen Oturum Açın)",401))
        }

        // const accessToken = getAccessFromHeader(req)
        const accessToken = req.cookies.access_token

        jwt.verify(accessToken,process.env.JWT_SECRET_KEY,(err,decoded)=>{
            
            if(err){
                next(new CustomError("Bu sayfaya erişiminiz yok.(Süresi dolmuş token)",401))
            }

            return req.user = {
                id : decoded.id,
                name : decoded.name
            }
            
        })
        next()
}

const getAdminAccess = asynchandler(async(req,res,next) => {
    const {id} = req.user

    const user = await User.findById(id)

    if (user.role !== "admin") {
        return next(new CustomError("Sadece adminler bu sayfaya erişebilir",403))
    }
    
    next()
})

const getCandidateOwnerAccess = asynchandler(async(req,res,next) => {

    const userId = req.user.id
    const candidateId = req.params.id

    const candidate = await Candidate.findById(candidateId)

    if (candidate.user != userId) {
        return next(new CustomError("Sadece Adayı ekleyen bu sayfaya erişebilir",403))
    }

    next()
})

module.exports = {
    getAccessToRoute,
    getAdminAccess,
    getCandidateOwnerAccess
}