// utils/compression-utils.js
const pako = require("pako");

function compressToBase64(obj) {
  const jsonStr = JSON.stringify(obj);
  const compressed = pako.deflate(jsonStr);
  return Buffer.from(compressed).toString("base64");
}

function decompressFromBase64(base64Str) {
  const compressed = Buffer.from(base64Str, "base64");
  const decompressed = pako.inflate(compressed, { to: "string" });
  return JSON.parse(decompressed);
}

module.exports = {
  compressToBase64,
  decompressFromBase64,
};
