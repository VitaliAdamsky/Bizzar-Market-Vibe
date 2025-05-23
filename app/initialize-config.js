// app/initialize-app.js
const {
  initializeServantsConfig,
} = require("@global/servants/servant-config/service.js");

async function initializeConfig() {
  await initializeServantsConfig();
}

module.exports = { initializeConfig };
