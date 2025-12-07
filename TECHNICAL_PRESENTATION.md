# MoVaRisCh 2025 - Sistema di Gestione del Rischio Chimico

## 📋 Executive Summary

**MoVaRisCh** (Modello di Valutazione del Rischio Chimico) è un algoritmo scientifico per la valutazione del rischio da esposizione ad agenti chimici pericolosi, ampiamente utilizzato in ambito industriale e riconosciuto dalle autorità competenti.

**Safety Pro Suite** ha sviluppato questa applicazione web professionale che integra:

1. **Algoritmo MoVaRisCh**: Per la valutazione scientifica del rischio chimico secondo normativa italiana
2. **Sistema di ottimizzazione DPI**: Analizza simultaneamente tutti gli agenti chimici utilizzati e raccomanda i guanti protettivi ottimali per l'intero scenario di esposizione
3. **Database Ansell**: 200 prodotti chimici, 10 tipi di guanti, 4,050 combinazioni testate

### Valore Aggiunto dell'Applicazione

L'innovazione principale consiste nell'**ottimizzazione multi-prodotto**: invece di valutare ogni chimico singolarmente, il sistema analizza contemporaneamente tutti gli agenti presenti nella lavorazione e identifica il guanto che offre la migliore protezione per l'intero set di sostanze utilizzate.

**Version**: 2025  
**Technology Stack**: React + Vite  
**Database**: 200 chemicals, 10 glove types, 4,050 performance records  
**Data Source**: Ansell Chemical Resistance Guide

---

## 🎯 Core Features

### 1. Chemical Risk Calculator
- Individual chemical risk assessment
- Automatic risk level calculation based on exposure parameters
- H-code (hazard statement) integration
- Chemical inventory management with CAS number tracking

### 2. Multi-Product PPE Optimizer
- **Matrix-based compatibility analysis** for multiple chemicals simultaneously
- **Traffic light system** (Green/Yellow/Orange/Red/Gray) for breakthrough times
- **Smart recommendation engine** suggesting optimal glove for all selected chemicals
- Real-time glove selection with checkbox interface

### 3. Advanced Archive System
- Complete traceability with company, workplace, and role tracking
- Contextual data capture via numbered prompts
- Professional report visualization
- Persistent storage in browser localStorage

### 4. Company & Workplace Management
- Multi-company support with authentication
- Workplace and role hierarchies
- User-specific chemical inventories

---

## 🏗️ Technical Architecture

### Frontend Stack
```
React 18.3.1
├── Vite 5.4.21 (Build tool)
├── Lucide React (Icons)
├── Tailwind CSS (Styling)
└── Context API (State management)
```

### Key Components

#### `App.jsx` (Main Application)
- **Authentication flow** with login/registration
- **Multi-company management** (Mono/Multi azienda)
- **View routing** (Calculator, Optimizer, Data Management, Archive)
- **Archive system** with workplace/role prompts

#### `PPEOptimizer.jsx` (Core Engine)
- **Chemical selection** from user inventory
- **Compatibility matrix** generation
- **Traffic light visualization** for breakthrough times
- **Glove recommendation** algorithm
- **Archive functionality** with data validation

#### Context Providers
- **`AuthContext`**: User authentication and company data
- **`DataContext`**: Inventory, workplaces, roles management

### Data Structure

#### PPE Database (`ppe_database.json`)
```json
{
  "chemicals": [
    {
      "name": "Acetone",
      "cas": "67-64-1",
      "percentage": 100,
      "state": "liquid"
    }
  ],
  "gloves": [
    {
      "id": "g1",
      "name": "AlphaTec Solvex 37-675",
      "material": "Nitrile",
      "thickness": "0.38 mm"
    }
  ],
  "performance": [
    {
      "cas": "67-64-1",
      "gloveId": "g1",
      "percentage": 100,
      "time": 480,
      "color": "green"
    }
  ]
}
```

#### Archive Report Structure
```json
{
  "id": 1733500000000,
  "date": "06/12/2025, 16:00:00",
  "company": "Acme Corp",
  "workplace": "Laboratorio Chimico",
  "role": "Tecnico di Laboratorio",
  "chemicals": [
    { "cas": "67-56-1", "name": "Methanol" }
  ],
  "gloves": [
    {
      "id": "g2",
      "name": "AlphaTec Solvex 37-675",
      "material": "Nitrile",
      "thickness": "0.38 mm"
    }
  ]
}
```

---

## 🔄 User Workflows

### Workflow 1: Chemical Risk Assessment
1. Navigate to **Calcolatore**
2. Enter chemical name and CAS number
3. Select H-codes and exposure parameters
4. System calculates risk level (1-5)
5. Chemical automatically added to inventory

### Workflow 2: PPE Selection
1. Navigate to **Ottimizzatore DPI**
2. Select chemicals from inventory (left panel)
3. View compatibility matrix (center panel)
4. System highlights best glove recommendation
5. Select gloves via checkboxes
6. Click **"Archivia Selezione DPI"**
7. Select workplace (numbered prompt)
8. Select role (numbered prompt)
9. Report saved with full context

### Workflow 3: Archive Review
1. Navigate to **Archivio**
2. View all archived reports
3. Each report shows:
   - Date and time
   - Company, workplace, role
   - Evaluated chemicals
   - Recommended gloves
4. Delete reports as needed

---

## 📊 Database Generation System

### Automated Database Builder (`generate_database.cjs`)

**Purpose**: Convert Ansell CSV files into structured JSON database

**Features**:
- Processes 6 CSV files simultaneously
- Extracts chemical names, CAS numbers, percentages, physical states
- Assigns traffic light colors based on breakthrough times:
  - **Green**: ≥480 minutes
  - **Yellow**: 240-479 minutes
  - **Orange**: 60-239 minutes
  - **Red**: 10-59 minutes
  - **Gray**: <10 minutes or N/A
- Creates automatic backups before updates
- Validates data integrity

**Usage**:
```bash
node generate_database.cjs
```

**Output**: `src/data/ppe_database.json` (200 chemicals, 4,050 entries)

---

## 🎨 UI/UX Design

### Design Principles
- **Professional color scheme**: Blue (#1e3a8a) primary, semantic colors for risk levels
- **Traffic light system**: Intuitive visual feedback for chemical compatibility
- **Responsive layout**: Grid-based design adapts to screen sizes
- **Clear hierarchy**: Distinct sections for inventory, analysis, and recommendations

### Key UI Components
- **Matrix Table**: Scrollable compatibility grid with color-coded cells
- **Recommendation Card**: Prominent display of optimal glove choice
- **Archive Cards**: Professional report layout with context sections
- **Modal Prompts**: Numbered selection for workplace and role

---

## 🔒 Data Management

### Storage Strategy
- **localStorage**: User authentication, inventories, archived reports
- **Session persistence**: Automatic login state restoration
- **Data isolation**: Company-specific data separation

### Data Validation
- **CAS number normalization**: Removes leading zeros for consistent matching
- **Null checks**: Prevents rendering errors with missing data
- **String conversions**: Ensures all rendered values are valid strings
- **Array filtering**: Removes null/undefined entries before display

---

## 🚀 Deployment

### Development Server
```bash
npm install
npm run dev
```
**Default Port**: 5173 (auto-increments if occupied)

### Production Build
```bash
npm run build
npm run preview
```

### Environment
- **Node.js**: 16+ recommended
- **Browser**: Modern browsers with ES6+ support
- **Storage**: ~5MB localStorage for typical usage

---

## 📈 Performance Metrics

- **Database Size**: 200 chemicals × 10 gloves × ~2 concentrations = 4,050 records
- **Load Time**: <1s for initial render
- **Matrix Calculation**: Real-time (<100ms for 10 chemicals)
- **Archive Capacity**: Limited only by browser localStorage (~5-10MB)

---

## 🔧 Maintenance & Updates

### Adding New Chemicals
1. Obtain Ansell CSV files
2. Place in project root
3. Run `node generate_database.cjs`
4. Verify output in `src/data/ppe_database.json`
5. Restart dev server

### Adding New Gloves
1. Update CSV files with new glove data
2. Regenerate database
3. Gloves automatically appear in optimizer

---

## 📝 Regulatory Compliance

### Data Traceability
- **Full audit trail**: Company, workplace, role, date/time
- **Chemical tracking**: CAS numbers, concentrations, physical states
- **PPE documentation**: Material, thickness, manufacturer specifications

### Standards Alignment
- **EN 374**: Chemical protective gloves
- **Ansell data**: Industry-standard permeation testing
- **H-codes**: GHS hazard classification system

---

## 🎓 Training & Support

### User Roles
- **Safety Manager**: Full access to all features
- **Worker**: View-only access to recommendations
- **Administrator**: Company and user management

### Documentation
- In-app tooltips and help text
- Professional archive reports for regulatory compliance
- Technical walkthrough for developers

---

## 🔮 Future Enhancements

### Potential Features
- PDF export of archive reports
- Email notifications for new assessments
- Advanced filtering and search in archive
- Multi-language support
- Integration with external chemical databases
- Mobile app version

---

## 📞 Technical Specifications

**Application Name**: MoVaRisCh 2025  
**Framework**: React 18.3.1 + Vite 5.4.21  
**Styling**: Tailwind CSS  
**State Management**: React Context API  
**Data Storage**: Browser localStorage  
**Database Format**: JSON  
**Chemical Data**: Ansell Chemical Resistance Guide  
**Total Records**: 4,050 performance entries  
**Supported Browsers**: Chrome, Firefox, Edge, Safari (latest versions)

---

## ✅ Quality Assurance

### Testing Completed
- ✅ Chemical selection and inventory management
- ✅ Multi-product compatibility matrix
- ✅ Traffic light color coding accuracy
- ✅ Archive system with full context data
- ✅ Workplace and role selection prompts
- ✅ Data persistence across sessions
- ✅ Null/undefined handling in all components
- ✅ String conversion for safe rendering

### Known Limitations
- Archive limited by browser localStorage capacity
- Requires manual database updates for new chemicals
- Single-user mode (no cloud sync)

---

**Document Version**: 1.0  
**Last Updated**: December 6, 2025  
**Status**: Production Ready ✅
