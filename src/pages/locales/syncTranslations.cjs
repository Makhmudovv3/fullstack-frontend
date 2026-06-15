const fs = require('fs');
const path = require('path');

const engPath = path.join(__dirname, 'eng.json');
const ruPath = path.join(__dirname, 'ru.json');
const uzbPath = path.join(__dirname, 'uzb.json');

const eng = JSON.parse(fs.readFileSync(engPath, 'utf8'));
const ru = JSON.parse(fs.readFileSync(ruPath, 'utf8'));
const uzb = JSON.parse(fs.readFileSync(uzbPath, 'utf8'));

// Flatten object
const flatten = (obj, prefix = '') => {
  return Object.keys(obj).reduce((acc, k) => {
    const pre = prefix.length ? prefix + '.' : '';
    if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
      Object.assign(acc, flatten(obj[k], pre + k));
    } else {
      acc[pre + k] = obj[k];
    }
    return acc;
  }, {});
};

const flatEng = flatten(eng);
const flatRu = flatten(ru);
const flatUzb = flatten(uzb);

const allKeys = new Set([...Object.keys(flatEng), ...Object.keys(flatRu), ...Object.keys(flatUzb)]);

let missingEng = {};
let missingRu = {};
let missingUzb = {};

for (const key of allKeys) {
  if (flatEng[key] === undefined) {
    missingEng[key] = flatRu[key] || flatUzb[key];
  }
  if (flatRu[key] === undefined) {
    missingRu[key] = flatEng[key] || flatUzb[key];
  }
  if (flatUzb[key] === undefined) {
    missingUzb[key] = flatEng[key] || flatRu[key];
  }
}

console.log('Missing in ENG:', Object.keys(missingEng).length);
console.log(JSON.stringify(missingEng, null, 2));

console.log('Missing in RU:', Object.keys(missingRu).length);
console.log(JSON.stringify(missingRu, null, 2));

console.log('Missing in UZB:', Object.keys(missingUzb).length);
console.log(JSON.stringify(missingUzb, null, 2));
