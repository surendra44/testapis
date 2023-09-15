const express = require("express")
const memberController = require('../controllers/memberController')
const uploads = require("../middlewares/uploadfile")

const router = express.Router()

router.get('/getAdmin', memberController.getAdmins)

router.get('/getMembers', memberController.getMembers)
router.post('/createMember',uploads.upload, memberController.createMember )
router.put('/editMember',memberController.editMember )

router.get('/loadIdCard/:id', memberController.loadIdCard)
router.get('/generateIdCard', memberController.generateIdCard)

module.exports = router