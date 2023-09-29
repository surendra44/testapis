const express = require("express")
const memberController = require('../controllers/memberController')
const adminController = require('../controllers/adminController')
const uploads = require("../middlewares/uploadfile")
const verifyToken = require("../middlewares/tokenVerify")

const router = express.Router()

router.post('/login', adminController.login)
router.post('/signup', adminController.signup)

router.get('/getAdmin', adminController.getAdmins)
router.get('/getEvent', adminController.getEvents)
router.post('/createMember', uploads.upload,  verifyToken.verifyToken,  memberController.createMember )
router.post('/createEvent', uploads.upload,  verifyToken.verifyToken,  adminController.createEvent )
router.put('/editMember', verifyToken.verifyToken, memberController.editMember )

router.post('/contactForm',  adminController.contactForm )

module.exports = router