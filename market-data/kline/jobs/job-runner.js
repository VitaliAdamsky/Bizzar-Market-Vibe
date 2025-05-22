// job-runner.ts
const { CronJob } = require("cron");

const {
  ServantsConfigOperator,
} = require("@global/servants/servants-config.js");

const { TIMEFRAME_CONFIG } = require("@kline/config/timeframe-config.js");

const {
  fetchKlineData,
} = require("@kline/functions/fetches/fetch-kline-data.js");

const { setKlineCache } = require("@kline/cache/service.js");

const { UnixToNamedTimeRu } = require("@shared/time-converter.js");

async function runKlineFetch(timeframe) {
  const limit = ServantsConfigOperator.getConfig().limitKline;
  try {
    const data = await fetchKlineData(timeframe, limit);
    setKlineCache(timeframe, data);
    console.log(
      `✅ [${UnixToNamedTimeRu(
        Date.now()
      )}] Updated Kline Cache for ${timeframe}`
    );
  } catch (error) {
    console.error(
      `❌ [${UnixToNamedTimeRu(
        Date.now()
      )}] Failed to update Kline cache for ${timeframe}`,
      error instanceof Error ? error.message : error
    );
  }
}

export function scheduleKlineJobs() {
  Object.keys(TIMEFRAME_CONFIG).forEach((tf) => {
    const { cron, delay } = TIMEFRAME_CONFIG[tf];
    schedule.scheduleJob(cron, () => {
      console.log(
        `👉 [JOB] Scheduled ${tf} job (cron: ${cron}, delay: ${delay} min)`
      );

      setTimeout(() => {
        console.log(`👉 [JOB] Running ${tf} job after ${delay} min`);
        runKlineFetch(tf);
      }, delay * 60 * 1000); // Convert minutes → ms
    });
  });
}

module.exports = {
  scheduleKlineJobs,
};
