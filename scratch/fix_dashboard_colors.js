const fs = require('fs');
const path = require('path');

const walk = (dir) => {
  let results = [];
  try {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      file = path.join(dir, file);
      const stat = fs.statSync(file);
      if (stat && stat.isDirectory()) {
        results = results.concat(walk(file));
      } else {
        if (file.endsWith('.module.css')) results.push(file);
      }
    });
  } catch (err) {
    // skip
  }
  return results;
};

const dirs = ['src/app/(dashboard)', 'src/components'];
let files = [];
dirs.forEach(d => {
    files = files.concat(walk(d));
});

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  content = content.replace(/rgba\(30,\s*41,\s*59,\s*0\.[0-9]+\)/g, 'var(--card-bg)');
  content = content.replace(/rgba\(15,\s*23,\s*42,\s*0\.[0-9]+\)/g, 'var(--bg-color)');
  content = content.replace(/rgba\(255,\s*255,\s*255,\s*0\.(03|05|1)\)/g, 'var(--card-border)');
  content = content.replace(/rgba\(148,\s*163,\s*184,\s*0\.1\)/g, 'var(--card-border)');
  content = content.replace(/color:\s*white;/g, 'color: var(--text-color);');
  content = content.replace(/color:\s*#f1f5f9;/g, 'color: var(--text-color);');
  content = content.replace(/color:\s*#f8fafc;/g, 'color: var(--text-color);');
  content = content.replace(/color:\s*#94a3b8;/g, 'color: var(--text-muted);');
  content = content.replace(/color:\s*#64748b;/g, 'color: var(--text-muted);');
  
  content = content.replace(/(background:\s*#[a-fA-F0-9]+;[^}]*?)color:\s*var\(--text-color\);/g, '$1color: white;');
  
  content = content.replace(/\.searchBtn\s*\{[^}]+\}/g, (match) => match.replace(/color:\s*var\(--text-color\);/, 'color: white;'));
  content = content.replace(/\.viewDetailsBtn\s*\{[^}]+\}/g, (match) => match.replace(/color:\s*var\(--text-color\);/, 'color: white;'));
  content = content.replace(/\.guideBtn\s*\{[^}]+\}/g, (match) => match.replace(/color:\s*var\(--text-color\);/, 'color: white;'));
  content = content.replace(/\.btnLarge\s*\{[^}]+\}/g, (match) => match.replace(/color:\s*var\(--text-color\);/, 'color: white;'));
  content = content.replace(/\.filterCount\s*\{[^}]+\}/g, (match) => match.replace(/color:\s*var\(--text-color\);/, 'color: white;'));
  content = content.replace(/\.rankingBadge\.top10\s*\{[^}]+\}/g, (match) => match.replace(/color:\s*var\(--text-color\);/, 'color: white;'));
  content = content.replace(/\.testiAvatar\s*\{[^}]+\}/g, (match) => match.replace(/color:\s*var\(--text-color\);/, 'color: white;'));

  if (content !== original) {
      fs.writeFileSync(file, content);
      console.log('Fixed:', file);
  }
});
