// initializeOiStore.js
const ServantsConfigOperator = require("@global/servants/servants-config.js");

const {
  fetchKlineData,
} = require("@kline/functions/fetches/fetch-kline-data.js");

const { setKlineCache } = require("@kline/cache/service.js");

const { VALID_TIMEFRAMES } = require("@kline/config/timeframe.config.js");

const { delay } = require("@shared/utils/delay/delay.js");

async function initializeKlineStore() {
  const limit = ServantsConfigOperator.getConfig().limitKline;

  for (const config of VALID_TIMEFRAMES) {
    try {
      // Use a delay function to handle asynchronous delays
      await delay(config.delay);
      //
      // await new Promise((resolve) => setTimeout(resolve, config.delay));

      const data = await fetchKlineData(config.timeframe, limit);
      setKlineCache(config.timeframe, data);
      console.log(`✅ Kline Store ${config.timeframe} --> initialized...`);
    } catch (error) {
      console.error(
        `❌ Failed to initialize Kline store for ${config.timeframe}:`,
        error
      );
    }
  }
}

module.exports = { initializeKlineStore };
