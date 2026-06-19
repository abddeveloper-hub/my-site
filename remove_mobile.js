const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  const modified = content.replace(/<link\s+rel="stylesheet"\s+href="mobile.css"\s*\/?>/gi, '');
  
  if (content !== modified) {
    fs.writeFileSync(filePath, modified);
    console.log(`Removed mobile.css link from ${file}`);
  }
});
