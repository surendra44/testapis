let Members = require('../models/member')
let Admins = require('../models/admin')
const logger = require('../configs/logger')
const puppeteer = require('puppeteer')
const path = require('path')


exports.getAdmins = async (req, res) =>{
    const id = req.query.id
    try {
        var admin = await Admins.findOne({_id:id})
        // console.log(admin, " fetch admin");
        res.status(200).send(admin);
    }
    catch (error) {
        logger.error(`An error occurred: ${error.message}`)
        res.send(error);
    }
}

exports.getMembers = async (req, res) =>{
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

exports.createMember = async (req, res)=> {
    try {
        const url = req.protocol + '://' + req.get("host");
        const bodyvar = req.body
        const customerData = new Members({
            fullName: bodyvar.fullName,
            phone: bodyvar.phone,
            email:bodyvar.email,
            address: bodyvar.address,
            designation:bodyvar.designation,
            gender:bodyvar.gender,
            remarks:bodyvar.remarks,
        })
        if (req.files && req.files.length != 0 && req.files[0].fieldname == 'photoUrl') {
            customerData.photoUrl = url + '/' + req.files[0].filename
        }
        let message = "member signup success"
        let saved = customerData.save()
        if(saved){
            res.status(200).send({saved,message })
        }
    }
    catch (error) {
        res.status(400).send(error);
        logger.error(`An error occurred: ${error.message}`)
    }
}

exports.editMember = async (req, res)=> {
    try {
        const bodyvar = req.body
        console.log(bodyvar,'bodyreq')
        const id = req.params.id
        const memberUpdate = {
            fullName: bodyvar.fullName,
            phone: bodyvar.phone,
            email:bodyvar.email,
            address: bodyvar.address,
            designation:bodyvar.designation,
            gender:bodyvar.gender,
            remarks:bodyvar.remarks,
        }
        let updated = await Members.findByIdAndUpdate({_id:id},memberUpdate,{new:true})
        let message = "member update success"
        res.send({updated,message})
    }
    catch (error) {
        res.send(error);
        logger.error(`An error occurred: ${error.message}`)
    }
}

exports.loadIdCard = async (req,res)=>{
    try{
        let mid = req.params.id
        let member = await Members.findById({_id:mid})
        const data = {
            memberName: member.memberName,
            designation: member.designation,
            uniqueId: member.uniqueId,
            email: member.email,
            phoneNum: member.phoneNum,
            fatherName: member.fatherName,
            address: member.address,
            aadharNum: member.aadharNum,
            validity: member.validity,
            photoUrl:member.photoUrl
        };
        res.render('idcard', data);
    }catch(error){
        logger.error(`An error occurred: ${error.message}`)    }
}

exports.generateIdCard = async (req,res)=>{
try {
    const browser = await puppeteer.launch({headless:"new"})
    const page = await browser.newPage()
    await page.goto(`${req.protocol}://${req.get('host')}`+"/members/loadIdCard" ,{
        waitUntil:'networkidle2'
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
    await page.setViewport({width:1680, height: 1050})
    dateToday = new Date()
    const pdfs = await page.pdf({
        path: `${path.join(__dirname, '../public/idcards' ,dateToday.getTime()+".pdf")}`,
        printBackground: true,
        format: "A4"
    })
    await browser.close()
    const pdfUrl = path.join(__dirname, '../public/idcards' ,dateToday.getTime()+".pdf")
    res.set({
        "Content-Type":"application/pdf",
        "Content-Length":pdfs.length
    })
    res.sendFile(pdfUrl)

} catch (error) {
    logger.error(`An error occurred: ${error.message}`)

}
}