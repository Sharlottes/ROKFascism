// @ts-check

const fs = require("fs");
const path = require("path");
const res = fs.readFileSync(path.resolve(__dirname, "../assets/loc.txt"), "utf-8");
const krarr = [];
/** @type { Array<Partial<Record<"localName" | "engName" | "korName" | "xTile" | "yTile" | "provinceName", string>>>} */
const arr = [];
let c = {};
let cLine = "";
for (const line of res.split("\n")) {
  const isEmpty = line.startsWith(" ");
  const isStarter = line.startsWith("=");
  if (isStarter) {
    cLine = line;
    c[cLine] = 0;
  }
  if (isEmpty || isStarter) {
    continue;
  } else {
    const match = line.match(/(.*)\((.*)\)\[(.*)\]\((.*),(.*)\)\s?-?\s?(.*)?/);
    if (!match) continue;
    const [, localName, engName, korName, xTile, yTile, provinceName] = match;
    arr.push({ localName, engName, korName, xTile, yTile, provinceName });

    krarr.push({ xTile, yTile });

    c[cLine]++;
  }
}

fs.writeFileSync(path.resolve(__dirname, "../assets/loc.json"), JSON.stringify(arr));
console.log(krarr);
