# MoVaRisCh 2025 - Sistema di Valutazione Rischio Chimico e Ottimizzazione DPI

Applicazione web professionale per la valutazione del rischio chimico e la selezione ottimale dei Dispositivi di Protezione Individuale (guanti).

## 🚀 Caratteristiche Principali

### Valutazione Rischio Chimico
- Algoritmo MoVaRisCh con 5 matrici di rischio interattive
- Database di 150+ codici H (GHS/CLP)
- Calcolo automatico indice di rischio (1-5)
- Gestione inventario sostanze chimiche per azienda

### Ottimizzatore Multi-Prodotto DPI
- Analisi simultanea di tutte le sostanze chimiche
- Database di 4.050+ test di permeazione (Ansell Guide)
- Sistema a semaforo per visualizzazione compatibilità
- Raccomandazioni intelligenti basate su breakthrough time

### Gestione Aziendale
- Multi-azienda con isolamento dati
- Gestione luoghi di lavoro e mansioni
- Archiviazione valutazioni con tracciabilità completa
- Export report professionali in formato DOCX

---

## 🏗️ Architettura

### Stack Tecnologico

**Frontend:**
- React 18.2 + Vite
- Tailwind CSS
- Context API per state management
- Lucide React per icone

**Backend:**
- Node.js 18 + Express
- PostgreSQL (produzione) / SQLite (sviluppo)
- JWT per autenticazione
- bcrypt per password hashing

**Infrastructure:**
- Docker + Docker Compose
- Nginx reverse proxy
- Compatible con Dokploy

---

## 📦 Installazione

### Prerequisiti

- Node.js 18+
- PostgreSQL 15+ (per produzione)
- Docker & Docker Compose (opzionale)

### Setup Locale per Sviluppo

```bash
# 1. Clona repository
git clone <repository-url>
cd movarisch

# 2. Installa dipendenze frontend
npm install

# 3. Installa dipendenze backend
cd server
npm install

# 4. Configura variabili d'ambiente
cp .env.example .env
nano .env  # Modifica con le tue credenziali

# 5. Avvia PostgreSQL (o usa SQLite per dev)
docker run --name postgres-dev -e POSTGRES_PASSWORD=dev123 -p 5432:5432 -d postgres:15
docker exec -it postgres-dev psql -U postgres -c "CREATE DATABASE movarisch;"

# 6. Avvia backend
npm start

# 7. In un altro terminale, avvia frontend
cd ..
npm run dev
```

Apri: http://localhost:5173

---

## 🚢 Deploy su VPS

### Configurazione Rapida

```bash
# 1. Configura .env
cd server
cp .env.example .env
nano .env

# 2. Imposta variabili
PORT=3000
NODE_ENV=production
JWT_SECRET=$(openssl rand -base64 32)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=movarisch
DB_USER=postgres
DB_PASSWORD=your_password

# 3. Deploy con Docker Compose
cd ..
docker-compose -f docker-compose.vps.yml up -d --build

# 4. Verifica
docker-compose -f docker-compose.vps.yml logs -f
```

**Configurazione:** Modifica `server/.env` con le tue credenziali del database.

---

## 📊 Schema Database

### Tabelle Principali

```sql
users          # Utenti e aziende
workplaces     # Luoghi di lavoro
roles          # Mansioni
inventory      # Inventario agenti chimici
reports        # Valutazioni archiviate
```

**Schema completo:** Vedi `server/server.js` per la struttura completa delle tabelle.

---

## 🔌 API Endpoints

### Autenticazione
```
POST /api/auth/register  # Registrazione
POST /api/auth/login     # Login
GET  /api/auth/me        # Valida token
```

### Gestione Dati (Autenticati)
```
GET/POST/DELETE  /api/workplaces    # Luoghi di lavoro
GET/POST/DELETE  /api/roles         # Mansioni
GET/POST/PUT/DELETE /api/inventory  # Agenti chimici
GET/POST/DELETE  /api/reports       # Report archiviati
```

Tutti richiedono header:
```
Authorization: Bearer <jwt_token>
```

---

## 📁 Struttura Progetto

```
movarisch/
├── src/
│   ├── components/          # Componenti React
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── DataManagement.jsx
│   │   ├── RiskMatrices.jsx
│   │   ├── PPEOptimizer.jsx
│   │   └── PPEDatabaseManager.jsx
│   ├── context/             # State management
│   │   ├── AuthContext.jsx
│   │   └── DataContext.jsx
│   ├── data/
│   │   ├── hCodes.js        # 150+ codici H
│   │   └── ppe_database.json # 4.050 test permeazione
│   └── utils/
│       └── exportToWord.js  # Generazione DOCX
├── server/
│   ├── server.js            # API Express + PostgreSQL
│   ├── .env.example         # Template configurazione
│   └── package.json
├── App.jsx                  # Main app component
├── docker-compose.vps.yml   # Deploy production
├── DEPLOY_VPS.md           # Guida deploy completa
└── README.md               # Questo file
```

---

## 🔒 Sicurezza

### Features Implementate
- ✅ Password hash con bcrypt (salt rounds: 10)
- ✅ JWT con scadenza 24h
- ✅ Validazione token server-side
- ✅ Isolamento dati per azienda (user_id FK)
- ✅ SQL injection protection (parametrized queries)
- ✅ ON DELETE CASCADE per integrità referenziale

### Checklist Pre-Deploy
- [ ] Genera JWT_SECRET sicuro (32+ caratteri)
- [ ] Usa password PostgreSQL forte
- [ ] Configura firewall (solo porte necessarie)
- [ ] Abilita HTTPS con certificato SSL
- [ ] Verifica .env non sia committato (.gitignore)
- [ ] Configura backup automatici database

---

## 📚 Documentazione

### Codice Sorgente
- **`App.jsx`** - Componente principale dell'applicazione
- **`src/components/`** - Tutti i componenti React
- **`src/utils/exportToWord.js`** - Generazione report Word
- **`server/server.js`** - API backend e schema database
- **`server/models/`** - Modelli database
- **`server/controllers/`** - Controller API

### Algoritmo MoVaRisCh
L'applicazione implementa l'algoritmo MoVaRisCh per la valutazione del rischio chimico:
- 5 matrici di rischio interattive
- Calcolo automatico R_inal, R_cute, R_cum
- Classificazione del rischio secondo D.Lgs 81/08

---

## 🛠️ Comandi Utili

### Sviluppo
```bash
npm run dev         # Frontend dev server (Vite)
npm run build       # Build produzione
cd server && npm start  # Backend API
```

### Docker
```bash
# Build e start
docker-compose -f docker-compose.vps.yml up -d --build

# Logs
docker-compose -f docker-compose.vps.yml logs -f

# Stop
docker-compose -f docker-compose.vps.yml down

# Rebuild singolo servizio
docker-compose -f docker-compose.vps.yml up -d --build movarisch-backend
```

### Database
```bash
# Backup PostgreSQL
docker exec postgres pg_dump -U movarisch_user movarisch > backup.sql

# Restore
docker exec -i postgres psql -U movarisch_user movarisch < backup.sql

# Accedi a psql
docker exec -it postgres psql -U movarisch_user -d movarisch
```

---

## 🔧 Troubleshooting

### "Cannot connect to database"
1. Verifica PostgreSQL sia attivo: `docker ps | grep postgres`
2. Controlla credenziali in `server/.env`
3. Verifica connettività: `psql -h localhost -U postgres -d movarisch`

### "Port already in use"
1. Trova processo: `sudo lsof -i :3001`
2. Cambia porta in `docker-compose.vps.yml`

### "Invalid token" dopo login
1. Verifica `JWT_SECRET` identico su tutti i container
2. Cancella localStorage browser (F12 → Application → Storage)
3. Rieffettua login

### Dati non si salvano
1. Controlla log backend: `docker logs movarisch-backend`
2. Verifica API calls in browser (F12 → Network)
3. Testa endpoint: `curl http://localhost:3001/api/workplaces -H "Authorization: Bearer <token>"`

---

## 🌐 Porte Predefinite

| Servizio | Porta | Modificabile in |
|----------|-------|----------------|
| Frontend Dev | 5173 | vite.config.js |
| Frontend Prod | 8005 | docker-compose.vps.yml |
| Backend | 3001 | docker-compose.vps.yml |
| PostgreSQL | 5432 | Sistema/Dokploy |

**IMPORTANTE:** Verifica porte libere prima del deploy su VPS!

```bash
sudo netstat -tlnp | grep -E ':(3001|8005|5432)'
```

---

## 📈 Performance

### Metriche
- **Load time**: <1s (frontend build ~2MB)
- **Matrix calculation**: <100ms per 10 sostanze
- **Database queries**: <50ms (con indici)
- **PPE compatibility matrix**: ~200ms per 10 sostanze

### Ottimizzazioni
- React.memo per componenti pesanti
- Normalizzazione numeri CAS per ricerca rapida
- JSONB indexing su PostgreSQL
- Frontend build ottimizzato con Vite

---

## 📝 Changelog

### v2.0.0 (2025) - Migrazione Server
- ✅ Migrato da localStorage a database server (PostgreSQL)
- ✅ API RESTful complete
- ✅ Multi-utente con isolamento dati
- ✅ Deploy su VPS con Docker
- ✅ Autenticazione JWT robusta

### v1.0.0 - Release Iniziale
- Calcolatore rischio chimico (5 matrici)
- Ottimizzatore DPI multi-prodotto
- Database 4.050 test permeazione
- Export DOCX report

---

## 📄 Licenza

Proprietario - Safety Pro Suite

---

## 👥 Supporto

### Documentazione
- FAQ: Vedi sezione Troubleshooting sopra
- Codice sorgente commentato in `src/` e `server/`

### Problemi
Per segnalare problemi:
1. Controlla logs: `docker-compose -f docker-compose.vps.yml logs -f`
2. Verifica configurazione `.env`
3. Consulta la sezione Troubleshooting sopra

---

## 🚀 Quick Start

```bash
# Sviluppo locale (SQLite)
npm install && cd server && npm install && cd ..
npm run dev

# Deploy produzione (PostgreSQL + Docker)
cp server/.env.example server/.env
# Modifica server/.env con credenziali PostgreSQL
docker-compose -f docker-compose.vps.yml up -d --build
```

**Configurazione:** Modifica `server/.env` con le credenziali del database prima del deploy.

---

**Versione:** 2.0.0
**Ultimo aggiornamento:** 2025-12-07
**Status:** ✅ Production Ready
