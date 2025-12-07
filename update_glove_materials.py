import json

# Material mapping based on Ansell specifications
glove_materials = {
    "AlphaTec 02-100": {"material": "LLDPE Laminate", "thickness": "5-layer"},
    "AlphaTec Solvex 37-675": {"material": "Nitrile", "thickness": "0.38 mm"},
    "AlphaTec 38-001": {"material": "Butyl", "thickness": "0.35 mm"},
    "AlphaTec 39-122.124": {"material": "Nitrile", "thickness": "0.38 mm"},
    "AlphaTec 53-002.003": {"material": "Neoprene", "thickness": "0.46 mm"},
    "AlphaTec 58-270": {"material": "Viton", "thickness": "0.40 mm"},
    "AlphaTec 58-530.535": {"material": "Viton", "thickness": "0.65 mm"},
    "DermaShield 73-701.711.721": {"material": "Latex/Nitrile", "thickness": "0.30 mm"},
    "TouchNTuff 92-600.605.93-300.700": {"material": "Nitrile", "thickness": "0.10 mm"},
    "MICROFLEX 93-260.360": {"material": "Nitrile", "thickness": "0.15 mm"}
}

# Load the PPE database
with open('src/data/ppe_database.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Update gloves with correct materials
for glove in data['gloves']:
    glove_name = glove['name']
    if glove_name in glove_materials:
        glove['material'] = glove_materials[glove_name]['material']
        glove['thickness'] = glove_materials[glove_name]['thickness']
        print(f"Updated {glove_name}: {glove['material']} ({glove['thickness']})")
    else:
        print(f"WARNING: No material data for {glove_name}")

# Save the updated database
with open('src/data/ppe_database.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("\n✅ Database updated successfully!")
print(f"Total gloves updated: {len([g for g in data['gloves'] if g['material'] != 'N/A'])}")
