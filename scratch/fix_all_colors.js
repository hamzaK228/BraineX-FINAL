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
      if (file.endsWith('.tsx') || file.endsWith('.module.css')) {
        results.push(file);
      }
    }
  });
  return results;
};

const TSX_REPLACEMENTS = [
  { from: /background:\s*"#0f172a"/g, to: 'background: "var(--bg-color)"' },
  { from: /background:\s*"#020617"/g, to: 'background: "var(--bg-color)"' },
  { from: /background:\s*"rgba\(15,\s*23,\s*42,\s*0\.4\)"/g, to: 'background: "var(--bg-color)"' },
  { from: /color:\s*"#94a3b8"/g, to: 'color: "var(--text-muted)"' },
  { from: /color:\s*"#f8fafc"/g, to: 'color: "var(--text-color)"' },
  { from: /color:\s*"#f1f5f9"/g, to: 'color: "var(--text-color)"' },
  { from: /color:\s*"#cbd5e1"/g, to: 'color: "var(--text-muted)"' },
];

const CSS_REPLACEMENTS = [
  { from: /background:\s*#0f172a/g, to: 'background: var(--bg-color)' },
  { from: /background:\s*#020617/g, to: 'background: var(--bg-color)' },
  { from: /background:\s*#1e293b/g, to: 'background: var(--card-bg)' },
  { from: /background:\s*rgba\(15,\s*23,\s*42,\s*0\.4\)/g, to: 'background: var(--card-bg)' },
  { from: /background:\s*rgba\(30,\s*41,\s*59,\s*0\.7\)/g, to: 'background: var(--card-bg)' },
  { from: /color:\s*#94a3b8/g, to: 'color: var(--text-muted)' },
  { from: /color:\s*#cbd5e1/g, to: 'color: var(--text-muted)' },
  { from: /color:\s*#f1f5f9/g, to: 'color: var(--text-color)' },
  { from: /color:\s*#f8fafc/g, to: 'color: var(--text-color)' },
  { from: /border:\s*1px\s*solid\s*rgba\(255,\s*255,\s*255,\s*0\.05\)/g, to: 'border: 1px solid var(--card-border)' },
  { from: /border:\s*1px\s*solid\s*rgba\(255,\s*255,\s*255,\s*0\.1\)/g, to: 'border: 1px solid var(--card-border)' },
];

const dirs = ['src/app/(public)', 'src/components'];

dirs.forEach(dir => {
  const files = walk(dir);
  files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let originalContent = content;

    if (file.endsWith('.tsx')) {
      TSX_REPLACEMENTS.forEach(r => {
        content = content.replace(r.from, r.to);
      });
    } else if (file.endsWith('.module.css')) {
      CSS_REPLACEMENTS.forEach(r => {
        content = content.replace(r.from, r.to);
      });
    }

    if (content !== originalContent) {
      fs.writeFileSync(file, content, 'utf8');
      console.log('Fixed:', file);
    }
  });
});

console.log('Done fixing colors.');
