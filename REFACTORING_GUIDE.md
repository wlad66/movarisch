# Guida al Refactoring Codice MoVaRisCh

## 🎯 Obiettivo

Ridurre la complessità dei file lunghi (server.js ~400 righe, App.jsx 43KB) per:
- ✅ Facilitare manutenzione e lettura
- ✅ Separare responsabilità (SRP - Single Responsibility Principle)
- ✅ Rendere il codice testabile
- ✅ Velocizzare onboarding nuovi sviluppatori

---

## 📊 Stato Attuale

### File Problematici

| File | Righe | Problema |
|------|-------|----------|
| `server/server.js` | ~400 | Tutte le routes + logic in un file |
| `App.jsx` | ~1000 | Routing + matrici + archivio + UI |
| `src/components/DataManagement.jsx` | ~600 | CRUD di 3 entità diverse |
| `src/components/RiskMatrices.jsx` | ~650 | 5 matrici + logica calcolo |
| `src/components/PPEOptimizer.jsx` | ~400 | Selezione + calcolo + UI |

---

## 🏗️ Architettura Proposta

### Backend - Pattern MVC

```
server/
├── server.js                    # 50 righe - Solo setup Express
├── config/
│   ├── database.js              # Pool PostgreSQL + init schema
│   └── env.js                   # Validazione variabili ambiente
├── middleware/
│   ├── auth.js                  # verifyToken
│   ├── validation.js            # Validazione input
│   └── errorHandler.js          # Gestione errori centralized
├── routes/
│   ├── index.js                 # Aggregatore routes
│   ├── auth.routes.js           # POST /register, /login, GET /me
│   ├── workplaces.routes.js     # GET/POST/DELETE /workplaces
│   ├── roles.routes.js
│   ├── inventory.routes.js
│   └── reports.routes.js
├── controllers/
│   ├── auth.controller.js       # Logic autenticazione
│   ├── workplaces.controller.js
│   ├── roles.controller.js
│   ├── inventory.controller.js
│   └── reports.controller.js
├── models/
│   ├── User.js                  # Query user
│   ├── Workplace.js
│   ├── Role.js
│   ├── Inventory.js
│   └── Report.js
└── utils/
    ├── jwt.js                   # generateToken, verifyToken
    └── password.js              # hashPassword, comparePassword
```

### Frontend - Atomic Design

```
src/
├── App.jsx                      # 100 righe - Solo Router
├── pages/
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── DashboardPage.jsx
│   ├── RiskCalculatorPage.jsx
│   ├── PPEOptimizerPage.jsx
│   ├── DataManagementPage.jsx
│   └── ArchivePage.jsx
├── components/
│   ├── auth/
│   │   ├── LoginForm.jsx
│   │   └── RegisterForm.jsx
│   ├── risk/
│   │   ├── Matrix.jsx           # Componente matrice riusabile
│   │   ├── MatrixSelector.jsx   # UI selezione celle
│   │   ├── RiskSummary.jsx      # Display risultati
│   │   └── HCodeSelector.jsx
│   ├── ppe/
│   │   ├── ChemicalSelector.jsx
│   │   ├── GloveSelector.jsx
│   │   ├── CompatibilityTable.jsx
│   │   ├── CompatibilityCell.jsx # Singola cella traffico
│   │   └── Recommendations.jsx
│   ├── data/
│   │   ├── WorkplaceList.jsx
│   │   ├── WorkplaceForm.jsx
│   │   ├── RoleList.jsx
│   │   ├── RoleForm.jsx
│   │   ├── InventoryList.jsx
│   │   └── InventoryForm.jsx
│   ├── archive/
│   │   ├── ArchiveList.jsx
│   │   └── ArchiveItem.jsx
│   └── common/
│       ├── Button.jsx
│       ├── Input.jsx
│       ├── Select.jsx
│       ├── Modal.jsx
│       ├── Card.jsx
│       └── LoadingSpinner.jsx
├── hooks/
│   ├── useRiskCalculation.js    # Logica calcolo rischio
│   ├── usePPEOptimizer.js       # Logica ottimizzazione DPI
│   ├── useArchive.js            # Gestione archivio
│   └── usePagination.js
├── utils/
│   ├── riskAlgorithm.js         # Algoritmo matrici puro
│   ├── ppeMatching.js           # Algoritmo matching
│   ├── casNormalizer.js
│   └── exportWord.js
└── constants/
    └── riskMatrices.js          # Definizione matrici (config)
```

---

## 🔄 Piano di Refactoring Incrementale

### Fase 1: Backend (Settimana 1)

#### Step 1.1: Creare Struttura Cartelle
```bash
cd server
mkdir config middleware routes controllers models utils
```

#### Step 1.2: Estrarre Configurazione
**Prima (server.js):**
```javascript
const pool = new Pool({
    host: process.env.DB_HOST,
    // ...
});
```

**Dopo (config/database.js):**
```javascript
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'movarisch',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD
});

module.exports = pool;
```

**Aggiornato (server.js):**
```javascript
const pool = require('./config/database');
```

#### Step 1.3: Estrarre Middleware
**config/middleware/auth.js:**
```javascript
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');

function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Access denied' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
}

module.exports = { verifyToken };
```

#### Step 1.4: Creare Routes
**routes/workplaces.routes.js:**
```javascript
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const workplacesController = require('../controllers/workplaces.controller');

router.get('/', verifyToken, workplacesController.getAll);
router.post('/', verifyToken, workplacesController.create);
router.delete('/:id', verifyToken, workplacesController.delete);

module.exports = router;
```

#### Step 1.5: Creare Controllers
**controllers/workplaces.controller.js:**
```javascript
const Workplace = require('../models/Workplace');

async function getAll(req, res) {
    try {
        const workplaces = await Workplace.findByUserId(req.user.id);
        res.json(workplaces);
    } catch (error) {
        console.error('Get workplaces error:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

async function create(req, res) {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ error: 'Name is required' });

        const workplace = await Workplace.create(req.user.id, name);
        res.json(workplace);
    } catch (error) {
        console.error('Create workplace error:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

async function deleteWorkplace(req, res) {
    try {
        const deleted = await Workplace.delete(req.params.id, req.user.id);
        if (!deleted) {
            return res.status(404).json({ error: 'Workplace not found' });
        }
        res.json({ message: 'Deleted successfully' });
    } catch (error) {
        console.error('Delete workplace error:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

module.exports = { getAll, create, delete: deleteWorkplace };
```

#### Step 1.6: Creare Models
**models/Workplace.js:**
```javascript
const pool = require('../config/database');

class Workplace {
    static async findByUserId(userId) {
        const sql = `SELECT * FROM workplaces WHERE user_id = $1 ORDER BY id ASC`;
        const result = await pool.query(sql, [userId]);
        return result.rows;
    }

    static async create(userId, name) {
        const sql = `INSERT INTO workplaces (user_id, name) VALUES ($1, $2) RETURNING id, name`;
        const result = await pool.query(sql, [userId, name]);
        return result.rows[0];
    }

    static async delete(id, userId) {
        const sql = `DELETE FROM workplaces WHERE id = $1 AND user_id = $2`;
        const result = await pool.query(sql, [id, userId]);
        return result.rowCount > 0;
    }
}

module.exports = Workplace;
```

#### Step 1.7: Aggiornare server.js
**server.js (FINALE - 50 righe):**
```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const workplacesRoutes = require('./routes/workplaces.routes');
const rolesRoutes = require('./routes/roles.routes');
const inventoryRoutes = require('./routes/inventory.routes');
const reportsRoutes = require('./routes/reports.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/workplaces', workplacesRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/reports', reportsRoutes);

// Error handler (deve essere l'ultimo middleware)
app.use(require('./middleware/errorHandler'));

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

---

### Fase 2: Frontend (Settimana 2)

#### Step 2.1: Estrarre Logica da App.jsx

**Prima (App.jsx - 1000 righe):**
```jsx
function App() {
    // 50 righe di state
    // 200 righe di funzioni calcolo rischio
    // 100 righe gestione archivio
    // 650 righe JSX rendering
}
```

**Dopo (App.jsx - 100 righe):**
```jsx
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import AppRouter from './routes/AppRouter';

function App() {
    return (
        <AuthProvider>
            <DataProvider>
                <AppRouter />
            </DataProvider>
        </AuthProvider>
    );
}
```

#### Step 2.2: Creare Custom Hooks

**hooks/useRiskCalculation.js:**
```javascript
import { useState, useCallback } from 'react';
import { calculateRisk } from '../utils/riskAlgorithm';

export function useRiskCalculation() {
    const [riskLevel, setRiskLevel] = useState(0);
    const [matrices, setMatrices] = useState({
        matrix1: null,
        matrix2: null,
        // ...
    });

    const calculate = useCallback((hCodes, matrices) => {
        const result = calculateRisk(hCodes, matrices);
        setRiskLevel(result);
        return result;
    }, []);

    return { riskLevel, matrices, setMatrices, calculate };
}
```

#### Step 2.3: Separare Componenti

**components/risk/Matrix.jsx (Riusabile):**
```jsx
function Matrix({ rows, cols, values, onCellClick, colorScheme }) {
    return (
        <div className="matrix-grid">
            {values.map((row, i) =>
                row.map((value, j) => (
                    <MatrixCell
                        key={`${i}-${j}`}
                        value={value}
                        color={colorScheme[value]}
                        onClick={() => onCellClick(i, j, value)}
                    />
                ))
            )}
        </div>
    );
}
```

**pages/RiskCalculatorPage.jsx:**
```jsx
import { useRiskCalculation } from '../hooks/useRiskCalculation';
import Matrix from '../components/risk/Matrix';
import HCodeSelector from '../components/risk/HCodeSelector';

function RiskCalculatorPage() {
    const { riskLevel, matrices, setMatrices, calculate } = useRiskCalculation();

    return (
        <div>
            <HCodeSelector onChange={handleHCodesChange} />
            <Matrix
                rows={4}
                cols={5}
                values={matrixValues}
                onCellClick={handleCellClick}
                colorScheme={riskColorScheme}
            />
            <RiskSummary level={riskLevel} />
        </div>
    );
}
```

---

## 📏 Best Practices

### Dimensione File

| Tipo File | Max Righe | Motivo |
|-----------|-----------|--------|
| Controller | 200 | Max 5 funzioni ~40 righe ciascuna |
| Model | 300 | Query DB raggruppate per entità |
| Route | 50 | Solo definizione endpoints |
| Component | 150 | UI + logica locale |
| Hook | 100 | Singola responsabilità |
| Util | 200 | Funzioni pure correlate |

### Naming Conventions

**File:**
```
PascalCase.jsx         → Componenti React
camelCase.js           → Utility, hooks
kebab-case.routes.js   → Routes
PascalCase.model.js    → Models
```

**Funzioni:**
```javascript
// Controllers: verbi imperativi
getAll, create, update, delete

// Hooks: "use" prefix
useRiskCalculation, usePPEOptimizer

// Utils: verbi descrittivi
calculateRisk, normalizeChemical, exportToWord
```

---

## ✅ Checklist Refactoring

### Prima di Iniziare
- [ ] Commit tutto il codice funzionante
- [ ] Crea branch: `git checkout -b refactor/modular-architecture`
- [ ] Backup database

### Durante il Refactoring
- [ ] Un modulo alla volta (non tutto insieme!)
- [ ] Testa dopo ogni modulo
- [ ] Aggiorna import/export
- [ ] Mantieni retrocompatibilità

### Dopo il Refactoring
- [ ] Tutti i test passano
- [ ] Nessuna regression funzionale
- [ ] Aggiorna documentazione
- [ ] Code review
- [ ] Merge su main

---

## 🚀 Vantaggi Attesi

### Per il Team
- ✅ Onboarding 3x più veloce
- ✅ Meno merge conflicts
- ✅ Più facile fare code review
- ✅ Testing più semplice

### Per il Codice
- ✅ Riusabilità componenti/funzioni
- ✅ Meno codice duplicato
- ✅ Più facile individuare bug
- ✅ Performance migliori (lazy loading possibile)

---

## 📊 Metriche di Successo

| Metrica | Prima | Dopo | Target |
|---------|-------|------|--------|
| Righe file più grande | 1000 | 200 | <250 |
| Componenti riusabili | 2 | 15 | >10 |
| Test coverage | 0% | 60% | >50% |
| Tempo onboarding | 1 sett | 2 giorni | <3 giorni |

---

## 🔧 Tools Consigliati

### Analisi Codice
```bash
# Trova file troppo grandi
find src -name "*.jsx" -exec wc -l {} + | sort -rn | head -10

# Complessità ciclomatica
npx complexity-report src/
```

### Linting
```bash
npm install -D eslint eslint-plugin-react
npx eslint --init
```

### Formattazione
```bash
npm install -D prettier
npx prettier --write "src/**/*.{js,jsx}"
```

---

## 📝 Esempio Completo: Refactoring di un Endpoint

### PRIMA: Tutto in server.js

```javascript
// server.js - 400 righe
app.post('/api/inventory', verifyToken, (req, res) => {
    const { name, cas, hCodes, riskLevel, ...additionalData } = req.body;

    if (!name || !cas) {
        return res.status(400).json({ error: 'Name and CAS are required' });
    }

    const checkSql = `SELECT id FROM inventory WHERE user_id = $1 AND cas = $2`;
    pool.query(checkSql, [req.user.id, cas], (err, existing) => {
        if (err) return res.status(500).json({ error: err.message });
        if (existing.rows.length > 0) {
            return res.status(400).json({ error: 'Agent already exists' });
        }

        const sql = `INSERT INTO inventory (user_id, name, cas, hCodes, riskLevel, additionalData)
                     VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`;

        pool.query(sql, [req.user.id, name, cas, hCodes || [], riskLevel || 0, additionalData || {}], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: result.rows[0].id, name, cas, hCodes, riskLevel, ...additionalData });
        });
    });
});
```

### DOPO: Modulare

**routes/inventory.routes.js (10 righe):**
```javascript
const router = require('express').Router();
const { verifyToken } = require('../middleware/auth');
const inventoryController = require('../controllers/inventory.controller');

router.post('/', verifyToken, inventoryController.create);

module.exports = router;
```

**controllers/inventory.controller.js (20 righe):**
```javascript
const Inventory = require('../models/Inventory');

async function create(req, res) {
    try {
        const { name, cas, hCodes, riskLevel, ...additionalData } = req.body;

        if (!name || !cas) {
            return res.status(400).json({ error: 'Name and CAS are required' });
        }

        const existing = await Inventory.findByCAS(req.user.id, cas);
        if (existing) {
            return res.status(400).json({ error: 'Agent already exists' });
        }

        const item = await Inventory.create(req.user.id, { name, cas, hCodes, riskLevel, additionalData });
        res.json(item);
    } catch (error) {
        console.error('Create inventory error:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

module.exports = { create };
```

**models/Inventory.js (30 righe):**
```javascript
const pool = require('../config/database');

class Inventory {
    static async findByCAS(userId, cas) {
        const sql = `SELECT id FROM inventory WHERE user_id = $1 AND cas = $2`;
        const result = await pool.query(sql, [userId, cas]);
        return result.rows[0];
    }

    static async create(userId, { name, cas, hCodes, riskLevel, additionalData }) {
        const sql = `INSERT INTO inventory (user_id, name, cas, hCodes, riskLevel, additionalData)
                     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;

        const result = await pool.query(sql, [
            userId,
            name,
            cas,
            hCodes || [],
            riskLevel || 0,
            additionalData || {}
        ]);

        return this.formatRow(result.rows[0]);
    }

    static formatRow(row) {
        return {
            id: row.id,
            name: row.name,
            cas: row.cas,
            hCodes: row.hcodes,
            riskLevel: row.risklevel,
            ...(row.additionaldata || {})
        };
    }
}

module.exports = Inventory;
```

**Vantaggio:** Ogni file ha una singola responsabilità e <50 righe!

---

## 🎓 Risorse

- [Express Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)
- [React Component Patterns](https://kentcdodds.com/blog/compound-components-with-react-hooks)
- [Clean Code JavaScript](https://github.com/ryanmcdermott/clean-code-javascript)

---

Vuoi che proceda con il refactoring del backend? Posso farlo in modo incrementale senza rompere il codice esistente.
