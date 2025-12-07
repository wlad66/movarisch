# Esempio Pratico di Refactoring

## Prima: Tutto in server.js (423 righe)

```javascript
// server.js - PRIMA
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.JWT_SECRET;

app.use(cors());
app.use(express.json());

// Database
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

// Middleware
function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access denied' });
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
}

// WORKPLACES ENDPOINTS
app.get('/api/workplaces', verifyToken, async (req, res) => {
    try {
        const sql = `SELECT * FROM workplaces WHERE user_id = $1 ORDER BY id ASC`;
        const result = await pool.query(sql, [req.user.id]);
        res.json(result.rows);
    } catch (error) {
        console.error('Get workplaces error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/workplaces', verifyToken, async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ error: 'Name is required' });

        const sql = `INSERT INTO workplaces (user_id, name) VALUES ($1, $2) RETURNING id, name`;
        const result = await pool.query(sql, [req.user.id, name]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Add workplace error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.delete('/api/workplaces/:id', verifyToken, async (req, res) => {
    try {
        const sql = `DELETE FROM workplaces WHERE id = $1 AND user_id = $2`;
        const result = await pool.query(sql, [req.params.id, req.user.id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Workplace not found' });
        }
        res.json({ message: 'Deleted successfully' });
    } catch (error) {
        console.error('Delete workplace error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ROLES ENDPOINTS (altri 50 righe identiche)
// INVENTORY ENDPOINTS (altri 80 righe identiche)
// REPORTS ENDPOINTS (altri 50 righe identiche)
// AUTH ENDPOINTS (altri 100 righe)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

**Problemi:**
- 423 righe in un file
- Difficile trovare un endpoint specifico
- Codice duplicato (try/catch, error handling)
- Mescolate configurazione, logica, routes
- Impossibile testare singole funzioni

---

## Dopo: Architettura Modulare

### 1. server.js (80 righe)

```javascript
// server.js - DOPO
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

// Middleware globali
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/workplaces', workplacesRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/reports', reportsRoutes);

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

**Vantaggi:**
- ✅ 80 righe (vs 423)
- ✅ Chiaro cosa fa: setup + routing
- ✅ Facile aggiungere nuove routes

---

### 2. config/database.js (40 righe)

```javascript
// config/database.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'movarisch',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD
});

pool.on('connect', () => {
    console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

// Inizializza schema database
async function initSchema() {
    const client = await pool.connect();
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS workplaces (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                name VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        // ... altre tabelle
        console.log('Database schema initialized');
    } finally {
        client.release();
    }
}

initSchema().catch(console.error);

module.exports = pool;
```

**Vantaggi:**
- ✅ Configurazione DB separata
- ✅ Riusabile in tutti i models
- ✅ Facile cambiare DB (dev/prod)

---

### 3. middleware/auth.js (30 righe)

```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'fallback-secret';

function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
}

function generateToken(user) {
    return jwt.sign(
        { id: user.id, email: user.email },
        SECRET_KEY,
        { expiresIn: '24h' }
    );
}

module.exports = { verifyToken, generateToken };
```

**Vantaggi:**
- ✅ Middleware JWT isolato
- ✅ Testabile indipendentemente
- ✅ Riusabile in tutte le routes

---

### 4. routes/workplaces.routes.js (10 righe)

```javascript
// routes/workplaces.routes.js
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const workplacesController = require('../controllers/workplaces.controller');

router.get('/', verifyToken, workplacesController.getAll);
router.post('/', verifyToken, workplacesController.create);
router.delete('/:id', verifyToken, workplacesController.delete);

module.exports = router;
```

**Vantaggi:**
- ✅ Solo 10 righe!
- ✅ Chiaro quali endpoint esistono
- ✅ Facile aggiungere nuovi endpoint

---

### 5. controllers/workplaces.controller.js (40 righe)

```javascript
// controllers/workplaces.controller.js
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

        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }

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

**Vantaggi:**
- ✅ Logica business separata da routes
- ✅ Ogni funzione fa una cosa sola
- ✅ Facile scrivere test unitari

---

### 6. models/Workplace.js (40 righe)

```javascript
// models/Workplace.js
const pool = require('../config/database');

class Workplace {
    static async findByUserId(userId) {
        const sql = `SELECT * FROM workplaces WHERE user_id = $1 ORDER BY id ASC`;
        const result = await pool.query(sql, [userId]);
        return result.rows;
    }

    static async findById(id, userId) {
        const sql = `SELECT * FROM workplaces WHERE id = $1 AND user_id = $2`;
        const result = await pool.query(sql, [id, userId]);
        return result.rows[0];
    }

    static async create(userId, name) {
        const sql = `INSERT INTO workplaces (user_id, name)
                     VALUES ($1, $2)
                     RETURNING id, name, created_at`;
        const result = await pool.query(sql, [userId, name]);
        return result.rows[0];
    }

    static async update(id, userId, name) {
        const sql = `UPDATE workplaces
                     SET name = $1
                     WHERE id = $2 AND user_id = $3
                     RETURNING *`;
        const result = await pool.query(sql, [name, id, userId]);
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

**Vantaggi:**
- ✅ Tutte le query DB in un posto
- ✅ Riusabile da controller e altrove
- ✅ Facile aggiungere nuove query
- ✅ Testabile senza Express

---

## Confronto Finale

### PRIMA (server.js - 423 righe)
```
server.js
└── 423 righe (tutto mescolato)
    ├── Setup Express
    ├── Config Database
    ├── Middleware auth
    ├── 15 endpoints workplaces/roles/inventory/reports/auth
    └── Server startup
```

**Problemi:**
- ❌ Scroll infinito per trovare codice
- ❌ Modificare un endpoint rischia di rompere altri
- ❌ Impossibile testare singole funzioni
- ❌ Merge conflicts frequenti (team)

### DOPO (Modulare - stesso codice, 10 file)
```
server/
├── server.js (80 righe)
├── config/database.js (40 righe)
├── middleware/auth.js (30 righe)
├── routes/
│   ├── workplaces.routes.js (10 righe)
│   ├── roles.routes.js (10 righe)
│   └── ...
├── controllers/
│   ├── workplaces.controller.js (40 righe)
│   ├── roles.controller.js (40 righe)
│   └── ...
└── models/
    ├── Workplace.js (40 righe)
    ├── Role.js (40 righe)
    └── ...
```

**Vantaggi:**
- ✅ Ogni file <80 righe
- ✅ Facile trovare cosa cerchi
- ✅ Modifiche isolate (no effetti collaterali)
- ✅ Testabile funzione per funzione
- ✅ No merge conflicts (team lavora su file diversi)

---

## Metriche di Successo

| Metrica | Prima | Dopo |
|---------|-------|------|
| Righe file più grande | 423 | 80 |
| Tempo per trovare un bug | 10 min | 2 min |
| Righe modificate per fix | 50 | 10 |
| Test unitari possibili | No | Sì |
| Team può lavorare in parallelo | No | Sì |

---

## Come Applicare il Refactoring

### Step by Step (Incrementale - No Rischi)

1. **Crea cartelle** (non rompe nulla)
```bash
cd server
mkdir config middleware routes controllers models
```

2. **Estrai database.js** (primo modulo)
```bash
# Crea file
nano config/database.js
# Copia codice Pool da server.js
# Aggiungi: module.exports = pool
```

3. **Aggiorna server.js**
```javascript
// Sostituisci codice Pool con:
const pool = require('./config/database');
```

4. **Testa** (deve funzionare identico)
```bash
npm start
# Prova login/registrazione
```

5. **Ripeti** per auth.js, poi routes, poi controllers, poi models

6. **Commit** dopo ogni step
```bash
git add .
git commit -m "Refactor: extracted database config"
```

**IMPORTANTE:** Non fare tutto insieme! Un modulo alla volta, testando sempre.

---

## Quando NON Fare Refactoring

- ❌ Se stai per rilasciare in produzione (aspetta dopo)
- ❌ Se non hai backup/git (rischi di perdere codice)
- ❌ Se non capisci bene il codice attuale
- ✅ Fallo quando: hai tempo, hai test, lavoro tranquillo

---

## Prossimo File da Refactorare: App.jsx (995 righe)

Stesso principio, diversa struttura (React):

```
PRIMA: App.jsx (995 righe)
└── Tutto: routing + UI + logica + state

DOPO: Modulare
├── App.jsx (100 righe - solo routing)
├── pages/
│   ├── LoginPage.jsx (80 righe)
│   ├── DashboardPage.jsx (100 righe)
│   ├── RiskCalculatorPage.jsx (150 righe)
│   └── ...
├── components/
│   ├── risk/Matrix.jsx (50 righe - riusabile!)
│   └── ...
└── hooks/
    └── useRiskCalculation.js (100 righe - logica pura)
```

Vuoi che faccia il refactoring pratico del backend? Posso creare i file uno alla volta testando che tutto funzioni.
