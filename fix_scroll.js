const fs = require('fs');

// 1. Fix global.css
let css = fs.readFileSync('global.css', 'utf8');
css = css.replace(/body\s*\{[^}]*overflow:\s*hidden[^}]*\}/g, (match) => {
    return match.replace(/overflow:\s*hidden\s*;/g, 'overflow-x: hidden;');
});
css += '\n\nbody.playground { overflow: hidden !important; }\n';
fs.writeFileSync('global.css', css);
console.log('Fixed global.css');

// 2. Add class="playground" to lab files that need it
const playgroundFiles = ['lab2.html', 'lab3.html', 'lab4.html', 'lab5.html'];
playgroundFiles.forEach(file => {
    if (fs.existsSync(file)) {
        let html = fs.readFileSync(file, 'utf8');
        if (!html.includes('<body class="playground">')) {
            html = html.replace('<body>', '<body class="playground">');
            fs.writeFileSync(file, html);
            console.log(`Added playground class to ${file}`);
        }
    }
});
