const { dbConnect } = require("./configs/db");

let app   = require("./index");
const logger = require("./configs/logger")


let server;
dbConnect.then(
  () => {
    console.log('database connected')
    const appPort = process.env.Port || 5005;
    server = app.listen(appPort, () => {
      logger.info(`App running on port ${appPort}...`);
    });
  },
  (err) => {
    logger.error("Unable to connect to the database. Shutting down !!", err);
  }
);

const unexpectedErrorHandler = (error) => {
  logger.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  logger.error("uncaughtException Err::", error);
  logger.error(error);
};

// Handle uncaught exceptions
process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  logger.info("SIGTERM RECEIVED. Shutting down gracefully");
  if (server) {
    server.close();
  }
});