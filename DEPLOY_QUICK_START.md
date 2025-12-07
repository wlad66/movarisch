# 🚀 Deploy MoVaRisCh su VPS - Quick Start

Guida rapida per deployare MoVaRisCh sulla tua VPS con Dokploy e PostgreSQL.

---

## ✅ Pre-requisiti

Sulla tua VPS devi avere:
- [x] Docker installato
- [x] Docker Compose installato
- [x] PostgreSQL disponibile (già esistente o via Dokploy)
- [x] Porte libere: 8005 (frontend) e 3001 (backend)
- [x] Git installato

---

## 🎯 Opzione 1: Deploy con Dokploy (Consigliato)

Dokploy gestisce automaticamente containers e database.

### Step 1: Preparare PostgreSQL in Dokploy

1. Accedi a Dokploy
2. Vai su **Databases** → **Create Database**
3. Seleziona **PostgreSQL**
4. Configurazione:
   ```
   Name: movarisch-db
   Database: movarisch
   User: movarisch_user
   Password: [genera password sicura]
   ```
5. Clicca **Create**
6. **Annota** le credenziali fornite

### Step 2: Push Codice su Git

```bash
# Se non hai ancora un repository
git init
git add .
git commit -m "Ready for production deploy with refactored backend"
git branch -M main
git remote add origin <tuo-repository-url>
git push -u origin main
```

### Step 3: Creare Progetto in Dokploy

1. In Dokploy, clicca **New Project**
2. Nome: `movarisch`

### Step 4A: Deploy Backend

1. **Add Service** → **From Git**
2. Configurazione:
   ```
   Name: movarisch-backend
   Repository: <tuo-repo-url>
   Branch: main
   Build Path: /server
   Port: 3000
   ```

3. **Environment Variables** (clicca "Add Variable"):
   ```
   NODE_ENV=production
   PORT=3000
   JWT_SECRET=<genera con: openssl rand -base64 32>
   DB_HOST=<nome-servizio-postgres-dokploy>
   DB_PORT=5432
   DB_NAME=movarisch
   DB_USER=movarisch_user
   DB_PASSWORD=<password-da-step-1>
   ```

4. **Ports**:
   ```
   Internal: 3000
   External: 3001  (o altra porta libera)
   ```

5. Clicca **Deploy**

### Step 4B: Deploy Frontend

1. **Add Service** → **From Git**
2. Configurazione:
   ```
   Name: movarisch-app
   Repository: <tuo-repo-url>
   Branch: main
   Build Path: /
   Port: 80
   ```

3. **Environment Variables**:
   ```
   NODE_ENV=production
   VITE_API_URL=http://<tuo-dominio>:3001
   ```

4. **Ports**:
   ```
   Internal: 80
   External: 8005  (o altra porta libera)
   ```

5. Clicca **Deploy**

### Step 5: Verifica Deploy

1. Controlla logs in Dokploy:
   - Backend: "✓ MoVaRisCh Server running on port 3000"
   - Frontend: Build completato

2. Testa backend:
   ```bash
   curl http://<tuo-ip-vps>:3001/health
   # Risposta: {"status":"ok","message":"MoVaRisCh API is running"}
   ```

3. Apri browser:
   ```
   http://<tuo-ip-vps>:8005
   ```

4. Prova:
   - Registrazione nuovo utente
   - Login
   - Crea workplace/role/inventory

---

## 🎯 Opzione 2: Deploy Manuale con Docker Compose

Se preferisci gestire manualmente i container.

### Step 1: Connetti alla VPS

```bash
ssh user@tuo-ip-vps
```

### Step 2: Clona Repository

```bash
cd /opt  # o altra directory
git clone <tuo-repository-url> movarisch
cd movarisch
```

### Step 3: Configura PostgreSQL

Se non hai PostgreSQL, installalo:

```bash
# Installa PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Crea database e utente
sudo -u postgres psql

postgres=# CREATE DATABASE movarisch;
postgres=# CREATE USER movarisch_user WITH PASSWORD 'password_super_sicura';
postgres=# GRANT ALL PRIVILEGES ON DATABASE movarisch TO movarisch_user;
postgres=# \q
```

### Step 4: Configura Variabili d'Ambiente

```bash
cd server
cp .env.example .env
nano .env
```

Modifica `.env`:
```env
PORT=3000
NODE_ENV=production
JWT_SECRET=<genera con: openssl rand -base64 32>
DB_HOST=localhost
DB_PORT=5432
DB_NAME=movarisch
DB_USER=movarisch_user
DB_PASSWORD=password_super_sicura
```

**IMPORTANTE:** Genera JWT_SECRET sicuro:
```bash
openssl rand -base64 32
# Output esempio: vK8x2rZ9mN3pQ7wL5tY4uR6sA1cF8eH9
```

### Step 5: Verifica Porte Disponibili

```bash
sudo netstat -tlnp | grep -E ':(3001|8005)'
```

Se le porte sono occupate, modifica `docker-compose.vps.yml`:
```yaml
movarisch-app:
  ports:
    - "8010:80"  # Cambia 8010 con porta libera

movarisch-backend:
  ports:
    - "3010:3000"  # Cambia 3010 con porta libera
```

### Step 6: Build e Deploy

```bash
# Torna alla root del progetto
cd /opt/movarisch

# Build e avvia containers
docker-compose -f docker-compose.vps.yml up -d --build
```

### Step 7: Verifica Deploy

```bash
# Controlla containers attivi
docker-compose -f docker-compose.vps.yml ps

# Controlla logs backend
docker-compose -f docker-compose.vps.yml logs -f movarisch-backend

# Controlla logs frontend
docker-compose -f docker-compose.vps.yml logs -f movarisch-app

# Test API
curl http://localhost:3001/health
```

### Step 8: Test dal Browser

Apri browser:
```
http://<tuo-ip-vps>:8005
```

---

## 🔒 Configurare HTTPS (Opzionale ma Consigliato)

### Con Nginx Reverse Proxy

1. Installa Nginx:
```bash
sudo apt install nginx
```

2. Crea configurazione:
```bash
sudo nano /etc/nginx/sites-available/movarisch
```

Contenuto:
```nginx
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

3. Abilita sito:
```bash
sudo ln -s /etc/nginx/sites-available/movarisch /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

4. Configura SSL con Let's Encrypt:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d movarisch.tuodominio.com
```

Ora accedi via HTTPS:
```
https://movarisch.tuodominio.com
```

---

## 🛡️ Sicurezza - Checklist

Prima del deploy in produzione:

- [ ] **JWT_SECRET** generato in modo sicuro (32+ caratteri)
  ```bash
  openssl rand -base64 32
  ```

- [ ] **Password PostgreSQL** forte (min 16 caratteri, mix lettere/numeri/simboli)

- [ ] **File .env NON committato** su Git (verificato in .gitignore)

- [ ] **Firewall configurato** (solo porte necessarie)
  ```bash
  sudo ufw allow 22/tcp   # SSH
  sudo ufw allow 80/tcp   # HTTP
  sudo ufw allow 443/tcp  # HTTPS
  sudo ufw enable
  ```

- [ ] **HTTPS configurato** (certificato SSL)

- [ ] **Backup automatici** database configurati

- [ ] **Porte esposte solo necessarie** (3001, 8005 se servono, altrimenti solo Nginx)

---

## 📊 Monitoraggio

### Logs in Tempo Reale

```bash
# Tutti i containers
docker-compose -f docker-compose.vps.yml logs -f

# Solo backend
docker logs -f movarisch-backend

# Solo frontend
docker logs -f movarisch-app
```

### Stato Containers

```bash
# Lista containers
docker ps

# Statistiche uso risorse
docker stats
```

### Riavvio Servizi

```bash
# Riavvia tutto
docker-compose -f docker-compose.vps.yml restart

# Riavvia solo backend
docker-compose -f docker-compose.vps.yml restart movarisch-backend
```

---

## 🔄 Aggiornamenti

### Deploy Nuova Versione

```bash
# 1. Pull nuovo codice
cd /opt/movarisch
git pull origin main

# 2. Rebuild e restart
docker-compose -f docker-compose.vps.yml up -d --build

# 3. Verifica
docker-compose -f docker-compose.vps.yml logs -f
```

### Rollback alla Versione Precedente

```bash
# 1. Torna al commit precedente
git log --oneline  # Trova hash commit precedente
git checkout <hash-commit>

# 2. Rebuild
docker-compose -f docker-compose.vps.yml up -d --build
```

---

## 💾 Backup Database

### Backup Manuale

```bash
# Backup completo
docker exec postgres-container pg_dump -U movarisch_user movarisch > backup_$(date +%Y%m%d).sql

# O se PostgreSQL è sulla VPS direttamente
pg_dump -U movarisch_user -h localhost movarisch > backup_$(date +%Y%m%d).sql
```

### Backup Automatico (Cron)

```bash
# Crea script backup
sudo nano /opt/backup-movarisch.sh
```

Contenuto:
```bash
#!/bin/bash
BACKUP_DIR="/opt/backups/movarisch"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup database
pg_dump -U movarisch_user -h localhost movarisch > $BACKUP_DIR/movarisch_$DATE.sql

# Mantieni solo ultimi 30 giorni
find $BACKUP_DIR -name "movarisch_*.sql" -mtime +30 -delete

echo "Backup completato: movarisch_$DATE.sql"
```

Rendi eseguibile e aggiungi a cron:
```bash
sudo chmod +x /opt/backup-movarisch.sh

# Aggiungi a crontab (backup giornaliero alle 2am)
sudo crontab -e
0 2 * * * /opt/backup-movarisch.sh >> /var/log/movarisch-backup.log 2>&1
```

### Restore da Backup

```bash
psql -U movarisch_user -h localhost movarisch < backup_20250107.sql
```

---

## 🐛 Troubleshooting

### Backend non si avvia

```bash
# Controlla logs
docker logs movarisch-backend

# Problemi comuni:
# 1. DB_HOST sbagliato → Verifica in .env
# 2. PostgreSQL non raggiungibile → Verifica connessione
# 3. Porta occupata → Cambia porta in docker-compose.vps.yml
```

### Frontend mostra errori 500

```bash
# Verifica backend sia raggiungibile
curl http://localhost:3001/health

# Se non risponde, controlla firewall
sudo ufw status

# Verifica API proxy in nginx.conf (se usi Nginx)
```

### Database connection refused

```bash
# Verifica PostgreSQL sia attivo
sudo systemctl status postgresql

# Testa connessione manuale
psql -U movarisch_user -h localhost -d movarisch

# Se fallisce, controlla:
# - Password corretta in .env
# - pg_hba.conf permette connessioni
# - PostgreSQL in ascolto su porta corretta
```

### Porte già in uso

```bash
# Trova processo che usa porta
sudo lsof -i :3001

# Opzioni:
# 1. Stoppa il processo
# 2. Cambia porta in docker-compose.vps.yml
```

---

## 📞 Supporto

### Documentazione Completa
- [DEPLOY_VPS.md](DEPLOY_VPS.md) - Guida completa deploy
- [MIGRAZIONE_VPS_SUMMARY.md](MIGRAZIONE_VPS_SUMMARY.md) - Riepilogo modifiche
- [REFACTORING_COMPLETED.md](REFACTORING_COMPLETED.md) - Refactoring backend

### Comandi Utili

```bash
# Status generale
docker-compose -f docker-compose.vps.yml ps

# Restart tutto
docker-compose -f docker-compose.vps.yml restart

# Stop tutto
docker-compose -f docker-compose.vps.yml down

# Rebuild da zero
docker-compose -f docker-compose.vps.yml down
docker-compose -f docker-compose.vps.yml up -d --build

# Pulizia completa (ATTENZIONE: cancella tutto)
docker-compose -f docker-compose.vps.yml down -v
```

---

## ✅ Checklist Deploy Completato

Verifica che tutto funzioni:

- [ ] Backend risponde a `/health`
  ```bash
  curl http://<ip>:3001/health
  ```

- [ ] Frontend carica nel browser
  ```
  http://<ip>:8005
  ```

- [ ] Registrazione nuovo utente funziona

- [ ] Login funziona

- [ ] Creazione workplaces funziona

- [ ] Creazione roles funziona

- [ ] Creazione inventory funziona

- [ ] Archiviazione report funziona

- [ ] HTTPS configurato (se necessario)

- [ ] Backup automatici configurati

- [ ] Firewall configurato

---

## 🎉 Deploy Completato!

La tua app MoVaRisCh è ora live su:

**Frontend:** `http://<tuo-ip>:8005`
**Backend API:** `http://<tuo-ip>:3001`

Se hai configurato dominio e HTTPS:
**App:** `https://movarisch.tuodominio.com`

---

**Buon lavoro! 🚀**
