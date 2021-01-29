const express = require("express")
const {addCandidate,getAllCandidates,getCandidate,editCandidate,deleteCandidate,acceptCandidate,acceptCancel,getAllComingCandidates} = require("../controllers/candidate")
const { getAccessToRoute,getCandidateOwnerAccess } = require("../middlewares/authorization/auth")
const { existCandidateChecker } = require("../middlewares/database/databaseErrorHelpers")

const router = express.Router()

router.get("/",getAllCandidates)
router.get("/comingcandidates",getAllComingCandidates)
router.post("/addcandidate",getAccessToRoute,addCandidate)
router.get("/:id",existCandidateChecker,getCandidate)
router.put("/:id/edit",[getAccessToRoute,existCandidateChecker,getCandidateOwnerAccess],editCandidate)
router.delete("/:id/delete",[getAccessToRoute,existCandidateChecker,getCandidateOwnerAccess],deleteCandidate)
router.get("/:id/accepted",[getAccessToRoute,existCandidateChecker],acceptCandidate)
router.get("/:id/acceptCancel",[getAccessToRoute,existCandidateChecker],acceptCancel)



module.exports = router