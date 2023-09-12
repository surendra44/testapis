const express = require('express')
const fs = require('fs')
const { send } = require("node:process");

const logger = require("./configs/logger")
require('dotenv').config()
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.status(200).send('root api')
})
app.get('/error-logs', (req, res) => {
    let logscontent = fs.readFileSync('./error-logs.log', "utf-8")
    return res.status(200).send(logscontent)
})
// send back a 404 error for any unknown api request
app.use((req, res) => {
    return res.sendStatus(httpStatus.NOT_IMPLEMENTED);
});

app.on("error", (appErr, appCtx) => {
    logger.error(`app error: ${appErr.stack}`);
    logger.error(`on url: ${appCtx.req.url}`);
    logger.error(`With headers: ${appCtx.req.headers}`);
});

module.exports = app; // Export the app instance
