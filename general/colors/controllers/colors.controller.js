const { getColorsCache } = require("@general/colors/cache/service.js");
const { postColors } = require("@general/colors/functions/post-colors.js");
const { initializeColorsCache } = require("@general/colors/cache/service.js");

// POST /api/colors → Updates the color object in cache
async function getColorsController(req, res) {
  try {
    const isDefaultColor = req.query.isDefaultColor;
    let colors;
    if (isDefaultColor) {
      colors = await fetchColors(isDefaultColor);
    } else {
      colors = getColorsCache();
    }
    res.status(200).json(colors);
  } catch (err) {
    console.error("❌ [GET COLORS] Error:", err);
    res.status(500).json({ error: "Failed to update colors in cache" });
  }
}

async function setColorsController(req, res) {
  try {
    const isDefaultColor = req.query.isDefaultColor;
    const colors = req.body;
    await postColors(isDefaultColor, colors);
    await initializeColorsCache();
    res.status(200).json({ success: true, colors });
  } catch (err) {
    console.error("❌ [GET COLORS] Error:", err);
    res.status(500).json({ error: "Failed to update colors in cache" });
  }
}

async function updateColorsCacheController(_req, res) {
  try {
    await initializeColorsCache();
    const colors = getColorsCache();
    res.status(200).json({ success: true, colors });
  } catch (err) {
    console.error("❌ [GET COLORS] Error:", err);
    res.status(500).json({ error: "Failed to update colors in cache" });
  }
}

module.exports = {
  getColorsController,
  updateColorsCacheController,
  setColorsController,
};
