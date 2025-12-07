import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvPath = path.join(__dirname, 'ppe_data.csv');
const jsonPath = path.join(__dirname, 'src', 'data', 'ppe_database.json');

const csvContent = fs.readFileSync(csvPath, 'utf-8');
const lines = csvContent.trim().split('\n');
const headers = lines[0].split(',').map(h => h.trim());

// Extract gloves from headers (starting from index 2)
const gloves = [];
for (let i = 2; i < headers.length; i++) {
    const header = headers[i];
    // Example: Glove_AlphaTec_02-100 -> AlphaTec® 02-100
    // We'll try to make it look nice
    let name = header.replace('Glove_', '').replace(/_/g, ' ');

    // Add trademark symbols if missing (heuristic)
    if (name.includes('AlphaTec')) name = name.replace('AlphaTec', 'AlphaTec®');
    if (name.includes('Solvex')) name = name.replace('Solvex', 'Solvex®');
    if (name.includes('TouchNTuff')) name = name.replace('TouchNTuff', 'TouchNTuff®');

    gloves.push({
        id: `g_${i - 1}`, // Simple ID generation
        name: name,
        material: 'N/A', // CSV doesn't have material info, defaulting
        thickness: 'N/A' // CSV doesn't have thickness info, defaulting
    });
}

const chemicals = [];
const performance = [];

// Process data lines
for (let i = 1; i < lines.length; i++) {
    // Handle potential commas in quoted strings (though simple split might suffice for this specific data)
    // The provided data doesn't seem to have quoted fields with commas, so simple split is risky but likely ok for this snippet.
    // Better: use a regex to split by comma only if not in quotes, but let's try simple split first as the data looks clean.
    // Actually, "Cloro gas (>99.8% p/p) 1 atmosfera" has no commas.
    // "Chromium trioxide 50% / Ossido di cromo" has no commas.
    // "Ammonia aqueous sol. (33%)" has no commas.
    // "Carbon Disulphide / Disolfuro di carbonio" has no commas.

    // Wait, "Ammonia aqueous sol. (33%),,120-240..." in line 35 has double comma?
    // "1336-21-6,Ammonia aqueous sol. (33%),,120-240,> 480,10-30,> 480,120-240,120-240,< 10,< 10,10-30"
    // It seems some lines might have empty values.

    const row = lines[i].split(',');

    if (row.length < 2) continue;

    const cas = row[0].trim();
    const name = row[1].trim();

    // Check if chemical already exists (some CAS appear multiple times with different concentrations?)
    // The CSV has duplicates for CAS 1336-21-6 (Ammonia) with different concentrations.
    // We should probably keep them distinct in the chemicals list, maybe by appending concentration to ID or just allowing duplicates in list but unique in selection?
    // The current app selects by CAS. If we have multiple entries for same CAS, the selection might be ambiguous.
    // However, the user provided them. Let's add them all.

    // To distinguish, we might need a unique ID for chemical entry, but the app uses CAS.
    // Let's assume the app filters by CAS. If multiple chemicals have same CAS, it might show the first one.
    // For now, let's just add them.

    chemicals.push({
        cas: cas,
        name: name,
        state: 'L' // Default to Liquid as per previous data, though some are gas. CSV doesn't say.
    });

    // Process performance data
    for (let j = 2; j < row.length; j++) {
        const timeValue = row[j] ? row[j].trim() : '';
        if (!timeValue) continue;

        const gloveIndex = j - 2;
        if (gloveIndex >= gloves.length) break;

        const gloveId = gloves[gloveIndex].id;

        // Determine color based on time
        let color = 'gray';
        if (timeValue.includes('> 480')) color = 'green';
        else if (timeValue.includes('<')) color = 'red';
        else {
            // Try to parse range or number
            const num = parseInt(timeValue.split('-')[0]);
            if (!isNaN(num)) {
                if (num >= 480) color = 'green';
                else if (num >= 60) color = 'yellow'; // > 60 is usually acceptable/caution
                else color = 'red'; // < 60 is poor
            }
        }

        // Special cases from previous logic:
        // > 480 -> green
        // 10-30 -> orange? (User had orange for 10-30 in previous file)
        // 60-120 -> yellow
        // < 10 -> red

        if (timeValue === '10-30') color = 'orange';
        if (timeValue === '30-60') color = 'orange';

        performance.push({
            cas: cas,
            gloveId: gloveId,
            time: timeValue,
            color: color,
            chemicalName: name // Optional, for debugging or if CAS is not unique
        });
    }
}

const db = {
    chemicals,
    gloves,
    performance
};

fs.writeFileSync(jsonPath, JSON.stringify(db, null, 4));
console.log(`Imported ${chemicals.length} chemicals, ${gloves.length} gloves, and ${performance.length} performance records.`);
