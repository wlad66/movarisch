# MoVaRisCh - Deployment Guide
**Versione:** 1.0.0
**Data:** 2025-12-09
**Autore:** Sistema di deployment automatizzato

---

## 📋 Indice
1. [Architettura Sistema](#architettura-sistema)
2. [Infrastruttura VPS](#infrastruttura-vps)
3. [Container Docker](#container-docker)
4. [Database](#database)
5. [Porte e Networking](#porte-e-networking)
6. [Deployment](#deployment)
7. [Manutenzione](#manutenzione)
8. [Troubleshooting](#troubleshooting)

---

## 🏗️ Architettura Sistema

### Stack Tecnologico
- **Frontend:** React 18 + Vite + TailwindCSS
- **Backend:** Node.js 18 (Express.js)
- **Database:** PostgreSQL (temporaneo in-container)
- **Deployment:** Docker + Docker Compose
- **Orchestrazione:** Dokploy (su VPS)
- **Proxy:** Traefik (gestito da Dokploy)

### Struttura Progetto
```
movarisch/
├── src/                    # Frontend React
│   ├── components/        # Componenti UI
│   ├── context/          # Context API (AuthContext)
│   └── App.jsx           # Main app component
├── server/                # Backend Node.js
│   ├── config/           # Database config
│   ├── controllers/      # API controllers
│   ├── models/           # Data models
│   ├── routes/           # Express routes
│   ├── middleware/       # Auth middleware
│   ├── services/         # Email & external services
│   └── server.js         # Entry point
├── dist/                  # Build output (frontend)
├── docker-compose.yml    # Orchestrazione container
├── Dockerfile            # Frontend container
├── server/Dockerfile     # Backend container
└── deploy.ps1            # Script deployment automatico
```

---

## 🌐 Infrastruttura VPS

### Server
- **Provider:** VPS con Dokploy installato
- **IP:** 72.61.189.136
- **OS:** Ubuntu con Docker Swarm
- **URL:** https://movarisch.safetyprosuite.com
- **Path Deployment:** `/opt/movarisch-new/`

### Accesso SSH
```bash
ssh root@72.61.189.136
Password: 0z3u88E.QVaNnAx,h8V+
```

### Servizi Sistema
- **Dokploy:** Porta 3000 (management UI)
- **PostgreSQL sistema:** Porta 5433
- **Traefik:** Porte 80, 443 (reverse proxy)

---

## 🐳 Container Docker

### Container Attivi

#### 1. movarisch-backend
- **Immagine:** `movarisch-new_movarisch-backend`
- **Porta Host:** 3001 → Container: 3000
- **Funzione:** API REST Backend
- **Database:** PostgreSQL temporaneo (in-container, **NON persistente**)
- **Restart Policy:** always

**Variabili d'ambiente (da docker-compose.yml):**
```yaml
environment:
  - NODE_ENV=production
  - PORT=3000
  - DB_HOST=172.17.0.1          # Docker host
  - DB_PORT=5433                # PostgreSQL esterno
  - DB_NAME=movarisch
  - DB_USER=postgres
  - DB_PASSWORD=postgres
  - JWT_SECRET=sRoUiS75vdV1fmcpKaB0E3g4zrJLG9lx
  - TRIAL_DAYS=7
  - STRIPE_SECRET_KEY=sk_test_...
  - SMTP_HOST=smtp.hostinger.com
  - SMTP_PORT=465
  - SMTP_SECURE=true
  - SMTP_USER=info@safetyprosuite.com
  - EMAIL_FROM=info@safetyprosuite.com
```

#### 2. movarisch-app
- **Immagine:** `movarisch-new_movarisch-app`
- **Porta Host:** 8004 → Container: 80
- **Funzione:** Frontend SPA + API Proxy
- **Dipendenze:** movarisch-backend
- **Restart Policy:** always

**Note:**
- Questo container esegue il backend Express che serve sia:
  - File statici della SPA React (da `/dist`)
  - API endpoints (`/api/*`)

---

## 💾 Database

### ⚠️ IMPORTANTE - Database NON Persistente

**PROBLEMA ATTUALE:**
Il database PostgreSQL viene creato **dentro il container** senza volumi persistenti.
**Conseguenza:** Ad ogni `docker-compose down` o rebuild, **tutti i dati vengono persi**.

### Schema Database Attuale
Il database viene inizializzato automaticamente da `server/config/database.js`:

**Tabelle:**
- `users` - Utenti registrati
- `subscriptions` - Abbonamenti e trial
- `payments` - Pagamenti Stripe
- `password_reset_tokens` - Token recupero password
- `reports` - Report generati
- `workplaces` - Luoghi di lavoro
- `roles` - Mansioni
- `inventory` - Inventario agenti chimici

### Struttura Tabella `users`
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nome VARCHAR(255),
    cognome VARCHAR(255),
    azienda VARCHAR(255),
    piva VARCHAR(50),
    company_data JSONB,
    legal_data JSONB,                    -- Aggiunta post-deploy
    subscription_status VARCHAR(20) DEFAULT 'trial',
    trial_ends_at TIMESTAMP,
    subscription_ends_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### ⚠️ Migrazione Schema Richiesta
Se il container viene ricreato, eseguire:
```bash
docker exec movarisch-backend node -e "
const pool = require('./config/database');
pool.query(\`
  ALTER TABLE users
  ADD COLUMN IF NOT EXISTS legal_data JSONB,
  ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(20) DEFAULT 'trial',
  ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMP,
  ADD COLUMN IF NOT EXISTS subscription_ends_at TIMESTAMP,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
\`, (err) => {
  if (err) console.error('ERROR:', err.message);
  else console.log('Schema migrated successfully');
  pool.end();
});
"
```

### 🔧 Soluzione Futura - Database Persistente
**Opzione 1: Volume Docker**
```yaml
movarisch-backend:
  volumes:
    - postgres-data:/var/lib/postgresql/data

volumes:
  postgres-data:
```

**Opzione 2: PostgreSQL Esterno (RACCOMANDATO)**
Usare il PostgreSQL sulla porta 5433 già presente nel sistema.

---

## 🔌 Porte e Networking

### Mappa Porte
| Servizio | Porta Host | Porta Container | Protocollo | Note |
|----------|------------|-----------------|------------|------|
| **Dokploy** | 3000 | 3000 | HTTP | UI Management |
| **movarisch-backend** | 3001 | 3000 | HTTP | API Backend |
| **movarisch-app** | 8004 | 80 | HTTP | Frontend + Proxy |
| **PostgreSQL (sistema)** | 5433 | 5432 | TCP | Database esterno |
| **Traefik** | 80, 443 | - | HTTP/HTTPS | Reverse proxy |

### Routing Traefik
```
https://movarisch.safetyprosuite.com
  → Traefik (Dokploy)
    → movarisch-app:8004
      → Serve React SPA + API proxy
```

### Network Docker
- **Network name:** `movarisch-new_default`
- **Driver:** bridge
- **Containers:**
  - `movarisch-backend` (172.19.0.2)
  - `movarisch-app` (172.19.0.3)

---

## 🚀 Deployment

### Script Automatico (RACCOMANDATO)

```powershell
# Esegui dalla root del progetto
.\deploy.ps1
```

**Cosa fa lo script:**
1. Build frontend con Vite
2. Aggiunge cache-busting timestamp ai file JS/CSS
3. Copia `dist/` in `server/dist/`
4. Crea archivi compressi
5. Upload su VPS via `pscp`
6. Estrae archivi sul server
7. Rebuild container Docker con `--force-recreate`
8. Verifica stato container

### Deployment Manuale

#### 1. Build Locale
```bash
# Build frontend
npm run build  # Esegue: vite build && node add-version.js

# Copia dist in server
cp -r dist server/
```

#### 2. Upload su VPS
```bash
# Comprimi file
tar -czf server-files.tar.gz server/

# Upload con SCP
scp server-files.tar.gz root@72.61.189.136:/opt/movarisch-new/
```

#### 3. Deploy su VPS
```bash
ssh root@72.61.189.136

cd /opt/movarisch-new

# Estrai file
tar -xzf server-files.tar.gz

# Rebuild container
docker-compose down
docker-compose up -d --build --force-recreate

# Verifica
docker-compose ps
docker-compose logs --tail=50
```

### Cache Busting

Il sistema implementa cache busting automatico:

**Script `add-version.js`:**
```javascript
// Aggiunge timestamp a JS/CSS in index.html
// Es: index.js?v=1765272015657
const timestamp = Date.now();
html = html.replace(/(<script[^>]*src="[^"]+\.js")/g, `$1?v=${timestamp}`);
html = html.replace(/(<link[^>]*href="[^"]+\.css")/g, `$1?v=${timestamp}`);
```

**Headers HTTP (da server.js):**
```javascript
// Assets con hash nel filename: cache 1 anno
app.use('/assets', express.static(path.join(__dirname, 'dist/assets'), {
    maxAge: '1y',
    immutable: true
}));

// index.html: no cache
app.get('*', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});
```

**Auto-reload dopo login:**
```javascript
// src/components/Login.jsx
if (success) {
    window.location.reload();  // Forza reload per nuovi JS
}
```

---

## 🔧 Manutenzione

### Verifica Stato Sistema
```bash
# Container attivi
docker ps --filter name=movarisch

# Log backend
docker logs movarisch-backend --tail=100 -f

# Log frontend/app
docker logs movarisch-app --tail=100 -f

# Uso risorse
docker stats movarisch-backend movarisch-app

# Spazio disco
du -sh /opt/movarisch-new/
```

### Backup

**⚠️ CRITICO: Backup database prima di ogni rebuild**

```bash
# Esporta dati utenti
docker exec movarisch-backend node -e "
const pool = require('./config/database');
pool.query('SELECT * FROM users', (err, res) => {
  console.log(JSON.stringify(res.rows, null, 2));
  pool.end();
});" > users_backup_$(date +%Y%m%d).json

# Backup completo database (quando sarà persistente)
docker exec movarisch-backend pg_dump -U postgres movarisch > backup.sql
```

### Pulizia Sistema
```bash
# Rimuovi immagini vecchie
docker system prune -f

# Rimuovi volumi non usati
docker volume prune -f

# Rimuovi file temporanei
cd /opt/movarisch-new
rm -f *.tar.gz /tmp/*.js migrate.js create_user.js
```

---

## 🩺 Troubleshooting

### Container non si avvia

**Problema:** Porta 3000 già in uso
```
Bind for 0.0.0.0:3000 failed: port is already allocated
```

**Soluzione:**
```bash
# Dokploy usa la porta 3000
# Backend usa 3001 (già configurato)
netstat -tlnp | grep 3000  # Verifica chi usa la porta
```

---

### Login fallisce con 400 Bad Request

**Causa:** Utente non esiste o database vuoto

**Soluzione:**
```bash
# 1. Verifica utenti nel database
docker exec movarisch-backend node -e "
const pool = require('./config/database');
pool.query('SELECT email FROM users', (err, res) => {
  console.log('Users:', res?.rows || 'ERROR');
  pool.end();
});"

# 2. Se vuoto, registra utente via API
curl -X POST https://movarisch.safetyprosuite.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"password123",
    "nome":"Test",
    "cognome":"User",
    "azienda":"Test SRL",
    "piva":"IT12345678901",
    "companyData":{},
    "legalData":{
      "termsAccepted":true,
      "privacyAccepted":true,
      "disclaimerAccepted":true,
      "professionalConfirmed":true
    }
  }'
```

---

### Database perso dopo rebuild

**Causa:** Database in-container senza persistenza

**Prevenzione:**
1. Backup dati PRIMA del rebuild (vedi sezione Backup)
2. Implementare volume persistente
3. Migrare a PostgreSQL esterno

**Recovery:**
```bash
# Ripristina schema completo
docker exec movarisch-backend node -e "$(cat <<'EOMIGRATE'
const pool = require('./config/database');
pool.query(\`
  ALTER TABLE users
  ADD COLUMN IF NOT EXISTS legal_data JSONB,
  ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(20) DEFAULT 'trial',
  ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMP
\`, (err) => {
  console.log(err ? 'ERROR: ' + err.message : 'SUCCESS');
  pool.end();
});
EOMIGRATE
)"
```

---

### Email non vengono inviate

**Verifica configurazione SMTP:**
```bash
docker exec movarisch-backend node -e "
console.log('SMTP Config:', {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  user: process.env.SMTP_USER
});
"
```

**Test invio email:**
```bash
docker logs movarisch-backend | grep -i "email\|smtp"
```

---

### Cache del browser mostra vecchia versione

**Causa:** Proxy aggressivo o timestamp non aggiornato

**Soluzione:**
1. Verifica timestamp in `index.html`:
```bash
curl -s https://movarisch.safetyprosuite.com | grep -o "index.*\.js?v=[0-9]*"
```

2. Hard refresh browser: `Ctrl+Shift+F5`

3. Rebuild con cache busting:
```bash
npm run build  # Rigenera nuovo timestamp
./deploy.ps1   # Deploy automatico
```

---

## 📞 Contatti e Supporto

### Credenziali Importanti
- **VPS SSH:** root@72.61.189.136
- **Database:** postgres / postgres (temporaneo)
- **JWT Secret:** sRoUiS75vdV1fmcpKaB0E3g4zrJLG9lx
- **SMTP:** info@safetyprosuite.com

### Repository
- **Git:** (inserire URL repository)
- **Branch principale:** main

### Note Finali
- ⚠️ **PRIORITÀ ALTA:** Implementare persistenza database
- 📝 Backup manuale necessario prima di ogni deploy
- 🔄 Auto-reload dopo login risolve problemi di cache
- 🚀 Script PowerShell automatizza deployment completo

---

**Ultima revisione:** 2025-12-09
**Prossimo aggiornamento:** Implementazione database persistente
