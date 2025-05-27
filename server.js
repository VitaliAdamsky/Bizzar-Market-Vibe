// server.js
require("dotenv").config();
require("module-alias/register");

const { initializeApp } = require("./app/initialize-app.js");

const { initializeColorsCache } = require("@general/colors/cache/service.js");

const { initializeConfig } = require("@app/initialize-config.js");

const {
  initializeCoinsStore,
} = require("@coins/functions/initialize-coins-store.js");

const {
  initializeKlineStore,
} = require("@kline/functions/initialize-kline-store.js");

const {
  initializeOpenInterestStore,
} = require("@oi/functions/initialize-oi-store.js");

const {
  initializeFundingRateStore,
} = require("@fr/functions/initialize-fr-store.js");

const { scheduleKlineJobs } = require("@kline/jobs/job-runner");
const { scheduleOpenInterestJobs } = require("@oi/jobs/job-runner");
const { scheduleFundingRateJobs } = require("@fr/jobs/job-runner");

const { scheduleSelfPing } = require("@general/report/jobs/job-runner.js");

// const {
//   initializeOpenInterestStore,
// } = require("@oi/functions/initialize-oi-store.js");

// const {
//   initializeFundingRateStore,
// } = require("@fr/functions/initialize-fr-store.js");

// const { initializeTelegramBots } = require("./app/initialize-telegram-bots.js");

// const {
//   initializeCoinsStore,
// } = require("./coins/functions/initialize-coins-store.js");

// const {
//   initializeKlineStore,
// } = require("./kline/functions/initialize-kline-store.js");

//const { scheduleAllOiJobs } = require("./jobs/oi.js");

//const { scheduleAllFrJobs } = require("./jobs/fr.js");

// const {
//   setInitialColors,
// } = require("./functions/shared/colors/colors-cache.js");
// const { scheduleAllKlineJobs } = require("./kline/jobs/kline.js");

async function main() {
  try {
    await initializeConfig();
    await initializeColorsCache();
    await initializeCoinsStore();
    //await initializeKlineStore();
    await initializeOpenInterestStore();
    await initializeFundingRateStore();

    const app = await initializeApp();

    //scheduleKlineJobs();
    scheduleOpenInterestJobs();
    //scheduleFundingRateJobs();

    //scheduleSelfPing();

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`💜 Server started on port ${PORT}`);
    });
  } catch (error) {
    console.error("🆘 Application initialization failed:", error);
    process.exit(1);
  }
}

main();
