const User = require("../../models/User")
const Candidate = require("../../models/Candidate")
const CustomError = require("../../helpers/CustomError")
const asynchandler = require("express-async-handler")

const existIdChecker = asynchandler ( async (req,res,next) => {

    const userId = req.params.id

    const user = await User.findById(userId)

    if (!user) {
        return next(new CustomError("'ID' bulunamadı.",400))
    }

    next()

})


const existCandidateChecker = asynchandler ( async (req,res,next) => {

    const {id} = req.params

    const candidate = await Candidate.findById(id)

    if (!candidate) {
        return next(new CustomError("Aday bulunamadı.",400))
    }

    next()

})

module.exports = {existIdChecker,existCandidateChecker}