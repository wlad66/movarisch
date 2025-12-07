import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvPath = path.join(__dirname, 'ppe_data_new.csv');
const jsonPath = path.join(__dirname, 'src', 'data', 'ppe_database.json');

const csvContent = fs.readFileSync(csvPath, 'utf-8');
const lines = csvContent.trim().split('\n');
const headers = lines[0].split(',').map(h => h.trim());

// Extract glove names from headers (starting from index 4)
const gloveHeaders = headers.slice(4);
const gloves = gloveHeaders.map((header, idx) => ({
    id: `g${idx + 1}`,
    name: header.replace(/_/g, ' '),
    material: 'N/A',
    thickness: 'N/A'
}));

const chemicalsMap = new Map(); // Use Map to deduplicate by CAS+Percentage
const performance = [];

// Process data lines
for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(',').map(cell => cell.trim());

    if (row.length < 4) continue;

    const cas = row[0];
    const name = row[1];
    const percentage = row[2];
    const state = row[3];

    // Create unique key for deduplication
    const chemKey = `${cas}_${percentage}`;

    // Add chemical if not already present
    if (!chemicalsMap.has(chemKey)) {
        chemicalsMap.set(chemKey, {
            cas,
            name,
            percentage: parseFloat(percentage),
            state
        });
    }

    // Process performance data for each glove
    for (let j = 4; j < row.length && j < headers.length; j++) {
        const timeValue = row[j];
        if (!timeValue || timeValue === 'N.A.') continue;

        const gloveIndex = j - 4;
        if (gloveIndex >= gloves.length) break;

        const gloveId = gloves[gloveIndex].id;

        // Determine color based on time value
        let color = 'gray';
        const cleanTime = timeValue.replace(/'/g, '').trim();

        if (cleanTime.includes('> 480') || cleanTime.includes('>480')) {
            color = 'green';
        } else if (cleanTime.includes('< 10') || cleanTime.includes('<10')) {
            color = 'red';
        } else if (cleanTime.includes('10-30') || cleanTime.includes('30-60')) {
            color = 'orange';
        } else if (cleanTime.includes('60-120') || cleanTime.includes('120-240') || cleanTime.includes('240-480')) {
            color = 'yellow';
        } else {
            // Try to parse numeric value
            const numMatch = cleanTime.match(/(\d+)/);
            if (numMatch) {
                const num = parseInt(numMatch[1]);
                if (num >= 480) color = 'green';
                else if (num >= 60) color = 'yellow';
                else if (num >= 10) color = 'orange';
                else color = 'red';
            }
        }

        performance.push({
            cas,
            percentage: parseFloat(percentage),
            gloveId,
            time: cleanTime,
            color
        });
    }
}

// Convert Map to Array
const chemicals = Array.from(chemicalsMap.values());

const db = {
    chemicals,
    gloves,
    performance
};

fs.writeFileSync(jsonPath, JSON.stringify(db, null, 2));
console.log(`✅ Imported ${chemicals.length} unique chemicals, ${gloves.length} gloves, and ${performance.length} performance records.`);
console.log(`📊 Duplicates removed based on CAS + Percentage combination.`);
