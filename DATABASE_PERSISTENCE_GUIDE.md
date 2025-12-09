# MoVaRisCh - Guida Persistenza Database PostgreSQL

## ⚠️ IMPORTANTE: Come NON Perdere Dati

Questo documento contiene tutte le informazioni per garantire che il database MoVaRisCh NON perda MAI i dati durante aggiornamenti, rebuild, o deploy.

---

## 📊 Configurazione Database Attuale

### Docker Compose Configuration
Il database è configurato in `docker-compose.yml` con:

```yaml
movarisch-db:
  image: postgres:16-alpine
  container_name: movarisch-db
  restart: always
  environment:
    - POSTGRES_DB=movarisch
    - POSTGRES_USER=movarisch_app
    - POSTGRES_PASSWORD=MoVa2025App!
  volumes:
    - movarisch-db-data:/var/lib/postgresql/data
  ports:
    - "5433:5432"

volumes:
  movarisch-db-data:
    driver: local
```

### Credenziali Database
- **Host**: `movarisch-db` (nome container Docker)
- **Port**: `5432` (interno), `5433` (esterno)
- **Database**: `movarisch`
- **User**: `movarisch_app`
- **Password**: `MoVa2025App!`

### Environment Variables Backend
Il backend (`movarisch-backend`) riceve automaticamente queste variabili d'ambiente:

```yaml
environment:
  - DB_HOST=movarisch-db
  - DB_PORT=5432
  - DB_NAME=movarisch
  - DB_USER=movarisch_app
  - DB_PASSWORD=MoVa2025App!
```

---

## 🔒 Persistenza Dati Garantita

### Volume Docker Persistente
Il volume `movarisch-db-data` è un **Docker named volume** che:

1. ✅ **Persiste SEMPRE** - Non viene cancellato durante rebuild
2. ✅ **Sopravvive a `docker-compose down`** - I dati restano
3. ✅ **Sopravvive a rebuild dell'app** - Solo il container cambia, non i dati
4. ✅ **Indipendente dal codice** - Separato dai file dell'applicazione

### Cosa NON Cancella i Dati

Queste operazioni sono **SICURE** e NON perdono dati:

```bash
# ✅ SICURO - Rebuild solo app/backend
docker-compose build --no-cache movarisch-app
docker-compose build --no-cache movarisch-backend

# ✅ SICURO - Restart container
docker-compose restart movarisch-db

# ✅ SICURO - Stop e restart
docker-compose down
docker-compose up -d

# ✅ SICURO - Deploy completo (come nel deploy.ps1)
docker-compose down && docker-compose up -d --force-recreate
```

### ⚠️ ATTENZIONE - Cosa PUÒ Cancellare i Dati

Queste operazioni sono **PERICOLOSE**:

```bash
# ❌ PERICOLOSO - Cancella il volume!
docker-compose down -v

# ❌ PERICOLOSO - Cancella tutti i volumi!
docker volume prune

# ❌ PERICOLOSO - Cancella il volume specifico!
docker volume rm movarisch-db-data
```

**REGOLA D'ORO**: NON usare MAI `-v` con `docker-compose down`!

---

## 📋 Schema Database

Il database contiene queste tabelle (vedi `server/config/database.js`):

### Tabelle Principali
1. **users** - Utenti e dati azienda
2. **subscriptions** - Abbonamenti e trial
3. **payments** - Pagamenti effettuati
4. **password_reset_tokens** - Token reset password
5. **workplaces** - Luoghi di lavoro
6. **roles** - Mansioni
7. **inventory** - Agenti chimici
8. **reports** - Report generati

### Relazioni
- Tutte le tabelle sono collegate a `users(id)` con `ON DELETE CASCADE`
- Eliminando un utente, si eliminano automaticamente tutti i suoi dati

---

## 🔄 Workflow Deploy Sicuro

### Deploy Script (`deploy.ps1`)

Il deploy corretto è:

```powershell
# STEP 1: Build locale
npm run build

# STEP 2-4: Upload file
# ... (upload dist, Dockerfile, nginx.conf)

# STEP 5: Extract (PRIMA del build!)
tar -xzf dist.tar.gz -C server/

# STEP 6: Build images (NO rebuild del database!)
docker-compose build --no-cache movarisch-app movarisch-backend

# STEP 7: Deploy (restart senza -v)
docker-compose down
docker-compose up -d --force-recreate
```

**NOTA CRITICA**:
- Nel STEP 7, `docker-compose down` NON ha `-v`
- Il database NON viene incluso nel `build --no-cache`
- I dati restano nel volume `movarisch-db-data`

---

## 💾 Backup Database

### Backup Manuale

Per fare backup del database:

```bash
# Backup SQL dump
docker exec movarisch-db pg_dump -U movarisch_app movarisch > backup_$(date +%Y%m%d_%H%M%S).sql

# Backup del volume Docker (più completo)
docker run --rm -v movarisch-db-data:/data -v $(pwd):/backup alpine tar czf /backup/movarisch-db-backup_$(date +%Y%m%d_%H%M%S).tar.gz -C /data .
```

### Restore da Backup

Per ripristinare il database:

```bash
# Restore da SQL dump
cat backup_20251209_120000.sql | docker exec -i movarisch-db psql -U movarisch_app movarisch

# Restore da volume backup
docker run --rm -v movarisch-db-data:/data -v $(pwd):/backup alpine tar xzf /backup/movarisch-db-backup_20251209_120000.tar.gz -C /data
```

---

## 🔍 Verifiche Post-Deploy

Dopo ogni deploy, verifica che il database funzioni:

### 1. Check Container Status
```bash
docker ps | grep movarisch-db
# Deve mostrare: Up X minutes
```

### 2. Check Database Connection
```bash
docker exec movarisch-db psql -U movarisch_app -d movarisch -c "SELECT COUNT(*) FROM users;"
# Deve restituire il numero di utenti
```

### 3. Check Volume Exists
```bash
docker volume ls | grep movarisch-db-data
# Deve mostrare: movarisch-db-data
```

### 4. Check Backend Logs
```bash
docker logs movarisch-backend --tail 20
# Deve mostrare: "Connected to PostgreSQL database"
```

---

## 🚨 Troubleshooting

### Il Backend Non Si Connette al Database

**Problema**: Backend mostra errori di connessione PostgreSQL

**Soluzione**:
1. Verifica che il container `movarisch-db` sia running:
   ```bash
   docker ps | grep movarisch-db
   ```

2. Verifica le credenziali nel docker-compose.yml

3. Verifica i logs del database:
   ```bash
   docker logs movarisch-db --tail 50
   ```

### Ho Perso i Dati!

**Se hai eseguito `docker-compose down -v` per errore:**

1. **STOP IMMEDIATAMENTE** - Non fare altri comandi
2. Controlla se esiste un backup recente
3. Restore dal backup più recente (vedi sezione Backup)

**Prevenzione**:
- **SEMPRE** fare backup prima di operazioni rischiose
- **MAI** usare `-v` con `docker-compose down`
- Automatizza i backup giornalieri

---

## 📝 Checklist Operazioni Sicure

Prima di ogni deploy o manutenzione:

- [ ] Verifico che `docker-compose down` NON abbia `-v`
- [ ] Ho un backup recente (< 24h)
- [ ] Verifico che il volume `movarisch-db-data` esista
- [ ] Testo in locale prima di deploy su VPS
- [ ] Ho letto questa guida

---

## 📂 File Coinvolti

### Locali
- `docker-compose.yml` - Configurazione database e volumi
- `server/config/database.js` - Schema e connessione PostgreSQL
- `deploy.ps1` - Script deploy (SENZA -v)
- `DATABASE_PERSISTENCE_GUIDE.md` - Questo documento

### Sul VPS
- `/opt/movarisch-new/docker-compose.yml` - Config attivo
- Volume Docker: `movarisch-db-data` (gestito da Docker)
- Container: `movarisch-db` (postgres:16-alpine)

---

## 🔗 Collegamenti Utili

- **VPS IP**: 72.61.189.136
- **Deploy path**: /opt/movarisch-new
- **URL app**: https://movarisch.safetyprosuite.com
- **Database port** (esterno): 5433
- **Database port** (interno): 5432

---

## ✅ Garanzie Persistenza

Con questa configurazione:

1. ✅ **Deploy sicuro** - `deploy.ps1` NON cancella dati
2. ✅ **Rebuild sicuro** - Solo app/backend rebuild, DB intatto
3. ✅ **Restart sicuro** - Container restart NON tocca dati
4. ✅ **Volume separato** - Dati isolati dal codice
5. ✅ **Backup facili** - Comandi documentati sopra

---

## 📅 Creato

- **Data**: 09 Dicembre 2025
- **Autore**: Claude Code
- **Versione Database**: PostgreSQL 16-alpine
- **Versione Docker Compose**: 3

---

## 🔄 Aggiornamenti Futuri

Quando aggiorni l'app:

1. **Backend code changes**:
   - Modifica codice
   - Run `deploy.ps1`
   - Dati NON toccati ✅

2. **Schema changes**:
   - Aggiungi migration SQL
   - Esegui migration sul database running
   - NON rebuild container database

3. **PostgreSQL upgrade**:
   - Backup COMPLETO prima
   - Dump SQL → Nuovo container → Restore
   - Testa accuratamente

---

## 💡 Best Practices

1. **Backup automatici giornalieri** (TODO: implementare cron job)
2. **Test in locale** prima di ogni deploy
3. **Mai usare `-v`** con docker-compose down
4. **Monitorare logs** database regolarmente
5. **Documentare** ogni modifica schema

---

**PROMEMORIA FINALE**:

🚫 **MAI ESEGUIRE**: `docker-compose down -v`
✅ **SEMPRE ESEGUIRE**: `docker-compose down` (senza -v)

I tuoi dati sono al sicuro finché segui questa guida! 🎉
