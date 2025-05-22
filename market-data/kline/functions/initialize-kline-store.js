// initializeKlineStore.js
const ServantsConfigOperator = require("@global/servants/servants-config.js");
const {
  fetchKlineData,
} = require("@kline/functions/fetches/fetch-kline-data.js");
const { setKlineCache } = require("@kline/cache/service.js");
const { VALID_TIMEFRAMES } = require("@kline/config/timeframe.config.js");

async function initializeKlineStore() {
  const limit = ServantsConfigOperator.getConfig().limitKline; // Loop through each timeframe and schedule job with delay
  for (const config of VALID_TIMEFRAMES) {
    const { timeframe, delay: delayMs } = config;

    console.log(
      `⏱ Kline [${timeframe}] will init after ${delayMs / 60000} min`
    );

    setTimeout(async () => {
      try {
        const data = await fetchKlineData(timeframe, limit);
        setKlineCache(timeframe, data);

        console.log(
          `💛 Kline [${timeframe}] Cache initialized | Data size: ${data.data.length}`
        );
      } catch (err) {
        console.error(
          `❌ Kline [${timeframe}] failed to initialize cache:`,
          err.message || err
        );
      }
    }, delayMs);
  }
}

module.exports = { initializeKlineStore };
