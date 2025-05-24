const { getColorsCache } = require("@general/colors/cache/service.js");

const {
  getGradientColorForPositiveRange,
} = require("@general/colors/functions/normalization/get-gradient-color-for-positive-range.js");

const {
  getColorFromChangeValue,
} = require("@general/colors/functions/normalization/get-color-from-change-value.js");

const { getPercentile } = require("@shared/normalization/get-percentile.js");

const PERCENTILE = 99; // Define the percentile constant

function normalizeOpenInterestData(marketDataArray) {
  const colors = getColorsCache();

  return marketDataArray.map((coinData) => {
    const data = coinData.data;

    // Extract open interests and changes
    const openInterests = data.map((item) => item.openInterest ?? 0);
    const openInterestChanges = data.map(
      (item) => item.openInterestChange ?? 0
    );

    // Robust scale for open interest using 99th percentile of absolute values
    const absOpenInterests = openInterests.map(Math.abs);
    const clipValueOI = getPercentile(absOpenInterests, PERCENTILE);
    const scaleOI = clipValueOI === 0 ? 1 : clipValueOI;

    // Robust scale for open interest change
    const absOpenInterestChanges = openInterestChanges.map(Math.abs);
    const clipValueOIChange = getPercentile(absOpenInterestChanges, PERCENTILE);
    const scaleOIChange = clipValueOIChange === 0 ? 1 : clipValueOIChange;

    // Map each item
    const updatedData = data.map((item) => {
      const openInterest = item.openInterest ?? 0;
      const openInterestChange = item.openInterestChange ?? 0;

      // Normalize open interest using tanh with robust scaling
      const scaledOI = openInterest / scaleOI;
      const tanhOI = Math.tanh(scaledOI);
      const normalizedOI = (tanhOI + 1) / 2; // Map to [0, 1]

      // Normalize open interest change using tanh with robust scaling
      const scaledOIChange = openInterestChange / scaleOIChange;
      const tanhOIChange = Math.tanh(scaledOIChange); // Map to [-1, 1]

      const oiColor = getGradientColorForPositiveRange(
        openInterest,
        colors.openInterestMin,
        colors.openInterestMax
      );

      const oiChangeColor = getColorFromChangeValue(
        tanhOIChange,
        -1,
        1,
        colors.openInterestChangeMin,
        colors.openInterestChangeMax
      );

      return {
        ...item,
        normalizedOpenInterest: Number(normalizedOI.toFixed(2)),
        normalizedOpenInterestChange: Number(tanhOIChange.toFixed(2)),
        colors: {
          ...(item.colors || {}),
          openInterest: oiColor,
          openInterestChange: oiChangeColor,
        },
      };
    });

    return {
      ...coinData,
      data: updatedData,
    };
  });
}

module.exports = { normalizeOpenInterestData };
