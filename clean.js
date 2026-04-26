const fs = require('fs');
const path = require('path');

try {
  fs.unlinkSync(path.join(__dirname, 'src', 'app', 'page.tsx'));
  console.log('Deleted src/app/page.tsx');
} catch (e) {
  console.log('Could not delete page.tsx:', e.message);
}

try {
  fs.unlinkSync(path.join(__dirname, 'src', 'app', 'page.module.css'));
  console.log('Deleted src/app/page.module.css');
} catch (e) {
  console.log('Could not delete page.module.css:', e.message);
}

try {
  fs.rmSync(path.join(__dirname, 'src', 'app', 'dashboard'), { recursive: true, force: true });
  console.log('Deleted src/app/dashboard');
} catch (e) {
  console.log('Could not delete dashboard folder:', e.message);
}
