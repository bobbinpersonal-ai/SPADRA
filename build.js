// SPADRA build: decode base64 image chunks into real binary files, then
// assemble the static site into public/ for Vercel.
const fs = require('fs');
const path = require('path');
const root = __dirname;
const out = path.join(root, 'public');
const imgOut = path.join(out, 'images');
fs.mkdirSync(imgOut, { recursive: true });

for (const f of ['index.html', 'sell.html', 'repairs.html', 'shop.html', 'styles.css', 'app.js']) {
  fs.copyFileSync(path.join(root, f), path.join(out, f));
}

const dir = path.join(root, 'imgdata');
let n = 0;
for (const chunk of fs.readdirSync(dir).sort()) {
  if (!chunk.endsWith('.txt')) continue;
  const lines = fs.readFileSync(path.join(dir, chunk), 'utf8').split('\n');
  for (const line of lines) {
    if (!line.trim()) continue;
    const i = line.indexOf(':');
    fs.writeFileSync(path.join(imgOut, line.slice(0, i)), Buffer.from(line.slice(i + 1), 'base64'));
    n++;
  }
}
console.log('SPADRA build: decoded ' + n + ' images into public/');
