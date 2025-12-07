# ✅ Checklist Deploy MoVaRisCh

Usa questa checklist per assicurarti di non dimenticare nessun passaggio.

---

## 📋 Pre-Deploy (Da Fare ORA, sul tuo PC)

### 1. Verifica Codice Pronto

- [ ] Backend refactoring completato ✅ (fatto!)
- [ ] File `.gitignore` presente ✅ (fatto!)
- [ ] File `server/.env.example` presente ✅ (fatto!)
- [ ] Documentazione aggiornata ✅ (fatto!)

### 2. Commit e Push su Git

```bash
# Verifica stato
git status

# Se ci sono modifiche non committate
git add .
git commit -m "Production ready: refactored backend + PostgreSQL migration"

# Push su repository
git push origin main
```

- [ ] Codice committato
- [ ] Push su repository Git effettuato

### 3. Genera JWT Secret Sicuro

```bash
# Su Windows (PowerShell)
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))

# Su Linux/Mac
openssl rand -base64 32
```

**Output esempio:** `vK8x2rZ9mN3pQ7wL5tY4uR6sA1cF8eH9iJ0kL1mN2oP3`

- [ ] JWT_SECRET generato
- [ ] **Annotato in luogo sicuro** (lo userai dopo)

---

## 🚀 Deploy su VPS

Scegli il metodo che preferisci.

---

## Opzione A: Deploy con Dokploy (Più Facile)

### Step 1: Configurare Database PostgreSQL

Accedi a Dokploy:

- [ ] Vai su **Databases** → **Create Database**
- [ ] Seleziona **PostgreSQL**
- [ ] Imposta:
  ```
  Name: movarisch-db
  Database: movarisch
  User: movarisch_user
  Password: [genera password sicura, min 16 caratteri]
  ```
- [ ] Clicca **Create**
- [ ] **IMPORTANTE:** Annota questi dati:
  ```
  DB_HOST: _______________________
  DB_PORT: 5432
  DB_NAME: movarisch
  DB_USER: movarisch_user
  DB_PASSWORD: _______________________
  ```

### Step 2: Deploy Backend

- [ ] In Dokploy, clicca **New Project** → Nome: `movarisch`
- [ ] **Add Service** → **From Git**
- [ ] Configurazione:
  ```
  Name: movarisch-backend
  Repository: [tuo-repo-url]
  Branch: main
  Build Path: /server
  Port: 3000
  ```

- [ ] **Environment Variables** (copia i tuoi valori):
  ```
  NODE_ENV=production
  PORT=3000
  JWT_SECRET=[il tuo JWT secret generato]
  DB_HOST=[dal Step 1]
  DB_PORT=5432
  DB_NAME=movarisch
  DB_USER=movarisch_user
  DB_PASSWORD=[dal Step 1]
  ```

- [ ] **Ports:**
  ```
  Internal: 3000
  External: 3001  (o porta libera sulla tua VPS)
  ```

- [ ] Clicca **Deploy**
- [ ] Attendi build (~2-3 minuti)
- [ ] Verifica logs: cerca "✓ MoVaRisCh Server running on port 3000"

### Step 3: Deploy Frontend

- [ ] **Add Service** → **From Git**
- [ ] Configurazione:
  ```
  Name: movarisch-app
  Repository: [tuo-repo-url]
  Branch: main
  Build Path: /
  Port: 80
  ```

- [ ] **Environment Variables:**
  ```
  NODE_ENV=production
  ```

- [ ] **Ports:**
  ```
  Internal: 80
  External: 8005  (o porta libera sulla tua VPS)
  ```

- [ ] Clicca **Deploy**
- [ ] Attendi build (~3-5 minuti)
- [ ] Verifica logs: build completato senza errori

### Step 4: Verifica Funzionamento

- [ ] Test API (sostituisci `<tuo-ip>` con IP della VPS):
  ```bash
  curl http://<tuo-ip>:3001/health
  # Deve rispondere: {"status":"ok","message":"MoVaRisCh API is running"}
  ```

- [ ] Apri browser: `http://<tuo-ip>:8005`
- [ ] Verifica app carica
- [ ] **Test completo:**
  - [ ] Registrazione nuovo utente
  - [ ] Login
  - [ ] Crea 1 workplace
  - [ ] Crea 1 role
  - [ ] Crea 1 inventory item
  - [ ] Verifica dati salvati (ricarica pagina)

---

## Opzione B: Deploy Manuale (Più Controllo)

### Step 1: Connetti alla VPS

```bash
ssh user@<tuo-ip-vps>
```

- [ ] Connesso alla VPS

### Step 2: Verifica Porte Disponibili

```bash
sudo netstat -tlnp | grep -E ':(3001|8005)'
```

- [ ] Porta 3001 libera (o annota porta alternativa: ______)
- [ ] Porta 8005 libera (o annota porta alternativa: ______)

### Step 3: Clona Repository

```bash
cd /opt
sudo git clone <tuo-repository-url> movarisch
cd movarisch
```

- [ ] Repository clonato in `/opt/movarisch`

### Step 4: Configura PostgreSQL

**Se hai già PostgreSQL sulla VPS:**

- [ ] PostgreSQL installato e attivo
- [ ] Database `movarisch` creato
- [ ] User `movarisch_user` creato con permessi

**Se devi installare PostgreSQL:**

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib

sudo -u postgres psql
CREATE DATABASE movarisch;
CREATE USER movarisch_user WITH PASSWORD 'password_sicura_16_caratteri';
GRANT ALL PRIVILEGES ON DATABASE movarisch TO movarisch_user;
\q
```

- [ ] PostgreSQL configurato
- [ ] Credenziali annotate:
  ```
  DB_HOST: localhost
  DB_USER: movarisch_user
  DB_PASSWORD: _______________________
  ```

### Step 5: Configura .env

```bash
cd /opt/movarisch/server
cp .env.example .env
nano .env
```

Compila con i tuoi valori:
```env
PORT=3000
NODE_ENV=production
JWT_SECRET=[il tuo JWT secret generato]
DB_HOST=localhost
DB_PORT=5432
DB_NAME=movarisch
DB_USER=movarisch_user
DB_PASSWORD=[password PostgreSQL]
```

- [ ] File `.env` configurato
- [ ] Salvato con Ctrl+O, Enter, Ctrl+X

### Step 6: (Opzionale) Modifica Porte in docker-compose

```bash
cd /opt/movarisch
nano docker-compose.vps.yml
```

Se le porte 3001 o 8005 erano occupate, modifica:
```yaml
movarisch-app:
  ports:
    - "8010:80"  # Cambia 8010 con porta libera

movarisch-backend:
  ports:
    - "3010:3000"  # Cambia 3010 con porta libera
```

- [ ] Porte verificate/modificate (se necessario)

### Step 7: Build e Deploy

```bash
cd /opt/movarisch
docker-compose -f docker-compose.vps.yml up -d --build
```

Questo processo richiede 5-10 minuti.

- [ ] Build completato senza errori

### Step 8: Verifica Containers

```bash
docker-compose -f docker-compose.vps.yml ps
```

Dovresti vedere:
```
NAME                  STATUS
movarisch-app         Up
movarisch-backend     Up
```

- [ ] Entrambi i containers `Up`

### Step 9: Controlla Logs

```bash
# Backend
docker logs movarisch-backend --tail 50

# Cerca: "✓ MoVaRisCh Server running on port 3000"
```

- [ ] Backend avviato correttamente

```bash
# Frontend
docker logs movarisch-app --tail 50
```

- [ ] Frontend avviato correttamente

### Step 10: Test Funzionamento

```bash
# Test API
curl http://localhost:3001/health
```

- [ ] API risponde correttamente

**Dal tuo browser:**
- [ ] Apri `http://<ip-vps>:8005`
- [ ] App carica
- [ ] Registrazione funziona
- [ ] Login funziona
- [ ] CRUD workplaces/roles/inventory funziona

---

## 🔒 Post-Deploy: Sicurezza

### Firewall

```bash
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS (se userai SSL)
sudo ufw allow 8005/tcp  # Frontend (temporaneo, usa Nginx poi)
sudo ufw allow 3001/tcp  # Backend (temporaneo, usa Nginx poi)
sudo ufw enable
```

- [ ] Firewall configurato

### HTTPS con Nginx (Opzionale ma Consigliato)

Se hai un dominio:

```bash
sudo apt install nginx certbot python3-certbot-nginx
```

Crea config Nginx (vedi [DEPLOY_QUICK_START.md](DEPLOY_QUICK_START.md#-configurare-https-opzionale-ma-consigliato))

- [ ] Nginx configurato
- [ ] Certificato SSL installato
- [ ] App accessibile via HTTPS

---

## 💾 Post-Deploy: Backup

### Setup Backup Automatico

Crea script backup (vedi [DEPLOY_QUICK_START.md](DEPLOY_QUICK_START.md#-backup-database))

- [ ] Script backup creato
- [ ] Cron configurato (backup giornaliero)
- [ ] Test backup manuale eseguito

---

## 📊 Monitoraggio

### Comandi Utili da Salvare

```bash
# Logs real-time
docker-compose -f docker-compose.vps.yml logs -f

# Restart tutto
docker-compose -f docker-compose.vps.yml restart

# Aggiornamento (dopo git pull)
docker-compose -f docker-compose.vps.yml up -d --build
```

- [ ] Comandi salvati in file notes.txt sulla VPS

---

## ✅ Checklist Finale

Conferma che TUTTO funziona:

### Funzionalità App
- [ ] Registrazione utente
- [ ] Login utente
- [ ] Creazione workplace
- [ ] Creazione role
- [ ] Creazione agente chimico in inventory
- [ ] Calcolo rischio chimico
- [ ] Ottimizzatore DPI
- [ ] Archiviazione report
- [ ] Export DOCX

### Infrastruttura
- [ ] Backend raggiungibile
- [ ] Frontend raggiungibile
- [ ] Database connesso
- [ ] Dati persistono (dopo riavvio browser)
- [ ] Logs accessibili
- [ ] Backup configurati
- [ ] Firewall attivo
- [ ] (Opzionale) HTTPS funzionante

---

## 🎉 Deploy Completato!

Se hai spuntato tutte le checkbox, il deploy è completato con successo!

### I Tuoi Link

**Frontend:** `http://<tuo-ip>:8005`
**Backend API:** `http://<tuo-ip>:3001`
**Health Check:** `http://<tuo-ip>:3001/health`

Se hai configurato dominio:
**App:** `https://movarisch.tuodominio.com`

---

## 📞 In Caso di Problemi

1. **Controlla logs:**
   ```bash
   docker logs movarisch-backend
   docker logs movarisch-app
   ```

2. **Consulta:**
   - [DEPLOY_QUICK_START.md](DEPLOY_QUICK_START.md#-troubleshooting) - Troubleshooting
   - [DEPLOY_VPS.md](DEPLOY_VPS.md) - Guida completa

3. **Verifica configurazione:**
   - `server/.env` ha credenziali corrette?
   - PostgreSQL è raggiungibile?
   - Porte corrette in `docker-compose.vps.yml`?

---

**Buon deploy! 🚀**
