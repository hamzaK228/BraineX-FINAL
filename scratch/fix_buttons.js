const fs = require('fs');
const path = require('path');

const walk = (dir) => {
  let results = [];
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
  return results;
};

const files = walk('src/app/(public)');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  content = content.replace(/(background:\s*#[a-fA-F0-9]+;[^}]*?)color:\s*var\(--text-color\);/g, '$1color: white;');
  
  // Also we should just do a global replace for specific buttons:
  content = content.replace(/\.searchBtn\s*\{[^}]+\}/g, (match) => match.replace(/color:\s*var\(--text-color\);/, 'color: white;'));
  content = content.replace(/\.viewDetailsBtn\s*\{[^}]+\}/g, (match) => match.replace(/color:\s*var\(--text-color\);/, 'color: white;'));
  content = content.replace(/\.guideBtn\s*\{[^}]+\}/g, (match) => match.replace(/color:\s*var\(--text-color\);/, 'color: white;'));
  content = content.replace(/\.btnLarge\s*\{[^}]+\}/g, (match) => match.replace(/color:\s*var\(--text-color\);/, 'color: white;'));
  content = content.replace(/\.filterCount\s*\{[^}]+\}/g, (match) => match.replace(/color:\s*var\(--text-color\);/, 'color: white;'));
  content = content.replace(/\.rankingBadge\.top10\s*\{[^}]+\}/g, (match) => match.replace(/color:\s*var\(--text-color\);/, 'color: white;'));
  content = content.replace(/\.testiAvatar\s*\{[^}]+\}/g, (match) => match.replace(/color:\s*var\(--text-color\);/, 'color: white;'));

  fs.writeFileSync(file, content);
  console.log('Fixed buttons in:', file);
});
