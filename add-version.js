import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Leggi index.html
const indexPath = path.join(__dirname, 'dist', 'index.html');
let html = fs.readFileSync(indexPath, 'utf-8');

// Aggiungi timestamp come query parameter ai file JS e CSS
const timestamp = Date.now();
html = html.replace(/(<script[^>]*src="[^"]+\.js")/g, `$1?v=${timestamp}`);
html = html.replace(/(<link[^>]*href="[^"]+\.css")/g, `$1?v=${timestamp}`);

// Scrivi il file modificato
fs.writeFileSync(indexPath, html);

console.log(`✓ Added version timestamp: ${timestamp}`);
