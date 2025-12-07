const fs = require('fs');

// Glove materials and specifications
const gloves = [
    { id: "g1", name: "AlphaTec 02-100", material: "LLDPE Laminate", thickness: "5-layer" },
    { id: "g2", name: "AlphaTec Solvex 37-675", material: "Nitrile", thickness: "0.38 mm" },
    { id: "g3", name: "AlphaTec 38-001", material: "Butyl", thickness: "0.35 mm" },
    { id: "g4", name: "AlphaTec 39-122.124", material: "Nitrile", thickness: "0.38 mm" },
    { id: "g5", name: "AlphaTec 53-002.003", material: "Neoprene", thickness: "0.46 mm" },
    { id: "g6", name: "AlphaTec 58-270", material: "Viton", thickness: "0.40 mm" },
    { id: "g7", name: "AlphaTec 58-530.535", material: "Viton", thickness: "0.65 mm" },
    { id: "g8", name: "DermaShield 73-701.711.721", material: "Latex/Nitrile", thickness: "0.30 mm" },
    { id: "g9", name: "TouchNTuff 92-600.605.93-300.700", material: "Nitrile", thickness: "0.10 mm" },
    { id: "g10", name: "MICROFLEX 93-260.360", material: "Nitrile", thickness: "0.15 mm" }
];

// Function to determine color based on permeation time
function getColor(time) {
    if (!time || time === 'N.A.' || time === 'N/A') return 'gray';

    const timeStr = time.toString().trim();

    // Handle >480 or >=480
    if (timeStr.startsWith('>') || timeStr.startsWith('≥')) return 'green';

    // Handle <10
    if (timeStr.startsWith('<')) {
        const num = parseInt(timeStr.substring(1).trim());
        if (num <= 10) return 'red';
        if (num <= 30) return 'orange';
        return 'yellow';
    }

    // Handle ranges like "120-240"
    if (timeStr.includes('-')) {
        const parts = timeStr.split('-');
        const minTime = parseInt(parts[0].trim());

        if (minTime >= 240) return 'green';
        if (minTime >= 120) return 'yellow';
        if (minTime >= 30) return 'orange';
        return 'red';
    }

    // Handle single numbers
    const num = parseInt(timeStr);
    if (isNaN(num)) return 'gray';

    if (num >= 240) return 'green';
    if (num >= 120) return 'yellow';
    if (num >= 30) return 'orange';
    return 'red';
}

// Function to extract percentage from chemical name
function extractPercentage(name) {
    const match = name.match(/\((\d+(?:\.\d+)?)\s*%/);
    if (match) return parseFloat(match[1]);

    const match2 = name.match(/(\d+(?:\.\d+)?)\s*%/);
    if (match2) return parseFloat(match2[1]);

    return 100;
}

// Function to determine physical state
function getPhysicalState(name) {
    const nameLower = name.toLowerCase();

    if (nameLower.includes('gas') || nameLower.includes('atmosfera') ||
        nameLower.includes('anhydrous') || nameLower.includes('fumante') ||
        nameLower.includes('fuming')) {
        return 'G';
    }

    if (nameLower.includes('anidro') || nameLower.includes('crystals') ||
        nameLower.includes('anhydride') || nameLower.includes('solid') ||
        nameLower.includes('anhydrous')) {
        return 'S';
    }

    return 'L';
}

// Function to parse CSV line (handles commas in values)
function parseCSVLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            values.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    values.push(current.trim());

    return values;
}

// Process CSV data
function processCSVData(csvText) {
    const lines = csvText.trim().split('\n');
    const chemicals = [];
    const performance = [];
    const chemicalMap = new Map();

    // Skip header
    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        if (values.length < 3) continue; // Skip invalid lines

        const cas = values[0].trim();
        const name = values[1].trim();

        if (!cas || !name) continue;

        // Create unique key for chemical (CAS + percentage)
        const percentage = extractPercentage(name);
        const chemKey = `${cas}_${percentage}`;

        // Add chemical if not already added
        if (!chemicalMap.has(chemKey)) {
            chemicals.push({
                cas: cas,
                name: name,
                percentage: percentage,
                state: getPhysicalState(name)
            });
            chemicalMap.set(chemKey, true);
        }

        // Add performance data for each glove
        for (let g = 0; g < gloves.length && g + 2 < values.length; g++) {
            const time = values[g + 2].trim();

            performance.push({
                cas: cas,
                gloveId: gloves[g].id,
                time: time,
                color: getColor(time),
                percentage: percentage
            });
        }
    }

    return { chemicals, performance };
}

console.log('🚀 Creating new PPE database...\n');

// Initialize arrays
let allChemicals = [];
let allPerformance = [];

// Process each block
console.log('📦 Processing Block 1/6...');
const block1 = processCSVData(fs.readFileSync('block1.csv', 'utf8'));
allChemicals = allChemicals.concat(block1.chemicals);
allPerformance = allPerformance.concat(block1.performance);
console.log(`   Added ${block1.chemicals.length} chemicals`);

console.log('📦 Processing Block 2/6...');
const block2 = processCSVData(fs.readFileSync('block2.csv', 'utf8'));
allChemicals = allChemicals.concat(block2.chemicals);
allPerformance = allPerformance.concat(block2.performance);
console.log(`   Added ${block2.chemicals.length} chemicals`);

console.log('📦 Processing Block 3/6...');
const block3 = processCSVData(fs.readFileSync('block3.csv', 'utf8'));
allChemicals = allChemicals.concat(block3.chemicals);
allPerformance = allPerformance.concat(block3.performance);
console.log(`   Added ${block3.chemicals.length} chemicals`);

console.log('📦 Processing Block 4/6...');
const block4 = processCSVData(fs.readFileSync('block4.csv', 'utf8'));
allChemicals = allChemicals.concat(block4.chemicals);
allPerformance = allPerformance.concat(block4.performance);
console.log(`   Added ${block4.chemicals.length} chemicals`);

console.log('📦 Processing Block 5/6...');
const block5 = processCSVData(fs.readFileSync('block5.csv', 'utf8'));
allChemicals = allChemicals.concat(block5.chemicals);
allPerformance = allPerformance.concat(block5.performance);
console.log(`   Added ${block5.chemicals.length} chemicals`);

console.log('📦 Processing Block 6/6...');
const block6 = processCSVData(fs.readFileSync('block6.csv', 'utf8'));
allChemicals = allChemicals.concat(block6.chemicals);
allPerformance = allPerformance.concat(block6.performance);
console.log(`   Added ${block6.chemicals.length} chemicals`);

// Create final database
const database = {
    chemicals: allChemicals,
    gloves: gloves,
    performance: allPerformance
};

console.log(`\n✅ Database created successfully!`);
console.log(`   - Total chemicals: ${allChemicals.length}`);
console.log(`   - Total gloves: ${gloves.length}`);
console.log(`   - Total performance entries: ${allPerformance.length}`);

// Save to file
fs.writeFileSync('src/data/ppe_database.json', JSON.stringify(database, null, 2));
console.log(`\n💾 New database saved to src/data/ppe_database.json`);
