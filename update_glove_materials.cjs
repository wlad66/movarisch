const fs = require('fs');

// Material mapping based on Ansell specifications
const gloveMaterials = {
    "AlphaTec 02-100": { material: "LLDPE Laminate", thickness: "5-layer" },
    "AlphaTec Solvex 37-675": { material: "Nitrile", thickness: "0.38 mm" },
    "AlphaTec 38-001": { material: "Butyl", thickness: "0.35 mm" },
    "AlphaTec 39-122.124": { material: "Nitrile", thickness: "0.38 mm" },
    "AlphaTec 53-002.003": { material: "Neoprene", thickness: "0.46 mm" },
    "AlphaTec 58-270": { material: "Viton", thickness: "0.40 mm" },
    "AlphaTec 58-530.535": { material: "Viton", thickness: "0.65 mm" },
    "DermaShield 73-701.711.721": { material: "Latex/Nitrile", thickness: "0.30 mm" },
    "TouchNTuff 92-600.605.93-300.700": { material: "Nitrile", thickness: "0.10 mm" },
    "MICROFLEX 93-260.360": { material: "Nitrile", thickness: "0.15 mm" }
};

// Load the PPE database
const data = JSON.parse(fs.readFileSync('src/data/ppe_database.json', 'utf8'));

let updatedCount = 0;

// Update gloves with correct materials
data.gloves.forEach(glove => {
    const gloveName = glove.name;
    if (gloveMaterials[gloveName]) {
        glove.material = gloveMaterials[gloveName].material;
        glove.thickness = gloveMaterials[gloveName].thickness;
        console.log(`✓ Updated ${gloveName}: ${glove.material} (${glove.thickness})`);
        updatedCount++;
    } else {
        console.log(`⚠ WARNING: No material data for ${gloveName}`);
    }
});

// Save the updated database
fs.writeFileSync('src/data/ppe_database.json', JSON.stringify(data, null, 2), 'utf8');

console.log(`\n✅ Database updated successfully!`);
console.log(`Total gloves updated: ${updatedCount} / ${data.gloves.length}`);
