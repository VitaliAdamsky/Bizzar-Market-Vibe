// oiCache.js
const { colorsCache } = require("@general/colors/cache/store.js");

const {
  fetchColors,
} = require("@general/colors/functions/http/fetch-colors.js");

async function initializeColorsCache() {
  try {
    const colors = await fetchColors();
    setColorsCache(colors);
    console.log("🌈 [Colors Cache] Colors → set in cache...");
  } catch (err) {
    console.error("❌ [Colors Cache] intialization failed:", err);
    throw err;
  }
}

function setColorsCache(data) {
  colorsCache.set("colors", data);
}

function getColorsCache() {
  return colorsCache.get("colors");
}

module.exports = {
  setColorsCache,
  getColorsCache,
  initializeColorsCache,
};
