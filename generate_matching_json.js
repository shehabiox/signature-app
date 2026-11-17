const fs = require('fs');
const path = require('path');

const matchDir = 'C:/Users/Elmasrypc/Desktop/matching';
const reportPath = path.join('public', 'matching_debug.json');

try {
  const items = fs.readdirSync(matchDir, { withFileTypes: true });
  const structure = items.map(item => ({
    name: item.name,
    isDirectory: item.isDirectory(),
    children: item.isDirectory() ? fs.readdirSync(path.join(matchDir, item.name)) : []
  }));
  fs.writeFileSync(reportPath, JSON.stringify(structure, null, 2));
} catch (e) {
  fs.writeFileSync(reportPath, JSON.stringify({ error: e.message }, null, 2));
}
