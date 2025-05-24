function getColorFromChangeValue(value, negativeHue = 240, positiveHue = 0) {
  const clamped = Math.max(-1, Math.min(1, value));
  const magnitude = Math.abs(clamped);
  const direction = Math.sign(clamped);

  // Interpolate hue between negative and positive
  const hue = lerp(negativeHue, positiveHue, (direction + 1) / 2);

  // Saturation increases with magnitude
  const saturation = Math.min(100, magnitude * 100);

  // Lightness centered at white (100% for zero, drops toward 50% at extremes)
  const lightness = 100 - magnitude * 50;

  return `hsl(${Math.round(hue)}, ${Math.round(saturation)}%, ${Math.round(
    lightness
  )}%)`;
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

module.exports = { getColorFromChangeValue };
