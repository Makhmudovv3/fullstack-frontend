const fs = require('fs');
const path = require('path');

const engPath = path.join(__dirname, 'eng.json');
const ruPath = path.join(__dirname, 'ru.json');
const uzbPath = path.join(__dirname, 'uzb.json');

const eng = JSON.parse(fs.readFileSync(engPath, 'utf8'));
const ru = JSON.parse(fs.readFileSync(ruPath, 'utf8'));
const uzb = JSON.parse(fs.readFileSync(uzbPath, 'utf8'));

// Apply missing translations
if (eng.contact) {
  eng.contact.writeToUs = "Write To Us";
}

if (ru.auth) {
  ru.auth.noAccount = "Нет аккаунта?";
  ru.auth.signUpLink = "Зарегистрироваться";
}

if (ru.contact) {
  ru.contact.writeToUs = "Напишите нам";
}

if (uzb.contact) {
  uzb.contact.writeToUs = "Bizga yozing";
}

// Write back
fs.writeFileSync(engPath, JSON.stringify(eng, null, 4));
fs.writeFileSync(ruPath, JSON.stringify(ru, null, 4));
fs.writeFileSync(uzbPath, JSON.stringify(uzb, null, 4));

console.log("Translations updated!");
