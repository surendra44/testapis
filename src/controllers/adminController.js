let Admins = require('../models/admin')
let Events = require('../models/event')
let ContactForm = require('../models/contactform')
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");

exports.getAdmins = async (req, res) => {
    const id = req.query.id
    try {
        var admin = await Admins.findOne({ _id: id })
        // console.log(admin, " fetch admin");
        res.status(200).send(admin);
    }
    catch (error) {
        logger.error(`An error occurred: ${error.message}`)
        res.send(error);
    }
}

exports.login = async (req, res) => {
    try {
        let phone = req.body.phone
        let password = req.body.password;
        const adminData = await Admins.findOne({ phone: phone });
        if (!adminData) {
            return errorResponse(req, res, httpStatus.UNAUTHORIZED, "Admin not found")
        }
        const match = await bcrypt.compare(password, adminData.password)
        if (match) {
            let message = 'Login Success'
            let payload = { adminId: adminData._id, phone: adminData.phone }
            let token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '360000s' })
            res.status(200).send({ token, message })
        } else {
            let message = "password not match"
            res.status(404).send(message)
        }
    }
    catch (error) {
        console.log(error)
        res.status(400).send(error, "error")
    }
}

exports.contactForm = async (req, res) => {
    try {
        const bodyvar = req.body
        console.log(bodyvar, 'body')

        const contactData = new ContactForm({
            fullName: bodyvar.fullName,
            phoneNum: bodyvar.phoneNum,
            message: bodyvar.message
        })

        let saved = await contactData.save()
        if (saved) {
            let message = "form submission success"
            res.status(200).send({ saved, message })
        }
    }
    catch (error) {
        res.status(400).send(error);
        logger.error(`An error occurred: ${error.message}`)
    }
}

exports.createEvent = async (req, res) => {
    try {
        const url = req.protocol + '://' + req.get("host");
        const bodyvar = req.body
        console.log(bodyvar, 'body')

        const eventData = new Events({
            titel: bodyvar.title,
            description: bodyvar.description
        })
        if (req.files && req.files.length != 0 && req.files[0].fieldname == 'photoUrl') {
            eventData.photoUrl = url + '/uploads/' + req.files[0].filename
        }
        let saved = await eventData.save()
        if (saved) {
            let message = "event created successfully"
            res.status(200).send({ saved, message })
        }
    }
    catch (error) {
        res.status(400).send(error);
        logger.error(`An error occurred: ${error.message}`)
    }
}

exports.getEvents = async (req, res) => {
    try {
        var eventData = await Events.find()
        res.status(200).send(eventData);
    }
    catch (error) {
        logger.error(`An error occurred: ${error.message}`)
        res.send(error);
    }


}