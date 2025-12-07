# PPE Database Generator

## Overview
This script generates the PPE database JSON file from a CSV source file containing chemical and glove performance data.

## Usage

### 1. Prepare your CSV file
Create a file named `ppe_complete_data.csv` in the project root with this format:

```csv
CAS,Chemical_Name,Glove_AlphaTec_02-100,Glove_AlphaTec_Solvex_37-675,Glove_AlphaTec_38-001,...
123-75-1,Azacyclopentane,> 480,10-30,60-120,< 10,240-480,...
110-86-1,Azine,> 480,10,60-120,< 10,323,...
```

**CSV Structure:**
- **Column 1**: CAS number
- **Column 2**: Chemical name (can include percentage, e.g., "Ammonia (33%)")
- **Columns 3-12**: Permeation times for each of the 10 gloves

### 2. Run the generator

```bash
node generate_database.cjs
```

### 3. Output
The script will:
- ✅ Read `ppe_complete_data.csv`
- ✅ Parse all chemical data
- ✅ Assign colors based on permeation times
- ✅ Extract percentages from chemical names
- ✅ Determine physical states (L/S/G)
- ✅ Create backup of existing database
- ✅ Generate new `src/data/ppe_database.json`
- ✅ Display statistics

## Color Coding Rules

| Color | Time Range | Protection Level |
|-------|------------|------------------|
| 🟢 Green | >= 240 min | Excellent |
| 🟡 Yellow | 120-239 min | Good |
| 🟠 Orange | 30-119 min | Moderate |
| 🔴 Red | < 30 min | Poor |
| ⚪ Gray | N/A | Unknown |

## Physical State Detection

The script automatically detects physical states from chemical names:

- **Gas (G)**: Contains "gas", "atmosfera", "anhydrous", "fumante", "fuming"
- **Solid (S)**: Contains "anidro", "crystals", "anhydride", "solid", "powder"
- **Liquid (L)**: Default for all others

## Percentage Extraction

Automatically extracts concentration from names:
- "Ammonia (33%)" → 33%
- "HCl 37%" → 37%
- "Acetone" → 100% (default)

## Glove Configuration

The script includes these 10 gloves:

1. AlphaTec 02-100 - LLDPE Laminate (5-layer)
2. AlphaTec Solvex 37-675 - Nitrile (0.38 mm)
3. AlphaTec 38-001 - Butyl (0.35 mm)
4. AlphaTec 39-122.124 - Nitrile (0.38 mm)
5. AlphaTec 53-002.003 - Neoprene (0.46 mm)
6. AlphaTec 58-270 - Viton (0.40 mm)
7. AlphaTec 58-530.535 - Viton (0.65 mm)
8. DermaShield 73-701.711.721 - Latex/Nitrile (0.30 mm)
9. TouchNTuff 92-600.605.93-300.700 - Nitrile (0.10 mm)
10. MICROFLEX 93-260.360 - Nitrile (0.15 mm)

## Adding New Gloves

To add new gloves, edit the `GLOVES` array in `generate_database.cjs`:

```javascript
const GLOVES = [
  // ... existing gloves ...
  { id: "g11", name: "New Glove Name", material: "Material", thickness: "X.XX mm" }
];
```

Then add a corresponding column to your CSV file.

## Updating the Database

1. Edit `ppe_complete_data.csv`
   - Add new chemicals (new rows)
   - Add new gloves (new columns)
   - Update permeation times

2. Run the generator:
   ```bash
   node generate_database.cjs
   ```

3. The application will automatically use the new database

## Backup

The script automatically creates a timestamped backup before overwriting:
```
src/data/ppe_database_backup_2025-12-06T12-54-00.json
```

## Troubleshooting

### Error: File "ppe_complete_data.csv" not found
- Create the CSV file in the project root
- Ensure it's named exactly `ppe_complete_data.csv`

### Skipped rows
- Check for empty CAS or chemical name fields
- Ensure CSV format is correct (comma-separated)
- Check for special characters in chemical names

### Incorrect colors
- Verify permeation time format (e.g., "> 480", "120-240", "< 10")
- Check for typos in time values

## Example Output

```
🚀 PPE Database Generator

==================================================

📂 Reading CSV file: ppe_complete_data.csv
   Found 429 data rows (excluding header)

🧤 Detected 10 glove columns
   Processed 50 chemicals...
   Processed 100 chemicals...
   ...

✅ Processing complete!
   - Chemicals: 429
   - Gloves: 10
   - Performance entries: 4290
   - Skipped rows: 0

💾 Backup created: src/data/ppe_database_backup_2025-12-06T12-54-00.json

💾 New database saved: src/data/ppe_database.json

📊 Database Statistics:
   - Total chemicals: 429
   - Unique CAS numbers: 380
   - Liquids: 410
   - Solids: 12
   - Gases: 7

🚦 Performance Distribution:
   - Green (>= 240 min): 2145 (50.0%)
   - Yellow (120-239 min): 856 (20.0%)
   - Orange (30-119 min): 643 (15.0%)
   - Red (< 30 min): 515 (12.0%)
   - Gray (N/A): 131 (3.0%)

==================================================
✅ Database generation complete!
==================================================
```
