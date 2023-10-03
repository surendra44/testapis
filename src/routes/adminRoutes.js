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
router.post('/createEvent', uploads.upload,  verifyToken.verifyToken,  adminController.createEvent )
router.put('/editMember/:id', verifyToken.verifyToken, adminController.editMember )
router.get('/getPendingMembers', verifyToken.verifyToken, adminController.getMembers)
router.post('/contactForm',  adminController.contactForm )
router.post('/uploadGallery',uploads.upload, adminController.uploadGallery)
router.post('/sendEmail', adminController.sendEmail)
router.get('/getGallery', adminController.getGallery)

module.exports = router