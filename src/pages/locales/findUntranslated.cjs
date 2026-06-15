const fs = require('fs');
const path = require('path');

const engPath = path.join(__dirname, 'eng.json');
const ruPath = path.join(__dirname, 'ru.json');
const uzbPath = path.join(__dirname, 'uzb.json');

const eng = JSON.parse(fs.readFileSync(engPath, 'utf8'));
const ru = JSON.parse(fs.readFileSync(ruPath, 'utf8'));
const uzb = JSON.parse(fs.readFileSync(uzbPath, 'utf8'));

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

let untranslatedUzb = [];
let untranslatedRu = [];

for (const key in flatEng) {
  if (flatEng[key] === flatUzb[key] && isNaN(flatEng[key])) {
    untranslatedUzb.push({ key, val: flatEng[key] });
  }
  if (flatEng[key] === flatRu[key] && isNaN(flatEng[key])) {
    untranslatedRu.push({ key, val: flatEng[key] });
  }
}

console.log('Untranslated in UZB:', untranslatedUzb);
console.log('Untranslated in RU:', untranslatedRu);
