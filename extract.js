const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

let globalCSS = '';
const processedSelectors = new Set();

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  const styleRegex = /<style>([\s\S]*?)<\/style>/i;
  const match = content.match(styleRegex);
  
  if (match) {
    let cssContent = match[1];
    
    // Simple deduplication comment to know where it came from
    globalCSS += `\n/* --- STYLES FROM ${file} --- */\n`;
    globalCSS += cssContent;
    
    // Replace style tag with link tag
    const linkTag = `<link rel="stylesheet" href="global.css" />`;
    // Only add if not already there
    if (!content.includes('href="global.css"')) {
      content = content.replace(styleRegex, linkTag);
    } else {
      content = content.replace(styleRegex, '');
    }
    
    fs.writeFileSync(filePath, content);
    console.log(`Processed ${file}`);
  }
});

fs.writeFileSync(path.join(dir, 'global.css'), globalCSS);
console.log('Created global.css');
