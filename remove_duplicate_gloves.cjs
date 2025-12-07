const fs = require('fs');

// Load the PPE database
const data = JSON.parse(fs.readFileSync('src/data/ppe_database.json', 'utf8'));

console.log(`Total gloves before cleanup: ${data.gloves.length}`);

// Names with spaces that are duplicates (to be removed)
const duplicateNames = [
    "MICROFLEX 93 260 360",
    "TouchNTuff 92 600 605",
    "DermaShield 73 701 711",
    "AlphaTec 58 530 535",
    "AlphaTec 58 270",
    "AlphaTec 53 002 003",
    "AlphaTec 39 122 124",
    "AlphaTec 38 001",
    "AlphaTec Solvex 37 675",
    "AlphaTec 02 100"
];

// Remove duplicates
const originalLength = data.gloves.length;
data.gloves = data.gloves.filter(glove => {
    if (duplicateNames.includes(glove.name)) {
        console.log(`❌ Removing duplicate: ${glove.name}`);
        return false;
    }
    return true;
});

console.log(`\nTotal gloves after cleanup: ${data.gloves.length}`);
console.log(`Removed ${originalLength - data.gloves.length} duplicates`);

// Save the updated database
fs.writeFileSync('src/data/ppe_database.json', JSON.stringify(data, null, 2), 'utf8');

console.log('\n✅ Database cleaned successfully!');
