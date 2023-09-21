const express = require('express')
const fs = require('fs')
const { send } = require("node:process");
const memberRoute = require('./routes/memberRoutes')
const logger = require("./configs/logger")
require('dotenv').config()
const app = express()
const httpStatus = require("http-status")
let path = require('path')
const cors = require('cors')

app.use(cors({
    origin:'https://prayasjankalyanfoundation.com'
}));

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'uploads')))

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.get('/', (req, res) => {
    res.status(200).send('root api')
})
app.get('/error-logs', (req, res) => {
    let logscontent = fs.readFileSync('./error-logs.log', "utf-8")
    return res.status(200).send(logscontent)
})
app.use('/members', memberRoute)
// send back a 404 error for any unknown api request
app.use((req, res) => {
    return res.sendStatus(httpStatus.NOT_IMPLEMENTED);
});
// app.use(express.static('public'));
app.on("error", (appErr, appCtx) => {
    logger.error(`app error: ${appErr.stack}`);
    logger.error(`on url: ${appCtx.req.url}`);
    logger.error(`With headers: ${appCtx.req.headers}`);
});

module.exports = app; // Export the app instance
