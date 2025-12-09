# MoVaRisCh 2025 - Documentazione Tecnica Completa

## 📋 Indice

1. [Panoramica Sistema](#panoramica-sistema)
2. [Architettura](#architettura)
3. [Frontend](#frontend)
4. [Backend](#backend)
5. [Database](#database)
6. [Deploy e DevOps](#deploy-e-devops)
7. [VPS e Infrastruttura](#vps-e-infrastruttura)
8. [Manutenzione](#manutenzione)
9. [Troubleshooting](#troubleshooting)

---

## 📌 Panoramica Sistema

**MoVaRisCh** è un'applicazione web per la valutazione del rischio chimico (MoVaRisCh = Modello Valutazione Rischio Chimico).

### Informazioni Generali
- **Nome**: MoVaRisCh 2025
- **Azienda**: AQR Group SRL
- **URL Produzione**: https://movarisch.safetyprosuite.com
- **Versione Node.js**: 18.x (Alpine)
- **Versione PostgreSQL**: 15-alpine
- **Containerizzazione**: Docker + Docker Compose

### Stack Tecnologico
```
Frontend:  React 18 + Vite + TailwindCSS
Backend:   Node.js 18 + Express.js
Database:  PostgreSQL 15
Deploy:    Docker Compose su VPS
Proxy:     Nginx (nel container frontend)
Auth:      JWT (JSON Web Tokens)
Email:     Nodemailer con Gmail SMTP
```

---

## 🏗️ Architettura

### Diagramma Componenti

```
┌─────────────────────────────────────────────────────────┐
│                    INTERNET                             │
└──────────────────┬──────────────────────────────────────┘
                   │
                   │ HTTPS (443)
                   │
         ┌─────────▼──────────┐
         │   Traefik Proxy    │  (Dokploy)
         │  (SSL Termination) │
         └─────────┬──────────┘
                   │
                   │ HTTP (8004)
                   │
         ┌─────────▼──────────┐
         │  movarisch-app     │  Container Frontend
         │  (Nginx + React)   │  Port: 8004:80
         │                    │
         │  - Serve HTML/JS   │
         │  - Proxy /api →    │
         └─────────┬──────────┘
                   │
                   │ Internal Network (movarisch-new_default)
                   │
         ┌─────────▼──────────┐
         │ movarisch-backend  │  Container Backend
         │  (Node.js/Express) │  Port: 3001:3000
         │                    │
         │  - REST API        │
         │  - JWT Auth        │
         │  - Business Logic  │
         └─────────┬──────────┘
                   │
                   │ PostgreSQL Protocol (5432)
                   │
         ┌─────────▼──────────┐
         │  movarisch-db      │  Container Database
         │  (PostgreSQL 15)   │  Port: 5434:5432
         │                    │
         │  Volume Persistente│
         │  movarisch-db-data │
         └────────────────────┘
```

### Porte Utilizzate

| Servizio | Porta Host | Porta Container | Motivo |
|----------|-----------|-----------------|--------|
| Frontend | 8004 | 80 | Nginx serve React app |
| Backend | 3001 | 3000 | API Express (evita conflitto con Dokploy su 3000) |
| Database | 5434 | 5432 | PostgreSQL (evita conflitto con DB esistente su 5433) |

### Docker Network

Tutti i container comunicano sulla rete interna `movarisch-new_default`:
- `movarisch-app` → `movarisch-backend:3000` (interno)
- `movarisch-backend` → `movarisch-db:5432` (interno)

---

## 💻 Frontend

### Tecnologie
- **Framework**: React 18.3.1
- **Build Tool**: Vite 5.4.21
- **UI Library**: TailwindCSS 3.4.16
- **Routing**: React Router DOM 7.1.1
- **State Management**: Context API (AuthContext)
- **HTTP Client**: Fetch API nativa

### Struttura Directory

```
src/
├── components/          # Componenti React
│   ├── Login.jsx       # Form login
│   ├── Register.jsx    # Form registrazione
│   ├── ForgotPassword.jsx
│   ├── ResetPassword.jsx
│   ├── Dashboard.jsx   # Dashboard principale
│   ├── TrialBanner.jsx # Banner trial
│   └── ...
├── context/
│   └── AuthContext.jsx # Gestione autenticazione e stato globale
├── App.jsx             # Componente root con routing
└── main.jsx           # Entry point React
```

### File di Configurazione

#### `vite.config.js`
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3000'  // Proxy API in dev
    }
  }
})
```

#### `tailwind.config.js`
```javascript
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1e40af',    // Blue
        secondary: '#10b981',  // Green
      }
    }
  }
}
```

### Build Process

1. **Development**:
   ```bash
   npm run dev
   # Avvia Vite dev server su http://localhost:5173
   # Con hot reload
   ```

2. **Production Build**:
   ```bash
   npm run build
   # 1. Vite compila React → dist/
   # 2. add-version.js aggiunge timestamp per cache busting
   # 3. Genera: dist/index.html + dist/assets/index-[hash].js
   ```

3. **Cache Busting** (`add-version.js`):
   ```javascript
   // Aggiunge timestamp a JS/CSS per forzare reload
   // index.js → index.js?v=1765282000000
   ```

### AuthContext

Il cuore della gestione stato globale:

```javascript
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() =>
    localStorage.getItem('movarisch_token')
  );
  const [trial, setTrial] = useState(null);
  const [subscription, setSubscription] = useState(null);

  // Funzioni:
  // - login(email, password)
  // - register(userData)
  // - logout()
  // - fetchSubscriptionStatus(authToken)
  // - validateToken()
};
```

### Environment Variables Frontend

Nessuna variabile d'ambiente necessaria in frontend. Tutte le chiamate API vanno a `/api/*` che viene proxy-to dal nginx.

---

## ⚙️ Backend

### Tecnologie
- **Runtime**: Node.js 18 (Alpine)
- **Framework**: Express.js 4.21.2
- **Database Client**: pg (node-postgres) 8.13.1
- **Authentication**: jsonwebtoken 9.0.2 + bcryptjs 2.4.3
- **Email**: nodemailer 6.9.16
- **Validation**: express-validator
- **Security**: cors, helmet, dotenv

### Struttura Directory

```
server/
├── config/
│   └── database.js          # Configurazione PostgreSQL + init schema
├── controllers/
│   ├── auth.controller.js   # Login/Register/Password Reset
│   ├── subscription.controller.js
│   ├── workplaces.controller.js
│   ├── roles.controller.js
│   ├── inventory.controller.js
│   └── reports.controller.js
├── models/
│   ├── User.js             # Model utente con metodi DB
│   ├── Subscription.js
│   └── ...
├── routes/
│   ├── auth.routes.js      # POST /api/auth/login, /register, etc.
│   ├── subscription.routes.js
│   └── ...
├── middleware/
│   └── auth.middleware.js  # verifyToken() per proteggere routes
├── services/
│   └── email.service.js    # Invio email via Nodemailer
├── server.js               # Entry point Express
├── package.json
├── Dockerfile
└── .env                    # Environment variables (non committato)
```

### Environment Variables Backend

File `.env` (NON committato, solo su VPS):

```bash
# Database (iniettate da docker-compose.yml)
DB_HOST=movarisch-db
DB_PORT=5432
DB_NAME=movarisch
DB_USER=movarisch_app
DB_PASSWORD=MoVa2025App!

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Email (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password

# App
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://movarisch.safetyprosuite.com
```

**IMPORTANTE**: Le variabili DB sono iniettate automaticamente da `docker-compose.yml`, non servono in `.env`.

### Database Schema

Il backend inizializza automaticamente lo schema al primo avvio (`config/database.js`):

```sql
-- Tabelle principali
users                    -- Utenti registrati
  ├── id (SERIAL PRIMARY KEY)
  ├── email (VARCHAR UNIQUE)
  ├── password (VARCHAR hashed con bcrypt)
  ├── nome, cognome, azienda, piva
  ├── company_data (JSONB)
  ├── legal_data (JSONB)
  ├── subscription_status (VARCHAR)
  ├── trial_ends_at (TIMESTAMP)
  └── created_at (TIMESTAMP)

subscriptions            -- Abbonamenti e trial
  ├── id (SERIAL PRIMARY KEY)
  ├── user_id (FK → users)
  ├── status (trial/active/expired)
  ├── trial_start_date, trial_end_date
  ├── subscription_start_date, subscription_end_date
  ├── payment_method
  └── stripe_subscription_id

payments                 -- Storico pagamenti
password_reset_tokens    -- Token reset password
workplaces              -- Luoghi di lavoro
roles                   -- Mansioni
inventory               -- Agenti chimici
reports                 -- Report generati
```

### API Endpoints

#### Auth (`/api/auth`)
```
POST   /register              # Registrazione nuovo utente
POST   /login                 # Login utente
GET    /me                    # Ottieni utente corrente (protetto)
POST   /forgot-password       # Richiedi reset password
POST   /reset-password/:token # Reset password con token
```

#### Subscription (`/api/subscription`)
```
GET    /status                # Stato trial/abbonamento (protetto)
POST   /subscribe             # Sottoscrivi abbonamento (protetto)
POST   /cancel                # Cancella abbonamento (protetto)
```

#### Workplaces (`/api/workplaces`)
```
GET    /                      # Lista luoghi di lavoro (protetto)
POST   /                      # Crea nuovo luogo (protetto)
PUT    /:id                   # Modifica luogo (protetto)
DELETE /:id                   # Elimina luogo (protetto)
```

E così via per `/api/roles`, `/api/inventory`, `/api/reports`.

### Middleware di Autenticazione

`middleware/auth.middleware.js`:

```javascript
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ error: 'Token mancante' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Token non valido' });
    }
    req.userId = decoded.id;
    next();
  });
};
```

Protezione routes:
```javascript
router.get('/status', verifyToken, getSubscriptionStatus);
```

### Email Service

`services/email.service.js`:

```javascript
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS  // App-specific password Gmail
  }
});

const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  await transporter.sendMail({
    from: '"MoVaRisCh" <noreply@movarisch.com>',
    to: email,
    subject: 'Reset Password',
    html: `<a href="${resetUrl}">Clicca qui per resettare la password</a>`
  });
};
```

---

## 🗄️ Database

### PostgreSQL 15-alpine

#### Configurazione Container

`docker-compose.yml`:

```yaml
movarisch-db:
  image: postgres:15-alpine
  container_name: movarisch-db
  restart: always
  environment:
    - POSTGRES_DB=movarisch
    - POSTGRES_USER=movarisch_app
    - POSTGRES_PASSWORD=MoVa2025App!
  volumes:
    - movarisch-db-data:/var/lib/postgresql/data
  ports:
    - "5434:5432"
```

#### Volume Persistente

**CRITICO**: I dati sono salvati nel volume Docker `movarisch-db-data`.

```bash
# Volume Docker named
volumes:
  movarisch-db-data:
    driver: local
```

**Cosa significa**:
- ✅ Dati persistono anche dopo `docker-compose down`
- ✅ Dati persistono anche dopo rebuild container
- ❌ Dati si perdono SOLO con `docker-compose down -v` (MAI USARE!)

#### Accesso al Database

Da locale (via VPS):
```bash
# Dalla VPS
docker exec -it movarisch-db psql -U movarisch_app -d movarisch

# Query esempio
SELECT email, subscription_status FROM users;
```

Da remoto (tunneling SSH):
```bash
ssh -L 5434:localhost:5434 root@72.61.189.136
# Poi connettiti a localhost:5434 con pgAdmin/DBeaver
```

#### Backup Database

**Backup SQL Dump**:
```bash
# Su VPS
docker exec movarisch-db pg_dump -U movarisch_app movarisch > backup_$(date +%Y%m%d).sql
```

**Backup Volume Docker**:
```bash
# Backup completo del volume
docker run --rm \
  -v movarisch-new_movarisch-db-data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/movarisch-db-backup.tar.gz -C /data .
```

**Restore da Backup**:
```bash
# Restore SQL
cat backup_20251209.sql | docker exec -i movarisch-db psql -U movarisch_app movarisch

# Restore Volume
docker run --rm \
  -v movarisch-new_movarisch-db-data:/data \
  -v $(pwd):/backup \
  alpine tar xzf /backup/movarisch-db-backup.tar.gz -C /data
```

#### Migrazioni Schema

Attualmente NON c'è un sistema di migration automatico. Schema è inizializzato da `config/database.js` al primo avvio.

Per modifiche schema:
1. Modifica `config/database.js`
2. Esegui SQL manualmente sul DB esistente:
   ```bash
   docker exec movarisch-db psql -U movarisch_app movarisch -c "ALTER TABLE users ADD COLUMN new_field VARCHAR(255);"
   ```

**TODO**: Implementare sistema migration (es. node-pg-migrate, Knex.js migrations).

---

## 🚀 Deploy e DevOps

### Docker Compose

File `docker-compose.yml` definisce 3 services:

```yaml
version: '3'
services:
  movarisch-app:        # Frontend (Nginx + React)
  movarisch-backend:    # Backend (Node.js)
  movarisch-db:         # Database (PostgreSQL)

volumes:
  movarisch-db-data:    # Volume persistente
```

### Script di Deploy Automatico

`deploy.ps1` (PowerShell per Windows):

```powershell
# STEP 1: Build locale (Vite + cache busting)
npm run build

# STEP 2: Copia dist/ in server/dist/
Copy-Item -Recurse -Force "dist" "server\dist"

# STEP 3: Crea archivio dist.tar.gz
tar -czf dist.tar.gz -C server dist

# STEP 4: Upload su VPS (dist, Dockerfile, nginx.conf)
pscp dist.tar.gz root@VPS:/opt/movarisch-new/
pscp Dockerfile root@VPS:/opt/movarisch-new/
pscp nginx.conf root@VPS:/opt/movarisch-new/

# STEP 5: Estrai file (PRIMA del build Docker!)
tar -xzf dist.tar.gz -C server/

# STEP 6: Build immagini Docker (con --no-cache)
docker-compose build --no-cache

# STEP 7: Deploy container
docker-compose down
docker-compose up -d --force-recreate
```

**IMPORTANTE**: L'ordine è CRITICO. Se estrai DOPO il build, Docker usa file vecchi!

### Workflow Deploy

```
┌──────────────────┐
│  Sviluppo Locale │
│  (Windows)       │
└────────┬─────────┘
         │ npm run build
         │
┌────────▼─────────┐
│  dist/           │  File buildati
│  - index.html    │
│  - assets/*.js   │
└────────┬─────────┘
         │ deploy.ps1
         │ (pscp upload)
         │
┌────────▼─────────┐
│  VPS             │
│  /opt/movarisch- │
│  new/            │
└────────┬─────────┘
         │ tar -xzf
         │ docker-compose build
         │ docker-compose up
         │
┌────────▼─────────┐
│  Docker          │
│  Containers      │
│  Running         │
└──────────────────┘
```

### Dockerfile Frontend

`Dockerfile` (root directory):

```dockerfile
FROM nginx:alpine
COPY server/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Semplice**: Nginx serve file statici pre-buildati.

### Dockerfile Backend

`server/Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

### Nginx Configuration

`nginx.conf`:

```nginx
server {
    listen 80;

    # Disable cache per JS/CSS
    location ~* \.(js|css)$ {
        root /usr/share/nginx/html;
        add_header Cache-Control "no-store, no-cache, must-revalidate";
        etag off;
    }

    # Disable cache per HTML
    location ~* \.html$ {
        root /usr/share/nginx/html;
        add_header Cache-Control "no-store, no-cache, must-revalidate";
        etag off;
        try_files $uri /index.html;
    }

    # Serve static files
    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
    }

    # Proxy API al backend
    location /api {
        proxy_pass http://movarisch-backend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Cache Busting

Problema: Browser cachea aggressivamente JavaScript.

Soluzione: `add-version.js` aggiunge timestamp:

```javascript
const timestamp = Date.now();
html = html.replace(/(<script[^>]*src="[^"]+\.js)(")/g, `$1?v=${timestamp}$2`);
// Result: <script src="/assets/index.js?v=1765282000000">
```

Plus: Meta tag in `index.html`:
```html
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
```

---

## 🖥️ VPS e Infrastruttura

### Server Details

- **Provider**: (da specificare)
- **IP**: 72.61.189.136
- **OS**: Linux (Docker Swarm mode)
- **Domain**: movarisch.safetyprosuite.com
- **Reverse Proxy**: Traefik (gestito da Dokploy)
- **SSL**: Let's Encrypt (auto-rinnovato da Traefik)

### Dokploy

Dokploy è un pannello di gestione container installato sulla VPS.

- **URL**: Non specificato (probabilmente https://IP:3000)
- **Funzione**: Deploy/gestione container Docker
- **Traefik**: Proxy inverso con SSL automatico

**ATTENZIONE**: Dokploy usa porta 3000, per questo MoVaRisCh backend usa 3001!

### Accesso VPS

```bash
# SSH
ssh root@72.61.189.136
Password: 0z3u88E.QVaNnAx,h8V+

# Directory applicazione
cd /opt/movarisch-new

# Comandi utili
docker-compose ps              # Stato container
docker-compose logs -f backend # Logs backend in tempo reale
docker-compose restart backend # Restart singolo service
```

### Altre App sulla VPS

La VPS ospita ALTRE applicazioni. **ATTENZIONE**:

- **NON modificare** porte usate da altre app
- **NON toccare** container/volumi non di MoVaRisCh
- **NON eseguire** `docker system prune` (cancellerebbe tutto!)

Container presenti:
```bash
docker ps
# Mostra vari container tra cui:
# - dokploy-postgres (porta 5433 usata)
# - dokploy (porta 3000 usata)
# - calcoloesposizionerumoremain-*
# - Altri progetti
```

### Rete Docker

```bash
# MoVaRisCh usa una rete dedicata
docker network ls | grep movarisch
# movarisch-new_default

# Altri progetti hanno le loro reti separate
```

### Monitoring e Logs

```bash
# Logs applicazione
docker logs movarisch-backend --tail 100 -f
docker logs movarisch-app --tail 100 -f
docker logs movarisch-db --tail 100 -f

# Risorse container
docker stats movarisch-backend movarisch-db

# Spazio disco
df -h
docker system df  # Spazio usato da Docker
```

---

## 🔧 Manutenzione

### Aggiornamento Applicazione

**Scenario**: Modifiche al codice frontend/backend.

```bash
# Locale
1. Modifica codice
2. Test in locale: npm run dev
3. Deploy: .\deploy.ps1

# Il deploy.ps1 fa automaticamente:
# - Build
# - Upload
# - Extract
# - Rebuild Docker
# - Restart container
```

**REGOLA D'ORO**: I dati del database NON vengono toccati!

### Aggiornamento Dipendenze

**Frontend**:
```bash
cd c:\PROGRAMMAZIONE\movarisch
npm outdated              # Vedi pacchetti obsoleti
npm update                # Aggiorna minor/patch
npm install react@latest  # Aggiorna major version
```

**Backend**:
```bash
cd c:\PROGRAMMAZIONE\movarisch\server
npm outdated
npm update
```

Dopo aggiornamenti, **testa in locale** prima di fare deploy!

### Backup Prima di Manutenzione

**SEMPRE** fare backup database prima di operazioni rischiose:

```bash
# Su VPS
docker exec movarisch-db pg_dump -U movarisch_app movarisch > backup_pre_manutenzione.sql

# Scarica backup in locale
scp root@72.61.189.136:backup_pre_manutenzione.sql ./backups/
```

### Rollback

Se deploy va male:

```bash
# Su VPS
cd /opt/movarisch-new

# 1. Stop containers
docker-compose down

# 2. Restore file vecchi (se hai backup)
tar -xzf old_dist_backup.tar.gz -C server/

# 3. Rebuild e restart
docker-compose build --no-cache
docker-compose up -d

# 4. Eventuale restore database
cat backup_pre_manutenzione.sql | docker exec -i movarisch-db psql -U movarisch_app movarisch
```

### Pulizia Spazio Disco

**ATTENZIONE**: Fai solo se sei sicuro!

```bash
# Immagini Docker non usate
docker image prune

# Container stopped
docker container prune

# NON USARE MAI:
# docker system prune -a --volumes  ← Cancella TUTTO incluso DB!
```

### Rinnovo SSL

Traefik (Dokploy) rinnova automaticamente certificati Let's Encrypt.

Se ci sono problemi:
```bash
# Verifica Traefik
docker logs dokploy-traefik

# Restart Traefik (solo se necessario)
docker restart dokploy-traefik
```

---

## 🐛 Troubleshooting

### 1. Applicazione Non Raggiungibile

**Sintomo**: https://movarisch.safetyprosuite.com non risponde.

**Check**:
```bash
# VPS - Verifica container
docker ps | grep movarisch
# Devono essere tutti "Up"

# Se backend/frontend sono Down
docker-compose restart movarisch-backend
docker-compose restart movarisch-app

# Verifica logs
docker logs movarisch-backend --tail 50
docker logs movarisch-app --tail 50
```

**Verifica Traefik**:
```bash
docker logs dokploy-traefik | grep movarisch
# Deve mostrare route configurata
```

### 2. Errore 403 su API

**Sintomo**: API ritorna 403 Forbidden.

**Causa**: Token JWT non valido o scaduto.

**Fix Frontend**:
- Logout e login di nuovo
- Cancella localStorage: `localStorage.clear()`

**Fix Backend**:
```bash
# Verifica JWT_SECRET in environment
docker exec movarisch-backend env | grep JWT_SECRET

# Se manca, aggiungi in docker-compose.yml:
environment:
  - JWT_SECRET=your-secret-key
```

### 3. Database Connection Failed

**Sintomo**: Backend logs mostra `ECONNREFUSED` o `password authentication failed`.

**Check**:
```bash
# 1. Database container running?
docker ps | grep movarisch-db

# 2. Database logs
docker logs movarisch-db --tail 50

# 3. Test connessione
docker exec movarisch-db psql -U movarisch_app -d movarisch -c "SELECT 1;"
```

**Fix**:
```bash
# Restart database e backend (in ordine!)
docker restart movarisch-db
sleep 5
docker restart movarisch-backend
```

### 4. File JavaScript Vecchi (Cache)

**Sintomo**: Browser carica JavaScript vecchio dopo deploy.

**Soluzione Utente**:
1. Hard refresh: Ctrl+Shift+R
2. Cancella cache browser
3. Modalità incognito

**Soluzione Sviluppatore**:
- Verifica che `add-version.js` funzioni
- Controlla timestamp in `index.html`:
  ```bash
  docker exec movarisch-app cat /usr/share/nginx/html/index.html | grep "?v="
  # Deve mostrare: index.js?v=1765282000000
  ```

### 5. Email Non Vengono Inviate

**Sintomo**: Password reset non invia email.

**Check**:
```bash
# 1. Verifica configurazione email
docker exec movarisch-backend env | grep EMAIL

# 2. Logs backend
docker logs movarisch-backend | grep -i email
docker logs movarisch-backend | grep -i smtp
```

**Fix**:
- Verifica Gmail App Password sia corretta
- Controlla che Gmail SMTP non sia bloccato
- Test manuale:
  ```bash
  # Nel backend container
  docker exec -it movarisch-backend node
  > const nodemailer = require('nodemailer');
  > // Test SMTP connection
  ```

### 6. Database Pieno / Spazio Disco

**Check**:
```bash
# Spazio disco VPS
df -h
# Se /var/lib/docker è >80%, problemi!

# Spazio Docker
docker system df
```

**Pulizia**:
```bash
# Logs vecchi
docker system prune

# Backup e compressione vecchi
gzip backup_*.sql
```

### 7. Container Crasha Continuamente

**Sintomo**: Container restart loop.

**Check**:
```bash
docker ps -a | grep movarisch
# Se "Restarting" → problemi

docker logs movarisch-backend --tail 100
# Vedi l'errore che causa crash
```

**Fix comune**:
- Variabile d'ambiente mancante
- Porta già in uso
- Database non raggiungibile

### 8. Performance Lente

**Check**:
```bash
# CPU/RAM container
docker stats movarisch-backend movarisch-db

# Query lente database
docker exec movarisch-db psql -U movarisch_app movarisch -c "
  SELECT query, calls, mean_exec_time
  FROM pg_stat_statements
  ORDER BY mean_exec_time DESC
  LIMIT 10;
"
```

**Ottimizzazioni**:
- Aggiungi indici database
- Aumenta risorse VPS
- Cache Redis per dati frequenti

---

## 📚 Riferimenti Rapidi

### Comandi Essenziali

```bash
# Deploy completo
.\deploy.ps1

# Restart singolo service
docker-compose restart movarisch-backend

# Logs live
docker-compose logs -f movarisch-backend

# Accesso shell container
docker exec -it movarisch-backend sh

# Backup database
docker exec movarisch-db pg_dump -U movarisch_app movarisch > backup.sql

# Restore database
cat backup.sql | docker exec -i movarisch-db psql -U movarisch_app movarisch
```

### URL e Porte

| Risorsa | URL/Porta |
|---------|-----------|
| App Produzione | https://movarisch.safetyprosuite.com |
| Frontend Dev | http://localhost:5173 |
| Backend Dev | http://localhost:3000 |
| Database (da VPS) | localhost:5434 |
| VPS SSH | ssh root@72.61.189.136 |

### File Importanti

| File | Scopo |
|------|-------|
| `deploy.ps1` | Script deploy automatico |
| `docker-compose.yml` | Configurazione container |
| `Dockerfile` | Build frontend container |
| `server/Dockerfile` | Build backend container |
| `nginx.conf` | Configurazione Nginx |
| `add-version.js` | Cache busting script |
| `DATABASE_PERSISTENCE_GUIDE.md` | Guida persistenza DB |
| `TECHNICAL_DOCUMENTATION.md` | Questo documento |

### Credenziali

**Database**:
- Host: `movarisch-db` (interno) o `72.61.189.136:5434` (esterno)
- Database: `movarisch`
- User: `movarisch_app`
- Password: `MoVa2025App!`

**VPS SSH**:
- Host: `72.61.189.136`
- User: `root`
- Password: `0z3u88E.QVaNnAx,h8V+`

**NOTA**: In produzione, usa chiavi SSH invece di password!

---

## 🎯 Best Practices

### Sviluppo

1. **Sempre testare in locale** prima di deploy
2. **Commit frequenti** con messaggi chiari
3. **Branch separati** per feature grosse
4. **Code review** prima di merge a main
5. **Documentare** modifiche complesse

### Deploy

1. **Backup database** prima di ogni deploy
2. **Deploy in orari a basso traffico** (notte)
3. **Monitorare logs** per 10 min dopo deploy
4. **Rollback plan** pronto se qualcosa va male
5. **Non usare MAI** `docker-compose down -v`

### Sicurezza

1. **Cambia password** database e VPS periodicamente
2. **Aggiorna dipendenze** per patch sicurezza
3. **Limita accesso SSH** (solo IP fidati)
4. **Usa chiavi SSH** invece di password
5. **Monitora logs** per accessi sospetti

### Database

1. **Backup automatici giornalieri** (TODO: cron job)
2. **Test restore** da backup periodicamente
3. **Monitoring spazio disco** database
4. **Indici** su colonne usate in WHERE/JOIN
5. **Vacuum/Analyze** PostgreSQL regolarmente

---

## 📞 Contatti e Supporto

### Team Sviluppo

- **Azienda**: AQR Group SRL
- **Email**: info@aqrgroup.it
- **Sito**: (da specificare)

### Manutenzione VPS

- **Provider VPS**: (da specificare)
- **Support**: (da specificare)

### Documentazione Aggiuntiva

- **React**: https://react.dev/
- **Express.js**: https://expressjs.com/
- **PostgreSQL**: https://www.postgresql.org/docs/
- **Docker**: https://docs.docker.com/
- **Nginx**: https://nginx.org/en/docs/

---

## 📝 Note di Versione

### Versione Corrente

- **Data**: 09 Dicembre 2025
- **Versione**: 1.0.0

### Modifiche Recenti

- ✅ Implementato database PostgreSQL persistente
- ✅ Configurato Docker Compose con volume persistente
- ✅ Fix cache busting con timestamp
- ✅ Risolti conflitti porte con altre app VPS
- ✅ Fix AuthContext token passing
- ✅ Documentazione completa creata

### Roadmap Future

- [ ] Sistema migration database automatico
- [ ] Backup automatici giornalieri (cron job)
- [ ] Monitoring con Grafana/Prometheus
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Test automatici (Jest + React Testing Library)
- [ ] Logging strutturato (Winston)
- [ ] Rate limiting API
- [ ] Integrazione Stripe per pagamenti

---

**Documento creato**: 09 Dicembre 2025
**Ultima modifica**: 09 Dicembre 2025
**Autore**: Claude Code + Team AQR Group
**Versione**: 1.0.0

---

🚀 **MoVaRisCh 2025 - Ready for Production!**
