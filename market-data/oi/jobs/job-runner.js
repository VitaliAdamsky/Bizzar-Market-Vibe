// job-runner.ts
const { CronJob } = require("cron");

const {
  ServantsConfigOperator,
} = require("@global/servants/servants-config.js");

const { TIMEFRAME_CONFIG } = require("@kline/config/timeframe-config.js");

const { fetchOiData } = require("@oi/functions/fetches/fetch-oi-data.js");

const { setOpenInterestCache } = require("@oi/cache/service.js");

const { UnixToNamedTimeRu } = require("@shared/time-converter.js");

async function runOiFetch(timeframe) {
  const limit = ServantsConfigOperator.getConfig().limitOi;
  try {
    const data = await fetchOiData(timeframe, limit);
    setOpenInterestCache(timeframe, data);
    console.log(
      `✅ [${UnixToNamedTimeRu(Date.now())}] Updated OI Cache for ${timeframe}`
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

export function scheduleOiJobs() {
  Object.keys(TIMEFRAME_CONFIG).forEach((tf) => {
    const { cron, delay } = TIMEFRAME_CONFIG[tf];
    schedule.scheduleJob(cron, () => {
      console.log(
        `👉 [JOB] Scheduled OI ${tf} job (cron: ${cron}, delay: ${delay} min)`
      );

      setTimeout(() => {
        console.log(`👉 [JOB] Running OI ${tf} job after ${delay} min`);
        runOiFetch(tf);
      }, delay * 60 * 1000); // Convert minutes → ms
    });
  });
}

module.exports = {
  scheduleOiJobs,
};
