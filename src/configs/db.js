const mongoose  = require('mongoose')
const logger = require("./logger");
require('dotenv').config()


let MONGODB_URL = process.env.MONGODB_URL

logger.info(`Connecting to Database at ${MONGODB_URL}`);
mongoose.set('strictQuery', false);
module.exports.dbConnect = mongoose.connect(MONGODB_URL, {connectTimeoutMS: 100000}).then(() => {
  logger.info("Database Connection has been established successfully.");
});