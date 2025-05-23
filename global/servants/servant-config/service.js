// configOperator.js

require("dotenv").config();
const DopplerSDK = require("@dopplerhq/node-sdk").default;

const {
  servantConfigCache,
} = require("@global/servants/servant-config/store.js");

async function initializeServantsConfig() {
  try {
    const doppler = new DopplerSDK({ accessToken: process.env.SERVANTS_TOKEN }); // Ensure Doppler token is set in .env
    // 'servants' is the config name, 'prd' is the environment
    const response = await doppler.secrets.download("servants", "prd");
    const secrets = /** @type {{ [k: string]: string }} */ (response);

    const config = {
      tgUser: secrets.TG_USER,
      tgTech: secrets.TG_TECH,
      tgBusiness: secrets.TG_BUSINESS || "",
      allowedOrigins: JSON.parse(secrets.ALLOWED_ORIGINS),
      coinsApi: secrets.COINS || "",
      coinsStoreApi: secrets.COINS_STORE || "",
      mongoDb: secrets.MONGO_DB || "",
      proxyMarketVibe: secrets.PROXY_MARKET_VIBE || "",
      projectName: "Render-Market-Vibe",
      renderOiServer: secrets.RENDER_OI_SERVER || "",
      limitKline: Number(secrets.LIMIT_KLINE) || 52,
      limitOi: Number(secrets.LIMIT_OI) || 52,
      limitFr: Number(secrets.LIMIT_FR) || 53,
      delayInMinutesShort: 5,
      delayInMinutesLong: 10,
    };

    servantConfigCache.set("config", config);
    console.log("✅ ServantsConfigOperator → initialized...");
  } catch (err) {
    console.error("Failed to initialize configuration:", err);
    throw err;
  }
}

function getServantConfig() {
  if (!servantConfigCache.get("config")) {
    throw new Error(
      "ServantsConfigOperator is not initialized. Call initialize() first."
    );
  }
  return servantConfigCache.get("config"); // Return the configuration from the cache
}

async function reloadServantConfig() {
  await initializeServantsConfig();
}

module.exports = {
  initializeServantsConfig,
  getServantConfig,
  reloadServantConfig,
};
