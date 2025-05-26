function getGradientColorForNegativeRange(value, minColor, maxColor) {
  return value === 0 ? "#f5f5f0" : value > 0 ? maxColor : minColor;
}

module.exports = { getGradientColorForNegativeRange };
