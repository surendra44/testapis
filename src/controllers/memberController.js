let Members = require('../models/member')
const logger = require('../configs/logger')
// const puppeteer = require('puppeteer')
const path = require('path')
const fs = require('fs')
let ejs = require('ejs')
let html_to_pdf = require('html-pdf-node');


exports.getMembers = async (req, res) => {
    try {
        var memberData = await Members.find({ isApproved: true })
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
            memberData.photoUrl = url + '/uploads/' + req.files[0].filename
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

exports.loadIdCard = async (req, res) => {
    try {
        console.log('insideloadid')
        let mid = req.params.id
        let member = await Members.findOne({ $and: [{ phoneNum: mid }, { isApproved: true }] })
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
        // res.render('idcard', data);
        res.status(200).send(data)

    } catch (error) {
        logger.error(`An error occurred: ${error.message}`)
    }
}
exports.loadIdCard2 = async (req, res) => {
    try {
        console.log('insideloadid2')
        let mid = req.params.id
        let member = await Members.findOne({ phoneNum: mid })
        if (!member) {
            return res.status.send("Not found")
        }
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

// exports.generateIdCard = async (req, res) => {
//     try {
//         let mid = req.params.id
//         // let dynamicData = await Members.findOne({$and:[{ phoneNum: mid}, {isApproved:true}]})
//         let dynamicData = await Members.findOne({ phoneNum: mid })
//         if (!dynamicData) {
//             res.status(400).error("Not Found")
//         }
//         // let html = await ejs.render('idcard.ejs', dynamicData );
//         // console.log(html,'htmloutput')
//         let options = { format: 'A4', landscape: true, printBackground: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] };
//         const pdfBuffer = await new Promise((resolve, reject) => {
//             // html_to_pdf.generatePdf({content:html},options).then(buffer => {
//             html_to_pdf.generatePdf({ url: `${req.protocol}://${req.get('host')}` + `/members/loadIdCard2/${mid}` }, options).then(buffer => {
//                 console.log("PDF Buffer:-", buffer);
//                 resolve(buffer)
//             }).catch(err => {
//                 console.error(err);
//                 reject('Error generating PDF');
//             });
//         });
//         let filepath = path.join(__dirname, `../public/idcards/${dynamicData._id}.pdf`)
//         //    fs.writeFileSync(filepath, pdfBuffer);

//         // Create a write stream to write the PDF data to the file
//         const writeStream = fs.createWriteStream(filepath);

//         writeStream.write(pdfBuffer);
//         writeStream.end();

//         // Listen for the 'finish' event to know when the write operation is complete
//         writeStream.on('finish', () => {
//             console.log('PDF file has been written successfully.');
//             res.status(200).sendFile(filepath, function (err) {
//                 if (err) {
//                     next(err);
//                 } else {
//                     console.log('Sent:', filepath);
//                 }
//             });
//         });

//         // Handle errors that might occur during the write operation
//         writeStream.on('error', err => {
//             console.error('Error writing PDF file:', err);
//             reject('Error writing PDF file');
//         })
//     }catch(error){
//         res.status(400).send(error)
//     }
// };



exports.generateIdCard = async (req, res) => {
    try {
        let mid = req.params.id
        let dynamicData = await Members.findOne({ phoneNum: mid })
        if (!dynamicData) {
            res.status(400).error("Not Found")
        }
        const url = `${req.protocol}://${req.get('host')}/members/loadIdCard2/${mid}`;
        const pdfFilePath = path.join(__dirname, `../public/idcards/${dynamicData._id}.pdf`);

        // Generate the PDF and write it directly to a file on the server
        let options = { format: 'A4', landscape: true, printBackground: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] };
        html_to_pdf
            .generatePdf({ url }, options)
            .then(() => {
                console.log('PDF generated successfully');

                // Send the file as a response to the client
                res.status(200).sendFile(pdfFilePath, (err) => {
                    if (err) {
                        console.error('Error sending PDF:', err);
                        // Handle the error if needed
                    } else {
                        console.log('Sent PDF:', pdfFilePath);
                    }
                });
            }).catch((err) => {
                console.error('Error generating PDF:', err);
                // reject('Error generating PDF');
                throw err
            });
    } catch (err) {
        console.error(err);
        throw new Error('Error generating or saving PDF');
    }

}