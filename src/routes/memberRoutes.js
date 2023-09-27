const express = require("express")
const memberController = require('../controllers/memberController')
// const uploads = require("../middlewares/uploadfile")
// const verifyToken = require("../models/tokenVerify")

const router = express.Router()

router.get('/getMembers', memberController.getMembers)
router.get('/loadIdCard/:id', memberController.loadIdCard)
router.get('/generateIdCard/:id', memberController.generateIdCard)

module.exports = router