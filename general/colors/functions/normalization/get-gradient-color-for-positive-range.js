// Дивергирующая шкала с явным доменом
const {
  interpolateColor,
} = require("@general/colors/functions/normalization/interpolate-color.js");

function getGradientColorForPositiveRange(value, startColor, endColor) {
  const clamped = Math.max(0, Math.min(1, value));
  return interpolateColor(startColor, endColor, clamped);
}

module.exports = { getGradientColorForPositiveRange };
