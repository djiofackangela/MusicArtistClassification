const fs = require("fs/promises");
const path = require("path");

const baseDir = path.join(__dirname, "..", "data");

async function readJson(fileName) {
  const filePath = path.join(baseDir, fileName);
  const content = await fs.readFile(filePath, "utf-8");
  return JSON.parse(content || "[]");
}

async function writeJson(fileName, data) {
  const filePath = path.join(baseDir, fileName);
  const json = JSON.stringify(data, null, 2);
  await fs.writeFile(filePath, json, "utf-8");
  return true;
}

module.exports = { readJson, writeJson };
