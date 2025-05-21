async function getPLimit(concurrency = 5) {
  const { default: pLimit } = await import("p-limit");
  return pLimit(concurrency);
}

module.exports = { getPLimit };
