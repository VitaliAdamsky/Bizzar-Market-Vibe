const chroma = require("chroma-js");

// Дивергирующая шкала с явным доменом
function getColorFromValue(value, negativeColor, positiveColor) {
  return value === 0 ? "#f5f5f0" : value > 0 ? positiveColor : negativeColor;
}

module.exports = { getColorFromValue };
