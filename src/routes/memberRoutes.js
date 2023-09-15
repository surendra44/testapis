const express = require("express")
const memberController = require('../controllers/memberController')

const router = express.Router()


router.get('/getAdmin', memberController.getAdmins)

router.get('/getMembers', memberController.getMembers)
router.post('/createMember',memberController.createMember )
router.put('/editMember',memberController.editMember )


router.get('/loadIdCard', memberController.loadIdCard)
router.get('/generateIdCard', memberController.generateIdCard)

module.exports = router