let Admins = require('../models/admin')
let Events = require('../models/event')
let ContactForm = require('../models/contactform')
let Gallery = require('../models/gallery')
let Members = require('../models/member')
const jwt = require('jsonwebtoken');
let galleryUrls = require('../configs/gallery')
let nodemailer = require('nodemailer')

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
        let phone = req.body.phoneNum
        let password = req.body.password;
        const adminData = await Admins.findOne({ phoneNum: phone });
        if (!adminData) {
            return res.status(400).send("Not found! please try again")
        }
        // const match = await bcrypt.compare(password, adminData.password)
        if (password === adminData.password) {
            let message = 'Login Success'
            let payload = { adminId: adminData._id, phone: adminData.phoneNum }
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

exports.signup = async (req, res) => {
    try {
        const { fullName, email, phoneNum, password, remarks } = req.body
        const adminData = new Admins({
            fullName: fullName,
            email: email,
            phoneNum: phoneNum,
            password: password,
            remarks: remarks
        })
        let result = await adminData.save()
        let payload = { adminId: adminData._id, phone: adminData.phoneNum }
        token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '360000s' })
        let message = "signup success"
        res.status(200).send({ result, message });
    }
    catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
}

exports.editMember = async (req, res) => {
    try {
        const bodyvar = req.body
        console.log(bodyvar, 'bodyreq')
        const id = req.params.id
        const memberUpdate = {
            memberName: bodyvar.memberName,
            relation: bodyvar.relation,
            fatherName: bodyvar.fatherName,
            aadharNum: bodyvar.aadharNum,
            phoneNum: bodyvar.phoneNum,
            email: bodyvar.email,
            address: bodyvar.address,
            designation: bodyvar.designation,
            validity: bodyvar.validity,
            gender: bodyvar.gender,
            remarks: bodyvar.remarks,
            isApproved: true
        }
        let updated = await Members.findByIdAndUpdate({ _id: id }, memberUpdate, { new: true })
        let message = "member update success"
        res.send({ updated, message })
    }
    catch (error) {
        res.send(error);
        logger.error(`An error occurred: ${error.message}`)
    }
}

exports.getMembers = async (req, res) => {
    try {
        let memberData = await Members.aggregate([
            { $match: { isApproved: false } }
        ])
        if (!memberData) {
            res.send("Not found")
        }
        console.log(memberData, 'memberdata')
        res.status(200).send(memberData);
    }
    catch (error) {
        res.send(error);
        console.log(error, 'errorinpendgmmbr')
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
        if (!saved) {
            res.status(400).send('Not saved, Please try again')
        }
        let message = "form submission success"
        res.status(200).send({ saved, message })
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
        if (!saved) {
            res.status(400).send('Not saved, Please try again')
        }
        let message = "event created successfully"
        res.status(200).send({ saved, message })
    }
    catch (error) {
        res.status(400).send(error);
        logger.error(`An error occurred: ${error.message}`)
    }
}

exports.getEvents = async (req, res) => {
    try {
        var eventData = await Events.find()
        if (!eventData) {
            res.status(400).send('Not found, Please try again')
        }
        res.status(200).send(eventData);
    }
    catch (error) {
        logger.error(`An error occurred: ${error.message}`)
        res.send(error);
    }


}

exports.uploadGallery = async (req, res) => {
    let url = req.protocol + '://' + req.get("host");
    console.log(req.files, 'fielrecvd')
    let gallery = await Gallery.findById({ _id: "6517a49267fcaffbcef98ebd" })
    if (req.files && req.files.length != 0 && req.files[0].fieldname == 'gallery') {
        req.files.forEach((element) => {
            let fvalue = url + '/uploads/' + element.filename
            gallery.galleryUrlsArray.push(fvalue)
        })
    }
    let result = await gallery.save()
    res.status(200).send(result)
}

exports.sendEmail = async (req, res) => {
    let userid = req.params.id
    let usermail = req.body.email
    let filepath = path.join(__dirname, '../public/idcards/6517c0cd6754e51cc74f5078.pdf')
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.USER,
            pass: process.env.PASS,
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    let info = await transporter.sendMail({
        from: '"Prayas jan kalyan foundation" <prayasjankalyanfoundation@gmail.com>',
        to: `${usermail}`,
        subject: "ID Card",
        attachments: [
            {
                filename: "xyz.pdf",
                path: filepath
            }
        ],
        html: `<h2>your id card from prayas jan kalyan foundation membership </h2>
        <p>please find it in attachments</p>`,
    });
}

exports.getGallery = async (req, res) => {
    try {
        let gallery = await Gallery.findById({ _id: "6517a49267fcaffbcef98ebd" })
        if (!gallery) {
            res.status(200).send("Not found")
        }
        res.status(200).send(gallery)
    } catch (error) {
        res.status(400).send(error)
    }
}