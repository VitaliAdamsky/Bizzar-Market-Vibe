// initializeOiStore.js
const ServantsConfigOperator = require("@global/servants/servants-config.js");

const {
  fetchOpenInterestData,
} = require("@oi/functions/fetches/fetch-oi-data.js");

const { setOpenInterestCache } = require("@oi/cache/service.js");

const { VALID_TIMEFRAMES } = require("@oi/config/timeframe.config.js");

const { delay } = require("@shared/utils/delay/delay.js");

async function initializeOpenInterestStore() {
  const limit = ServantsConfigOperator.getConfig().limitOi;
  //TODO: remove
  console.log("initializeOpenInterestStore", limit);
  for (const config of VALID_TIMEFRAMES) {
    try {
      // Use a delay function to handle asynchronous delays
      await delay(config.delay);
      //
      // await new Promise((resolve) => setTimeout(resolve, config.delay));

      const data = await fetchOpenInterestData(config.timeframe, limit);
      setOpenInterestCache(config.timeframe, data);
      //TODO: remove
      console.log("initializeOpenInterestStore", data.data.length);
      console.log(`🟢 OI Store ${config.timeframe} --> initialized...`);
    } catch (error) {
      console.error(
        `❌ Failed to initialize OI Store for ${config.timeframe}:`,
        error
      );
    }
  }
}

module.exports = { initializeOpenInterestStore };
