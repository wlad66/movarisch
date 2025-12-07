const fs = require('fs');

console.log('🚀 PPE Database Generator\n');
console.log('='.repeat(50));

const CSV_FILES = [
    'Ansell_Untitled Report Name 1.csv',
    'Ansell_Untitled Report Name 2.csv',
    'Ansell_Untitled Report Name 3.csv',
    'Ansell_Untitled Report Name 4.csv',
    'Ansell_Untitled Report Name 6.csv',
    'Ansell_Untitled Report Name 7.csv'
];
const OUTPUT_FILE = 'src/data/ppe_database.json';

const GLOVES = [
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

function getColor(time) {
    if (!time || time === 'N.A.' || time === 'N/A') return 'gray';
    const timeStr = time.toString().trim();
    if (timeStr.startsWith('>')) return 'green';
    if (timeStr.startsWith('<')) {
        const num = parseInt(timeStr.substring(1).trim());
        return num <= 10 ? 'red' : num <= 30 ? 'orange' : 'yellow';
    }
    if (timeStr.includes('-')) {
        const minTime = parseInt(timeStr.split('-')[0].trim());
        if (isNaN(minTime)) return 'gray';
        return minTime >= 240 ? 'green' : minTime >= 120 ? 'yellow' : minTime >= 30 ? 'orange' : 'red';
    }
    const num = parseInt(timeStr);
    if (isNaN(num)) return 'gray';
    return num >= 240 ? 'green' : num >= 120 ? 'yellow' : num >= 30 ? 'orange' : 'red';
}

function extractPercentage(name) {
    const match = name.match(/\((\d+(?:\.\d+)?)\s*%/) || name.match(/(\d+(?:\.\d+)?)\s*%/);
    return match ? parseFloat(match[1]) : 100;
}

function getPhysicalState(name) {
    const n = name.toLowerCase();
    if (n.includes('gas') || n.includes('fumante') || n.includes('anhydrous')) return 'G';
    if (n.includes('crystals') || n.includes('anhydride') || n.includes('solid')) return 'S';
    return 'L';
}

try {
    const missing = CSV_FILES.filter(f => !fs.existsSync(f));
    if (missing.length > 0) {
        console.error(`\n❌ Missing: ${missing.join(', ')}`);
        process.exit(1);
    }

    console.log(`\n📂 Processing ${CSV_FILES.length} files...\n`);

    const chemicals = [];
    const performance = [];
    const chemicalMap = new Map();
    let total = 0;

    CSV_FILES.forEach((file, idx) => {
        console.log(`   [${idx + 1}/${CSV_FILES.length}] ${file}`);
        const lines = fs.readFileSync(file, 'utf8').trim().split('\n');
        let count = 0;

        for (let i = 1; i < lines.length; i++) {
            const vals = lines[i].split(',');
            if (vals.length < 3) continue;

            const cas = vals[0].trim();
            const name = vals[1].trim();
            if (!cas || !name) continue;

            const pct = extractPercentage(name);
            const key = `${cas}_${pct}`;

            if (!chemicalMap.has(key)) {
                chemicals.push({ cas, name, percentage: pct, state: getPhysicalState(name) });
                chemicalMap.set(key, true);
            }

            for (let g = 0; g < GLOVES.length && g + 2 < vals.length; g++) {
                const time = vals[g + 2].trim();
                performance.push({ cas, gloveId: GLOVES[g].id, time, color: getColor(time), percentage: pct });
            }

            count++;
            total++;
        }

        console.log(`      ✓ ${count} chemicals`);
    });

    const database = { chemicals, gloves: GLOVES, performance };

    console.log(`\n✅ Complete!`);
    console.log(`   Total chemicals: ${chemicals.length}`);
    console.log(`   Performance entries: ${performance.length}`);

    if (fs.existsSync(OUTPUT_FILE)) {
        const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const backup = OUTPUT_FILE.replace('.json', `_backup_${ts}.json`);
        fs.copyFileSync(OUTPUT_FILE, backup);
        console.log(`\n💾 Backup: ${backup}`);
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(database, null, 2));
    console.log(`💾 Database: ${OUTPUT_FILE}\n`);
    console.log('='.repeat(50));
    console.log('✅ Done!\n');

} catch (error) {
    console.error(`\n❌ ERROR: ${error.message}`);
    process.exit(1);
}
