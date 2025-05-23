const { urlCache } = require("@general/report/cache/store.js");

function getUrlCacheData() {
  if (!urlCache.get("url")) {
    throw new Error("UrlCache is empty");
  }
  return urlCache.get("config");
}

function setUrlCacheData(data) {
  urlCache.set("url", data);
}

module.exports = {
  getUrlCacheData,
  setUrlCacheData,
};
