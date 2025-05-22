// app/initialize-app.js
const ServantsConfigOperator = require("@global/servants/servants-config");

async function initializeServantsConfig() {
  await ServantsConfigOperator.initialize();
}

module.exports = { initializeServantsConfig };
