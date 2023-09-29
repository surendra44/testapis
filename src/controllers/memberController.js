let Members = require('../models/member')
const logger = require('../configs/logger')
// const puppeteer = require('puppeteer')
const path = require('path')
const fs = require('fs')
let ejs = require('ejs')
let html_to_pdf = require('html-pdf-node');


exports.getMembers = async (req, res) => {
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
        console.log(bodyvar, 'body')
        const dateToday = new Date() // Get current timestamp in milliseconds
        let validityDate;
        switch (bodyvar.validity) {
            case "1 साल":
                validityDate = dateToday.setFullYear(dateToday.getFullYear() + 1);
                console.log(validityDate, 'validitydate');
                break;

            case "2 साल":
                validityDate = dateToday.setFullYear(dateToday.getFullYear() + 2);
                console.log(validityDate, 'validitydate');
                break;
            case "5 साल":
                validityDate = dateToday.setFullYear(dateToday.getFullYear() + 5);
                console.log(validityDate, 'validitydate');
                break;

        }
        let timestamp = dateToday.getTime()
        let unid = timestamp.toString().slice(-8);
        const memberData = new Members({
            memberName: bodyvar.memberName,
            relation: bodyvar.relation,
            fatherName: bodyvar.fatherName,
            aadharNum: bodyvar.aadharNum,
            uniqueId: unid,
            phoneNum: bodyvar.phoneNum,
            email: bodyvar.email,
            address: bodyvar.address,
            designation: bodyvar.designation,
            validity: validityDate,
            gender: bodyvar.gender,
            remarks: bodyvar.remarks,
        })
        if (req.files && req.files.length != 0 && req.files[0].fieldname == 'photoUrl') {
            memberData.photoUrl = url+'/uploads/'+ req.files[0].filename
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
        let member = await Members.findOne({ phoneNum: mid })
        const data = {
            memberName: member.memberName,
            relation: member.relation,
            designation: member.designation,
            uniqueId: member.uniqueId,
            email: member.email,
            phoneNum: member.phoneNum,
            fatherName: member.fatherName,
            address: member.address,
            aadharNum: member.aadharNum,
            validity: member.validity,
            photoUrl: member.photoUrl
        };
        res.render('idcard', data);
        // res.status(200).send(data)

    } catch (error) {
        logger.error(`An error occurred: ${error.message}`)
    }
}

// exports.generateIdCard = async (req, res) => {
//     // try {
//     //     let mid = req.params.id
//     //     let userdata = await Members.findOne({ phoneNum: mid })
//     //     const browser = await puppeteer.launch({ headless: "new" })
//     //     const page = await browser.newPage()
//     //     await page.setExtraHTTPHeaders({
//     //         'Content-Security-Policy': 'default-src * data: blob:; style-src * data: blob: \'unsafe-inline\'; img-src * data: blob:'
//     //     });
//     //     await page.goto(`${req.protocol}://${req.get('host')}` + `/members/loadIdCard/${mid}`, {
//     //         waitUntil: 'networkidle2'
//     //     })
//     //     await page.evaluate(() => {
//     //         const images = document.querySelectorAll('img');
//     //         const imagePromises = [];

//     //         images.forEach((img) => {
//     //             if (!img.complete) {
//     //                 const imageLoaded = new Promise((resolve) => {
//     //                     img.addEventListener('load', resolve);
//     //                     img.addEventListener('error', resolve);
//     //                 });
//     //                 imagePromises.push(imageLoaded);
//     //             }
//     //         });

//     //         return Promise.all(imagePromises);
//     //     });
//     //     let epath = `${path.join(__dirname, '../views/idcard.ejs')}`
//     //     const ejsTemplate = fs.readFileSync(epath, 'utf8');
//     //     const html = ejs.render(ejsTemplate, userdata);

//     //     // Set the HTML content of the page
//     //     await page.setContent(html);

//     //     await page.setViewport({ width: 1680, height: 1050 })
//     //     dateToday = new Date()
//     //     const pdfs = await page.pdf({
//     //         path: `${path.join(__dirname, '../public/idcards', dateToday.getTime() + ".pdf")}`,
//     //         printBackground: true,
//     //         format: "A4"
//     //     })
//     //     await browser.close()
//     //     const pdfUrl = path.join(__dirname, '../public/idcards', dateToday.getTime() + ".pdf")
//     //     res.set({
//     //         "Content-Type": "application/pdf",
//     //         "Content-Length": pdfs.length
//     //     })
//     //     res.sendFile(pdfUrl)

//     // } catch (error) {
//     //     logger.error(`An error occurred: ${error.message}`)

//     // }
// }

exports.generateIdCard = async (req,res) => {
    try {
    let phoneparam = req.params.id
    let dynamicData = await Members.findOne({phoneNum:phoneparam})
      let html = await ejs.renderFile(path.join(__dirname, '../views/idcard.ejs'), dynamicData );
      let options = { format: 'A4', args: ['--no-sandbox', '--disable-setuid-sandbox'] };
      const pdfBuffer = await new Promise((resolve, reject) => {
        // html_to_pdf.generatePdf({content:html},options).then(buffer => {
        html_to_pdf.generatePdf({url:"" },options).then(buffer => {
          console.log("PDF Buffer:-", buffer);
          resolve(buffer)}).catch(err=>{
            console.error(err);
            reject('Error generating PDF');
        });
      });
      
  
      // Save the PDF to a file
      // fs.writeFileSync(path.join(__dirname, '../../receipts/donation_receipt.pdf'), pdfBuffer);
       fs.writeFileSync(path.join(__dirname, `../../views${dynamicData._id}.pdf`), pdfBuffer);
  
      return { dynamicData, pdfBuffer };
    } catch (e) {
      console.error(e);
      throw new Error('Error generating or saving PDF');
    }
  };