# 🚀 Deploy MoVaRisCh - Guida per NON Programmatori

**Ciao!** Ti guiderò passo-passo, comando per comando. Copia e incolla, niente di complicato.

---

## 📋 Di Cosa Hai Bisogno

Prima di iniziare, assicurati di avere:

- [ ] **Accesso alla tua VPS** (sai come connetterti via SSH?)
- [ ] **Dokploy installato sulla VPS** (oppure Docker + Docker Compose)
- [ ] **10-15 minuti** di tempo libero
- [ ] **Questo documento** aperto mentre lavori

---

## 🎯 Scegli il Tuo Metodo

### Opzione A: Con Dokploy (PIÙ FACILE) ⭐

Se hai Dokploy sulla tua VPS, questa è la strada più semplice.

**VAI A:** [Sezione Dokploy](#-metodo-a-deploy-con-dokploy)

### Opzione B: Manuale (senza Dokploy)

Se non hai Dokploy, useremo Docker manualmente.

**VAI A:** [Sezione Manuale](#-metodo-b-deploy-manuale)

---

# 🌟 Metodo A: Deploy con Dokploy

## Step 1: Genera la Chiave Segreta

Apri il **Prompt dei comandi** (CMD) o **PowerShell** sul tuo PC Windows:

1. Premi `Win + R`
2. Scrivi `powershell`
3. Premi Invio

Copia e incolla questo comando:

```powershell
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

Premi Invio.

**Vedrai qualcosa tipo:**
```
vK8x2rZ9mN3pQ7wL5tY4uR6sA1cF8eH9iJ0kL1mN2oP3
```

✅ **IMPORTANTE:** Copia questo valore e **incollalo in un file Notepad**. Lo userai dopo.
Chiamalo `jwt_secret.txt`

---

## Step 2: Metti il Codice su GitHub

### Se NON hai ancora un repository GitHub:

1. Vai su [github.com](https://github.com)
2. Fai login
3. Clicca **"New repository"** (pulsante verde in alto a destra)
4. Nome repository: `movarisch`
5. Seleziona **"Private"** (per sicurezza)
6. Clicca **"Create repository"**

GitHub ti mostrerà dei comandi. **IGNORA PER ORA**, torna qui.

### Carica il Codice su GitHub:

Apri **Git Bash** (o PowerShell) nella cartella del progetto:

1. Apri Esplora File
2. Vai in `C:\PROGRAMMAZIONE\movarisch`
3. Click destro → **"Git Bash Here"** (o apri PowerShell qui)

Copia questi comandi **UNO ALLA VOLTA**:

```bash
# 1. Inizializza Git (se non l'hai fatto)
git init

# 2. Aggiungi tutti i file
git add .

# 3. Crea il commit
git commit -m "Ready for production deploy"

# 4. Rinomina branch in main
git branch -M main

# 5. Collega a GitHub (SOSTITUISCI tuo-username e movarisch se hai usato nomi diversi)
git remote add origin https://github.com/tuo-username/movarisch.git

# 6. Carica su GitHub
git push -u origin main
```

**Ti chiederà username e password GitHub:**
- Username: il tuo username GitHub
- Password: usa un **Personal Access Token** (non la password normale)

**Non hai il token?**
1. Vai su GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token → Seleziona "repo" → Generate
3. Copia il token e usalo come password

✅ **Fatto?** Il codice è ora su GitHub!

---

## Step 3: Crea Database in Dokploy

1. Apri **Dokploy** nel browser (es. `http://tuo-ip-vps:3000`)
2. Fai login
3. Clicca su **"Databases"** (menu a sinistra)
4. Clicca **"Create Database"**
5. Seleziona **"PostgreSQL"**
6. Compila:
   ```
   Name: movarisch-db
   Database: movarisch
   Username: movarisch_user
   Password: (clicca "Generate" per password automatica)
   ```
7. Clicca **"Create"**

✅ **IMPORTANTE:** Dokploy ti mostrerà i dettagli della connessione.

**Copia questi valori in Notepad** (chiamalo `database_info.txt`):
```
Host: postgres-movarisch-db (o simile, Dokploy te lo mostra)
Port: 5432
Database: movarisch
Username: movarisch_user
Password: (la password generata)
```

---

## Step 4: Deploy il Backend (API)

Sempre in Dokploy:

1. Clicca **"Projects"** (menu a sinistra)
2. Clicca **"Create Project"**
3. Nome: `MoVaRisCh`
4. Clicca **"Create"**

Ora sei dentro il progetto. Clicca **"Add Service"**:

1. Seleziona **"From Git"**
2. Compila:
   ```
   Service Name: backend
   Repository URL: https://github.com/tuo-username/movarisch.git
   Branch: main
   Build Path: server
   ```

3. **Scroll giù** → Sezione **"Environment Variables"**

   Clicca **"Add Variable"** e aggiungi TUTTE queste (una per una):

   | Key | Value |
   |-----|-------|
   | `NODE_ENV` | `production` |
   | `PORT` | `3000` |
   | `JWT_SECRET` | (incolla quello da jwt_secret.txt) |
   | `DB_HOST` | (incolla da database_info.txt) |
   | `DB_PORT` | `5432` |
   | `DB_NAME` | `movarisch` |
   | `DB_USER` | `movarisch_user` |
   | `DB_PASSWORD` | (incolla da database_info.txt) |

4. **Scroll giù** → Sezione **"Ports"**
   ```
   Container Port: 3000
   Published Port: 3001 (o altra porta se occupata)
   ```

5. Clicca **"Deploy"**

**ASPETTA 2-3 minuti** mentre Dokploy:
- Scarica il codice da GitHub
- Installa le dipendenze
- Avvia il server

✅ **Come verifichi che funziona?**

Vai su **"Logs"** (nel servizio backend) e cerca:
```
✓ MoVaRisCh Server running on port 3000
```

Se vedi questo, **PERFETTO!** Il backend funziona.

---

## Step 5: Deploy il Frontend (Interfaccia Web)

Sempre in Dokploy, nel progetto `MoVaRisCh`:

1. Clicca **"Add Service"** di nuovo
2. Seleziona **"From Git"**
3. Compila:
   ```
   Service Name: frontend
   Repository URL: https://github.com/tuo-username/movarisch.git
   Branch: main
   Build Path: (lascia vuoto o metti /)
   ```

4. **Environment Variables:**

   | Key | Value |
   |-----|-------|
   | `NODE_ENV` | `production` |

5. **Ports:**
   ```
   Container Port: 80
   Published Port: 8005 (o altra porta se occupata)
   ```

6. Clicca **"Deploy"**

**ASPETTA 3-5 minuti** (il frontend impiega più tempo).

✅ **Come verifichi che funziona?**

Vai su **"Logs"** e aspetta che finisca il build. Non ci saranno errori rossi.

---

## Step 6: TESTA L'APP! 🎉

### Test 1: API Backend

Apri browser e vai su:
```
http://tuo-ip-vps:3001/health
```

**Dovresti vedere:**
```json
{"status":"ok","message":"MoVaRisCh API is running"}
```

✅ Se vedi questo, il backend funziona!

### Test 2: Frontend

Apri browser e vai su:
```
http://tuo-ip-vps:8005
```

**Dovresti vedere** la pagina di login di MoVaRisCh!

### Test 3: Registrazione e Login

1. Clicca **"Registrati"**
2. Compila:
   ```
   Email: test@test.com
   Password: test1234
   Nome: Mario
   Cognome: Rossi
   Azienda: Test SRL
   P.IVA: 12345678901
   ```
3. Clicca **"Registra"**

Se ti porta alla schermata principale → **FUNZIONA!** 🎉

4. Prova a creare un **Luogo di Lavoro**
5. Prova a creare una **Mansione**
6. Prova a creare un **Agente Chimico**

**Ricarica la pagina** (F5) → I dati rimangono? **PERFETTO!** Sono salvati nel database.

---

## ✅ HAI FINITO CON DOKPLOY!

La tua app è live su:
- **Frontend:** `http://tuo-ip-vps:8005`
- **Backend:** `http://tuo-ip-vps:3001`

**Salta alla sezione:** [Post-Deploy](#-post-deploy-opzionale)

---

# 🔧 Metodo B: Deploy Manuale

## Step 1: Connettiti alla VPS

Apri **PuTTY** (Windows) o **Terminal** (Mac/Linux).

Connettiti alla tua VPS:
```bash
ssh root@tuo-ip-vps
```

(Ti chiederà la password della VPS)

✅ Sei dentro? Dovresti vedere qualcosa tipo:
```
root@server:~#
```

---

## Step 2: Verifica Docker sia Installato

Copia e incolla:
```bash
docker --version
```

**Dovresti vedere:**
```
Docker version 20.10.x
```

**Non hai Docker?** Installalo:
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
```

Verifica Docker Compose:
```bash
docker-compose --version
```

**Non c'è?** Installalo:
```bash
apt install docker-compose
```

---

## Step 3: Verifica Porte Libere

Copia e incolla:
```bash
netstat -tlnp | grep -E ':(3001|8005)'
```

**Se non appare nulla** → Porte libere! ✅

**Se appare qualcosa** → Porta occupata. **Annota quale porta è libera** (es. 3010, 8010).

---

## Step 4: Scarica il Codice

```bash
cd /opt
git clone https://github.com/tuo-username/movarisch.git
cd movarisch
```

(Sostituisci `tuo-username` con il tuo username GitHub)

**Non hai Git?**
```bash
apt install git
```

---

## Step 5: Configura PostgreSQL

### Installare PostgreSQL

```bash
apt update
apt install postgresql postgresql-contrib
```

### Creare Database

```bash
sudo -u postgres psql
```

Sei dentro PostgreSQL. Copia questi comandi **UNO ALLA VOLTA**:

```sql
CREATE DATABASE movarisch;
```

```sql
CREATE USER movarisch_user WITH PASSWORD 'PasswordSicura123!';
```

(⚠️ Cambia `PasswordSicura123!` con una password vera!)

```sql
GRANT ALL PRIVILEGES ON DATABASE movarisch TO movarisch_user;
```

```sql
\q
```

✅ Fatto! PostgreSQL è configurato.

---

## Step 6: Genera JWT Secret

```bash
openssl rand -base64 32
```

**Output esempio:**
```
vK8x2rZ9mN3pQ7wL5tY4uR6sA1cF8eH9iJ0kL1mN2oP3
```

✅ **Copia questo valore!** Lo usi nel prossimo step.

---

## Step 7: Configura File .env

```bash
cd /opt/movarisch/server
cp .env.example .env
nano .env
```

Si apre un editor. **Modifica così:**

```env
PORT=3000
NODE_ENV=production
JWT_SECRET=vK8x2rZ9mN3pQ7wL5tY4uR6sA1cF8eH9iJ0kL1mN2oP3
DB_HOST=localhost
DB_PORT=5432
DB_NAME=movarisch
DB_USER=movarisch_user
DB_PASSWORD=PasswordSicura123!
```

(Sostituisci `JWT_SECRET` con quello generato, e `DB_PASSWORD` con la tua password)

**Per salvare:**
1. Premi `Ctrl + O`
2. Premi `Invio`
3. Premi `Ctrl + X`

✅ File salvato!

---

## Step 8: (Opzionale) Modifica Porte

Se le porte 3001 o 8005 erano occupate:

```bash
cd /opt/movarisch
nano docker-compose.vps.yml
```

Trova queste righe:
```yaml
movarisch-app:
  ports:
    - "8005:80"  # Cambia 8005 con porta libera
```

```yaml
movarisch-backend:
  ports:
    - "3001:3000"  # Cambia 3001 con porta libera
```

Modifica i numeri, poi salva (Ctrl+O, Invio, Ctrl+X).

---

## Step 9: DEPLOY! 🚀

```bash
cd /opt/movarisch
docker-compose -f docker-compose.vps.yml up -d --build
```

**Questo comando:**
- Scarica le immagini Docker
- Installa dipendenze
- Avvia backend e frontend

**ASPETTA 5-10 minuti.**

✅ **Come verifichi?**

```bash
docker ps
```

Dovresti vedere:
```
movarisch-backend    Up
movarisch-app        Up
```

---

## Step 10: TESTA L'APP!

### Test Backend

```bash
curl http://localhost:3001/health
```

**Dovresti vedere:**
```json
{"status":"ok","message":"MoVaRisCh API is running"}
```

### Test Frontend

Apri browser e vai su:
```
http://tuo-ip-vps:8005
```

Dovresti vedere la pagina di login!

### Test Completo

1. Registra un utente
2. Fai login
3. Crea workplace/role/inventory
4. Ricarica pagina → Dati rimangono? ✅

---

## ✅ HAI FINITO CON DEPLOY MANUALE!

---

# 🔒 Post-Deploy (Opzionale)

## Configurare HTTPS (Consigliato)

**HAI UN DOMINIO?** (es. movarisch.tuodominio.com)

### Step 1: Installa Nginx

```bash
apt install nginx
```

### Step 2: Configura Nginx

```bash
nano /etc/nginx/sites-available/movarisch
```

Copia e incolla:
```nginx
server {
    listen 80;
    server_name movarisch.tuodominio.com;

    location / {
        proxy_pass http://localhost:8005;
        proxy_set_header Host $host;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
    }
}
```

(Sostituisci `movarisch.tuodominio.com` con il tuo dominio!)

Salva (Ctrl+O, Invio, Ctrl+X).

### Step 3: Abilita

```bash
ln -s /etc/nginx/sites-available/movarisch /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

### Step 4: Installa SSL

```bash
apt install certbot python3-certbot-nginx
certbot --nginx -d movarisch.tuodominio.com
```

Segui le istruzioni sullo schermo.

✅ **Fatto!** Ora hai HTTPS:
```
https://movarisch.tuodominio.com
```

---

## Configurare Backup Automatico

```bash
nano /opt/backup-movarisch.sh
```

Copia e incolla:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d)
pg_dump -U movarisch_user movarisch > /opt/backups/movarisch_$DATE.sql
find /opt/backups -name "movarisch_*.sql" -mtime +30 -delete
```

Salva. Poi:

```bash
chmod +x /opt/backup-movarisch.sh
mkdir -p /opt/backups

# Aggiungi a crontab (backup giornaliero 2am)
crontab -e
```

Aggiungi questa riga in fondo:
```
0 2 * * * /opt/backup-movarisch.sh
```

Salva (Ctrl+O, Invio, Ctrl+X).

✅ Backup automatici configurati!

---

# ✅ CHECKLIST FINALE

Verifica tutto:

- [ ] Backend risponde: `http://tuo-ip:3001/health`
- [ ] Frontend carica: `http://tuo-ip:8005`
- [ ] Registrazione funziona
- [ ] Login funziona
- [ ] Creazione dati funziona
- [ ] Dati persistono dopo ricarica
- [ ] (Opzionale) HTTPS funziona
- [ ] (Opzionale) Backup configurati

---

# 🎉 COMPLIMENTI!

La tua app **MoVaRisCh** è **LIVE**! 🚀

**Accesso:**
- Frontend: `http://tuo-ip:8005`
- Backend: `http://tuo-ip:3001`

Se hai dominio + HTTPS:
- App: `https://movarisch.tuodominio.com`

---

# 📞 Hai Problemi?

## Backend non parte

```bash
docker logs movarisch-backend
```

Cerca errori in rosso. Potrebbero essere:
- Password PostgreSQL sbagliata → Controlla `.env`
- PostgreSQL non raggiungibile → Verifica sia attivo: `systemctl status postgresql`

## Frontend non carica

```bash
docker logs movarisch-app
```

Verifica build completato senza errori.

## Porte occupate

```bash
lsof -i :3001
```

Vedi chi usa la porta. Puoi:
- Fermare quel processo
- Cambiare porta in `docker-compose.vps.yml`

---

# 🆘 Serve Aiuto?

**Problemi con:**
- Git/GitHub → Controlla username/token
- PostgreSQL → Verifica password in `.env`
- Docker → Controlla `docker ps` e `docker logs`
- Porte → Usa `netstat` per trovare porte libere

**Comandi Utili:**

```bash
# Vedere log real-time
docker logs -f movarisch-backend

# Restart tutto
docker-compose -f docker-compose.vps.yml restart

# Stop tutto
docker-compose -f docker-compose.vps.yml down

# Restart da zero
docker-compose -f docker-compose.vps.yml down
docker-compose -f docker-compose.vps.yml up -d --build
```

---

**Hai finito! Buon lavoro! 🎉**
