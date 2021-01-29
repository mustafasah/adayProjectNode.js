const CustomError = require("../helpers/CustomError")
const asynchandler = require("express-async-handler")
const Candidate = require("../models/Candidate")

const addCandidate = asynchandler ( async (req,res,next) => {

    const information = req.body

    const candidate = await Candidate.create({
        ...information,
        user : req.user.id
    })

    res
    .status(200)
    .json({
        success : true,
        data: candidate
    })
})


const getAllCandidates = asynchandler ( async (req,res,next) => {

    const allCandidates = await Candidate.find()
    const populate = true
    const populateValue = "user"

    res
    .status(200)
    .json({
        success : true,
        data: allCandidates
    })
})

const getAllComingCandidates = asynchandler ( async (req,res,next) => {

    const allCandidates = await Candidate.find({alarm: { $gte: Date.now() } })

    res
    .status(200)
    .json({
        success : true,
        data: allCandidates
    })
})


const getCandidate = asynchandler ( async (req,res,next) => {

    const {id} = req.params

    const candidate = await Candidate.findById(id)
    .populate(
        {
            path:"user",
            select:"name profile_image"
        }
    )

    res
    .status(200)
    .json({
        success : true,
        data: candidate
    })
})


const editCandidate = asynchandler ( async (req,res,next) => {

    const {id} = req.params
    const {name,no} = req.body

    const candidate = await Candidate.findById(id)

    candidate.name = name
    candidate.no = no

    await candidate.save()

    return res
    .status(200)
    .json({
        success : true,
        data: candidate
    })
})

const deleteCandidate = asynchandler ( async (req,res,next) => {

    const {id} = req.params

    await Candidate.findByIdAndDelete(id)

    return res
    .status(200)
    .json({
        success : true,
        data: "Candidate Silindi"
    })
})

const acceptCandidate = asynchandler ( async (req,res,next) => {

    const {id} = req.params

    const candidate = await Candidate.findById(id)


    if (candidate.accepteds.includes(req.params.id)) {
        return next (new CustomError("Zaten Onaylanmış",400))
    }

    candidate.accepteds.push(req.params.id)

    await candidate.save()

    return res
    .status(200)
    .json({
        success : true,
        data: candidate
    })
})

const acceptCancel = asynchandler ( async (req,res,next) => {

    const {id} = req.params

    const candidate = await Candidate.findById(id)

    if (!candidate.accepteds.includes(req.params.id)) {
        return next (new CustomError("Zaten Onay geri çekmişsiniz",400))
    }

    const index = candidate.accepteds.indexOf(req.user.id)

    candidate.accepteds.splice(index,1)

    await candidate.save()

    return res
    .status(200)
    .json({
        success : true,
        data: candidate
    })
})


module.exports = {
    addCandidate,
    getAllCandidates,
    getCandidate,
    editCandidate,
    deleteCandidate,
    acceptCandidate,
    acceptCancel,
    getAllComingCandidates
}