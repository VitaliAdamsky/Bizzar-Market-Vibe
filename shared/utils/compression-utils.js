// compression-utils.js
const zlib = require("zlib");

/**
 * Compress a JS object into a gzip Buffer and encode to Base64
 * @param {Object} data - The data to compress
 * @returns {string} - The Base64 encoded compressed gzip buffer
 */
function compressToGzipBase64(data) {
  const json = JSON.stringify(data);
  const compressedBuffer = zlib.gzipSync(Buffer.from(json), {
    level: zlib.constants.Z_BEST_COMPRESSION,
  });
  return compressedBuffer.toString("base64");
}

/**
 * Decode from Base64 and decompress from a gzip Buffer into a JS object
 * @param {string} base64String - The Base64 encoded compressed gzip buffer
 * @returns {Object} - The decompressed data
 */
function decompressFromGzipBase64(base64String) {
  const compressedBuffer = Buffer.from(base64String, "base64");
  const json = zlib.gunzipSync(compressedBuffer).toString();
  return JSON.parse(json);
}

module.exports = {
  compressToGzipBase64,
  decompressFromGzipBase64,
};
