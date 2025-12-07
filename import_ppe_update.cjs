const fs = require('fs');
const path = require('path');

// Read the CSV file
const csvContent = fs.readFileSync('ppe_data_update.csv', 'utf-8');
const lines = csvContent.trim().split('\n');

// Parse header to get glove names
const header = lines[0].split(',');
const gloveColumns = header.slice(2); // Skip CAS and Chemical Name

// Create glove mappings with IDs
const gloves = gloveColumns.map((name, index) => {
    // Extract glove name from column header (e.g., "Glove_MICROFLEX_93-260_360" -> "MICROFLEX 93-260/360")
    const cleanName = name.replace('Glove_', '').replace(/_/g, ' ').replace('-', ' ').trim();
    return {
        id: `g${index + 1}`,
        name: cleanName,
        material: 'N/A',
        thickness: 'N/A'
    };
});

console.log(`📊 Found ${gloves.length} gloves`);

// Parse chemicals and performance data
const chemicals = [];
const performance = [];

for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    if (values.length < 3) continue;

    const cas = values[0].trim();
    const name = values[1].trim();

    // Add chemical (assuming 100% concentration)
    chemicals.push({
        cas,
        name,
        percentage: 100,
        state: 'L' // Default to Liquid
    });

    // Add performance data for each glove
    for (let j = 2; j < values.length && j < header.length; j++) {
        let timeValue = values[j].trim();

        // Normalize time value (remove C, ', etc.)
        timeValue = timeValue.replace(/[Cc']/g, '').trim();

        // Determine color based on time
        let color = 'gray';
        if (timeValue.includes('> 480') || timeValue === '480') {
            color = 'green';
        } else if (timeValue.includes('240-480') || timeValue.includes('120-240')) {
            color = 'yellow';
        } else if (timeValue.includes('60-120') || timeValue.includes('30-60') || timeValue.includes('10-30')) {
            color = 'orange';
        } else if (timeValue.includes('< 10') || timeValue.includes('< 2') || timeValue.includes('4')) {
            color = 'red';
        }

        performance.push({
            cas,
            percentage: 100,
            gloveId: gloves[j - 2].id,
            time: timeValue,
            color
        });
    }
}

console.log(`✅ Processed ${chemicals.length} chemicals`);
console.log(`✅ Created ${performance.length} performance records`);

// Load existing database
const existingDb = JSON.parse(fs.readFileSync('src/data/ppe_database.json', 'utf-8'));

// Merge with existing data
const mergedChemicals = [...existingDb.chemicals];
const mergedGloves = [...existingDb.gloves];
const mergedPerformance = [...existingDb.performance];

// Add new chemicals (avoid duplicates by CAS)
chemicals.forEach(newChem => {
    const exists = mergedChemicals.find(c => c.cas === newChem.cas && c.percentage === newChem.percentage);
    if (!exists) {
        mergedChemicals.push(newChem);
    }
});

// Add new gloves (avoid duplicates by name)
gloves.forEach(newGlove => {
    const exists = mergedGloves.find(g => g.name === newGlove.name);
    if (!exists) {
        mergedGloves.push(newGlove);
    }
});

// Add new performance data (avoid duplicates)
performance.forEach(newPerf => {
    const exists = mergedPerformance.find(p =>
        p.cas === newPerf.cas &&
        p.percentage === newPerf.percentage &&
        p.gloveId === newPerf.gloveId
    );
    if (!exists) {
        mergedPerformance.push(newPerf);
    }
});

// Write updated database
const updatedDb = {
    chemicals: mergedChemicals,
    gloves: mergedGloves,
    performance: mergedPerformance
};

fs.writeFileSync(
    'src/data/ppe_database.json',
    JSON.stringify(updatedDb, null, 2),
    'utf-8'
);

console.log(`\n✅ Database updated successfully!`);
console.log(`📊 Total chemicals: ${mergedChemicals.length}`);
console.log(`📊 Total gloves: ${mergedGloves.length}`);
console.log(`📊 Total performance records: ${mergedPerformance.length}`);
