# Guida al Deploy di MoVaRisCh su VPS con Dokploy e PostgreSQL

## Modifiche Effettuate per il Deploy Server

### 1. **Migrazione da localStorage a Database Server**

#### Backend (PostgreSQL)
- ✅ Migrato da SQLite a PostgreSQL
- ✅ Aggiunte tabelle: `workplaces`, `roles`, `inventory`
- ✅ Tutti i dati ora salvati su database server
- ✅ API RESTful complete per tutte le operazioni CRUD

#### Frontend
- ✅ `DataContext.jsx` ora usa API invece di localStorage
- ✅ `AuthContext.jsx` ottimizzato (solo token in localStorage)
- ✅ Validazione token tramite endpoint `/api/auth/me`

### 2. **Nuovi Endpoint API**

```
AUTH:
GET  /api/auth/me          - Valida token e ottiene info utente

WORKPLACES:
GET    /api/workplaces     - Lista luoghi di lavoro
POST   /api/workplaces     - Crea luogo
DELETE /api/workplaces/:id - Elimina luogo

ROLES (Mansioni):
GET    /api/roles          - Lista mansioni
POST   /api/roles          - Crea mansione
DELETE /api/roles/:id      - Elimina mansione

INVENTORY (Agenti Chimici):
GET    /api/inventory      - Lista inventario
POST   /api/inventory      - Aggiungi agente
PUT    /api/inventory/:id  - Modifica agente
DELETE /api/inventory/:id  - Elimina agente

REPORTS:
GET    /api/reports        - Lista report archiviati
POST   /api/reports        - Crea report
DELETE /api/reports/:id    - Elimina report
```

---

## Opzioni di Deploy

### **Opzione A: Deploy con Dokploy (Consigliato)**

Dokploy gestisce automaticamente i container e PostgreSQL.

#### Step 1: Preparare il Repository

```bash
# Assicurati che il codice sia in un repository Git
git add .
git commit -m "Migrazione a PostgreSQL per VPS"
git push
```

#### Step 2: Creare Database PostgreSQL in Dokploy

1. Accedi a Dokploy
2. Vai su "Databases" → "Create Database"
3. Seleziona PostgreSQL
4. Nome database: `movarisch`
5. Annota le credenziali fornite

#### Step 3: Configurare l'Applicazione in Dokploy

1. **Crea nuovo progetto** in Dokploy
2. **Collega il repository** Git

3. **Configurazione Backend:**
   - Nome: `movarisch-backend`
   - Directory build: `server`
   - Comando start: `npm start`
   - Porta interna: `3000`
   - **Porta esterna**: `3001` (o altra porta libera sulla tua VPS)

4. **Variabili d'ambiente Backend:**
   ```
   NODE_ENV=production
   PORT=3000
   JWT_SECRET=GENERA_UNA_CHIAVE_SICURA_QUI
   DB_HOST=<NOME_SERVIZIO_POSTGRES_DOKPLOY>
   DB_PORT=5432
   DB_NAME=movarisch
   DB_USER=<USER_DA_DOKPLOY>
   DB_PASSWORD=<PASSWORD_DA_DOKPLOY>
   ```

5. **Configurazione Frontend:**
   - Nome: `movarisch-app`
   - Directory build: `/`
   - Build command: `npm run build`
   - Dockerfile: usa quello esistente
   - Porta interna: `80`
   - **Porta esterna**: `8005` (o altra porta libera)

6. **Deploy** entrambi i servizi

#### Step 4: Verifica

```bash
# Testa il backend
curl https://tuo-dominio.com:3001/api/auth/me

# Apri l'app nel browser
https://tuo-dominio.com:8005
```

---

### **Opzione B: Deploy Manuale con Docker Compose**

Se preferisci controllare manualmente i container.

#### Step 1: Connetti al PostgreSQL esistente

Sul server VPS, crea il database:

```bash
# Connettiti a PostgreSQL
psql -U postgres

# Crea database
CREATE DATABASE movarisch;
CREATE USER movarisch_user WITH PASSWORD 'password_sicura';
GRANT ALL PRIVILEGES ON DATABASE movarisch TO movarisch_user;
\q
```

#### Step 2: Configura le Variabili d'Ambiente

```bash
# Sul server VPS, nella directory movarisch/server/
cp .env.example .env
nano .env
```

Modifica `.env`:
```
PORT=3000
NODE_ENV=production
JWT_SECRET=genera-una-chiave-super-segreta-almeno-32-caratteri
DB_HOST=localhost
DB_PORT=5432
DB_NAME=movarisch
DB_USER=movarisch_user
DB_PASSWORD=password_sicura
```

#### Step 3: Controlla le Porte Disponibili

```bash
# Verifica porte in uso
sudo netstat -tlnp | grep :3000
sudo netstat -tlnp | grep :8005

# Se occupate, modifica docker-compose.vps.yml
```

#### Step 4: Deploy

```bash
# Usa il docker-compose per VPS
docker-compose -f docker-compose.vps.yml up -d --build

# Verifica i log
docker-compose -f docker-compose.vps.yml logs -f
```

---

## Configurazione Nginx Reverse Proxy

Se vuoi esporre l'app su un dominio (es. `movarisch.tuodominio.com`):

```nginx
# /etc/nginx/sites-available/movarisch
server {
    listen 80;
    server_name movarisch.tuodominio.com;

    # Frontend
    location / {
        proxy_pass http://localhost:8005;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # API Backend
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Abilita il sito:
```bash
sudo ln -s /etc/nginx/sites-available/movarisch /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

Per HTTPS con Let's Encrypt:
```bash
sudo certbot --nginx -d movarisch.tuodominio.com
```

---

## Porte Utilizzate

**IMPORTANTE**: Modifica queste porte se già in uso sulla tua VPS

- **Frontend**: `8005` (modificabile in `docker-compose.vps.yml`)
- **Backend**: `3001` (modificabile in `docker-compose.vps.yml`)
- **PostgreSQL**: `5432` (porta standard, gestita da Dokploy o già esistente)

### Come Cambiare le Porte

Modifica `docker-compose.vps.yml`:

```yaml
services:
  movarisch-app:
    ports:
      - "8010:80"  # Cambia 8010 con una porta libera

  movarisch-backend:
    ports:
      - "3010:3000"  # Cambia 3010 con una porta libera
```

---

## Generare JWT Secret Sicuro

```bash
# Su Linux/Mac
openssl rand -base64 32

# Output esempio:
# vK8x2rZ9mN3pQ7wL5tY4uR6sA1cF8eH9
```

Usa questo valore per `JWT_SECRET` nel file `.env`

---

## Schema Database PostgreSQL

Le tabelle vengono create automaticamente all'avvio del server.

Schema completo:

```sql
users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nome VARCHAR(255),
    cognome VARCHAR(255),
    azienda VARCHAR(255),
    piva VARCHAR(50),
    company_data JSONB
)

workplaces (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

roles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

inventory (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    cas VARCHAR(50) NOT NULL,
    hCodes JSONB,
    riskLevel INTEGER DEFAULT 0,
    additionalData JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

reports (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data JSONB
)
```

---

## Troubleshooting

### Errore: "Cannot connect to database"

1. Verifica le credenziali in `.env`
2. Controlla che PostgreSQL sia in ascolto:
   ```bash
   sudo netstat -tlnp | grep 5432
   ```
3. Controlla i log del container:
   ```bash
   docker logs movarisch-backend
   ```

### Errore: "Port already in use"

1. Trova il processo che usa la porta:
   ```bash
   sudo lsof -i :3001
   ```
2. Modifica la porta in `docker-compose.vps.yml`

### Errore: "Invalid token"

1. Verifica che `JWT_SECRET` sia lo stesso su tutti i container
2. Cancella il token nel browser (localStorage)
3. Rieffettua il login

### I dati non si salvano

1. Verifica che il backend risponda:
   ```bash
   curl http://localhost:3001/api/workplaces -H "Authorization: Bearer <TOKEN>"
   ```
2. Controlla i log del browser (Console F12)
3. Verifica che le API usino le chiamate corrette (con token)

---

## Backup Database

### Backup Automatico

```bash
# Crea script backup
nano /opt/backup-movarisch.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/opt/backups/movarisch"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup PostgreSQL
docker exec postgres pg_dump -U movarisch_user movarisch > $BACKUP_DIR/movarisch_$DATE.sql

# Mantieni solo ultimi 30 backup
find $BACKUP_DIR -name "movarisch_*.sql" -mtime +30 -delete

echo "Backup completato: movarisch_$DATE.sql"
```

```bash
chmod +x /opt/backup-movarisch.sh

# Aggiungi a crontab (backup giornaliero alle 2am)
crontab -e
0 2 * * * /opt/backup-movarisch.sh
```

### Restore da Backup

```bash
# Ripristina backup
docker exec -i postgres psql -U movarisch_user movarisch < /opt/backups/movarisch/movarisch_20250101_020000.sql
```

---

## Monitoraggio

### Log in Tempo Reale

```bash
# Tutti i container
docker-compose -f docker-compose.vps.yml logs -f

# Solo backend
docker logs -f movarisch-backend

# Solo frontend
docker logs -f movarisch-app
```

### Stato dei Container

```bash
docker ps
docker stats
```

---

## Sicurezza

### Checklist

- [ ] JWT_SECRET generato in modo sicuro (almeno 32 caratteri)
- [ ] Password PostgreSQL forte
- [ ] Firewall configurato (solo porte necessarie aperte)
- [ ] HTTPS configurato con certificato SSL
- [ ] Backup automatici attivi
- [ ] File `.env` NON committato su Git (usa `.gitignore`)
- [ ] CORS configurato correttamente (solo domini autorizzati)
- [ ] Rate limiting implementato (opzionale, ma consigliato)

### Configurare Firewall

```bash
# Permetti solo porte necessarie
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

---

## Aggiornamenti Futuri

### Deploy Nuova Versione

```bash
# Pull ultimo codice
git pull origin main

# Rebuild e restart
docker-compose -f docker-compose.vps.yml up -d --build

# Verifica
docker-compose -f docker-compose.vps.yml ps
```

---

## Supporto

Per problemi o domande:
1. Controlla i log dei container
2. Verifica le configurazioni in `.env`
3. Controlla che PostgreSQL sia accessibile
4. Verifica le porte non siano in conflitto

---

## File Modificati per VPS

### File Creati/Modificati:
- ✅ `server/server.js` - Migrato a PostgreSQL
- ✅ `server/package.json` - Aggiunta dipendenza `pg` e `dotenv`
- ✅ `server/.env.example` - Template configurazione
- ✅ `src/context/DataContext.jsx` - Usa API invece di localStorage
- ✅ `src/context/AuthContext.jsx` - Solo token in localStorage
- ✅ `docker-compose.vps.yml` - Configurazione con porte custom
- ✅ `DEPLOY_VPS.md` - Questa documentazione

### File da NON Committare:
- `server/.env` (contiene password)
- `server/node_modules/`
- `node_modules/`

---

## Riepilogo Comandi Deploy Rapido

```bash
# 1. Crea .env
cp server/.env.example server/.env
nano server/.env  # Modifica con le tue credenziali

# 2. Verifica porte disponibili
sudo netstat -tlnp | grep -E ':(3001|8005)'

# 3. Deploy
docker-compose -f docker-compose.vps.yml up -d --build

# 4. Verifica
docker-compose -f docker-compose.vps.yml ps
docker-compose -f docker-compose.vps.yml logs -f

# 5. Testa
curl http://localhost:3001/api/auth/me
# Apri browser: http://tuo-ip:8005
```

Buon deploy! 🚀
