// app/initialize-app.js
const express = require("express");
const cors = require("cors");

const colorsRouter = require("@general/colors/router/colors.router.js");
const coinsRouter = require("@coins/routes/coins.route.js");
const oiRouter = require("@oi/routes/oi.route.js");
const klineRouter = require("@kline/routes/kline.route.js");
const frRouter = require("@fr/routes/fr.route.js");
const reportRouter = require("@general/report/routes/report.route.js");

const {
  getServantConfig,
} = require("@global/servants/servant-config/service.js");

async function initializeApp() {
  const allowedOrigins = getServantConfig().allowedOrigins;

  if (!Array.isArray(allowedOrigins) || allowedOrigins.length === 0) {
    throw new Error("No valid allowed origins found");
  }

  const app = express();
  app.use(express.json());
  app.use(cors({ origin: allowedOrigins }));

  app.use("/api", coinsRouter);
  //app.use("/api", generalRouter);
  app.use("/api", colorsRouter);
  app.use("/api", frRouter);
  app.use("/api", oiRouter);
  app.use("/api", klineRouter);
  app.use("/api", reportRouter);

  return app;
}

module.exports = { initializeApp };
