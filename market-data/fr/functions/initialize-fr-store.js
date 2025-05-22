// initializeOiStore.js
const ServantsConfigOperator = require("@global/servants/servants-config.js");

const {
  fetchFundingRateData,
} = require("@fr/functions/fetches/fetch-fr-data.js");

const { setFundingRateCache } = require("@fr/cache/service.js");

const { VALID_TIMEFRAMES } = require("@fr/config/timeframe.config.js");

const { delay } = require("@shared/utils/delay/delay.js");

async function initializeFundingRateStore() {
  const limit = ServantsConfigOperator.getConfig().limitOi;

  for (const config of VALID_TIMEFRAMES) {
    try {
      // Use a delay function to handle asynchronous delays
      await delay(config.delay);
      //
      // await new Promise((resolve) => setTimeout(resolve, config.delay));

      const data = await fetchFundingRateData(limit);
      setFundingRateCache(config.timeframe, data);
      //TODO: remove
      console.log("initializeOpenInterestStore", data.data.length);
      console.log(`💚 FR Store ${config.timeframe} --> initialized...`);
    } catch (error) {
      console.error(
        `❌ Failed to initialize FR Store for ${config.timeframe}:`,
        error
      );
    }
  }
}

module.exports = { initializeFundingRateStore };
