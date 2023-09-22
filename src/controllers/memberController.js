let Members = require('../models/member')
let Admins = require('../models/admin')
const logger = require('../configs/logger')
// const puppeteer = require('puppeteer')
const path = require('path')

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

exports.getMembers = async (req, res) => {
    const id = req.query.id
    try {
        var memberData = await Members.find()
        res.status(200).send(memberData);
    }
    catch (error) {
        logger.error(`An error occurred: ${error.message}`)
        res.send(error);
    }
}

exports.createMember = async (req, res) => {
    try {
        const url = req.protocol + '://' + req.get("host");
        const bodyvar = req.body
        const timestamp = new Date().getTime(); // Get current timestamp in milliseconds
        let unid =timestamp.toString().slice(-8);
        console.log(bodyvar, 'body')
        const memberData = new Members({
            memberName: bodyvar.memberName,
            fatherName: bodyvar.fatherName,
            aadharNum: bodyvar.aadharNum,
            uniqueId: unid,
            phoneNum: bodyvar.phoneNum,
            email: bodyvar.email,
            address: bodyvar.address,
            designation: bodyvar.designation,
            validity: bodyvar.validity,
            gender: bodyvar.gender,
            remarks: bodyvar.remarks,
        })
        if (req.files && req.files.length != 0 && req.files[0].fieldname == 'photoUrl') {
            memberData.photoUrl = url + '/' + req.files[0].filename
        }
        let saved = await memberData.save()
        if (saved) {
            let message = "member signup success"
            res.status(200).send({ saved, message })
        }
    }
    catch (error) {
        res.status(400).send(error);
        logger.error(`An error occurred: ${error.message}`)
    }
}

exports.editMember = async (req, res) => {
    try {
        const bodyvar = req.body
        console.log(bodyvar, 'bodyreq')
        const id = req.params.id
        const memberUpdate = {
            memberName: bodyvar.memberName,
            phone: bodyvar.phone,
            email: bodyvar.email,
            address: bodyvar.address,
            designation: bodyvar.designation,
            gender: bodyvar.gender,
            remarks: bodyvar.remarks,
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

exports.loadIdCard = async (req, res) => {
    try {
        let mid = req.params.id
        let member = await Members.find({ uniqueId: mid })
        const data = {
            memberName: member[0].memberName,
            designation: member[0].designation,
            uniqueId: member[0].uniqueId,
            email: member[0].email,
            phoneNum: member[0].phoneNum,
            fatherName: member[0].fatherName,
            address: member[0].address,
            aadharNum: member[0].aadharNum,
            validity: member[0].validity,
            photoUrl: member[0].photoUrl
        };
        // res.render('idcard', data);
        res.send(data)
        
    } catch (error) {
        logger.error(`An error occurred: ${error.message}`)
    }
}

exports.generateIdCard = async (req, res) => {
    try {
        let mid = req.params.id
        const browser = await puppeteer.launch({ headless: "new" })
        const page = await browser.newPage()
        await page.goto(`${req.protocol}://${req.get('host')}` + `/members/loadIdCard/${mid}`, {
            waitUntil: 'networkidle2'
        })
        await page.evaluate(() => {
            const images = document.querySelectorAll('img');
            const imagePromises = [];

            images.forEach((img) => {
                if (!img.complete) {
                    const imageLoaded = new Promise((resolve) => {
                        img.addEventListener('load', resolve);
                        img.addEventListener('error', resolve);
                    });
                    imagePromises.push(imageLoaded);
                }
            });

            return Promise.all(imagePromises);
        });
        await page.setViewport({ width: 1680, height: 1050 })
        dateToday = new Date()
        const pdfs = await page.pdf({
            path: `${path.join(__dirname, '../public/idcards', dateToday.getTime() + ".pdf")}`,
            printBackground: true,
            format: "A4"
        })
        await browser.close()
        const pdfUrl = path.join(__dirname, '../public/idcards', dateToday.getTime() + ".pdf")
        res.set({
            "Content-Type": "application/pdf",
            "Content-Length": pdfs.length
        })
        res.sendFile(pdfUrl)

    } catch (error) {
        logger.error(`An error occurred: ${error.message}`)

    }
}