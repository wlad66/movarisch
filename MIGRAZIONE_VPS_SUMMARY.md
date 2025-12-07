# Riepilogo Migrazione MoVaRisCh per VPS

## ✅ Modifiche Completate

### 🔄 Persistenza Dati: localStorage → Database Server

**PRIMA:**
- Tutti i dati salvati nel browser (localStorage)
- Dati persi se si cambia browser/dispositivo
- Nessuna sincronizzazione tra utenti

**DOPO:**
- ✅ Tutti i dati salvati su PostgreSQL server
- ✅ Dati accessibili da qualsiasi dispositivo
- ✅ Multi-utente con isolamento dati per azienda
- ✅ Solo il token JWT salvato in localStorage

---

## 📋 File Modificati

### Backend
1. **server/server.js** - Migrato da SQLite a PostgreSQL
   - Tutte le query convertite da callback a async/await
   - Parametri `?` → `$1, $2, ...` (sintassi PostgreSQL)
   - JSON salvato come JSONB (nativo PostgreSQL)

2. **server/package.json** - Nuove dipendenze
   ```json
   "pg": "^8.11.3",
   "dotenv": "^16.3.1"
   ```

### Frontend
3. **src/context/DataContext.jsx**
   - ❌ Rimosso: `localStorage.setItem()`
   - ✅ Aggiunto: API calls per workplaces, roles, inventory
   - Tutte le funzioni sono ora `async`

4. **src/context/AuthContext.jsx**
   - ❌ Rimosso: salvataggio user/company in localStorage
   - ✅ Aggiunto: validazione token con `/api/auth/me`
   - Solo token JWT mantenuto in localStorage

---

## 🆕 File Creati

1. **server/.env.example** - Template configurazione
2. **docker-compose.vps.yml** - Configurazione con porte personalizzabili
3. **DEPLOY_VPS.md** - Guida completa al deploy
4. **.gitignore** - Protezione file sensibili
5. **MIGRAZIONE_VPS_SUMMARY.md** - Questo file

---

## 🗄️ Schema Database PostgreSQL

### Tabelle Create Automaticamente

```sql
users          - Utenti e aziende
workplaces     - Luoghi di lavoro
roles          - Mansioni
inventory      - Inventario agenti chimici
reports        - Report archiviati
```

Tutte con:
- Chiavi esterne verso `users(id)`
- `ON DELETE CASCADE` (eliminando utente, si cancellano tutti i suoi dati)
- Campi JSONB per dati complessi

---

## 🔌 Nuovi Endpoint API

### Autenticazione
- `GET /api/auth/me` - Valida token e ottieni info utente

### Workplaces
- `GET /api/workplaces` - Lista
- `POST /api/workplaces` - Crea
- `DELETE /api/workplaces/:id` - Elimina

### Roles (Mansioni)
- `GET /api/roles` - Lista
- `POST /api/roles` - Crea
- `DELETE /api/roles/:id` - Elimina

### Inventory
- `GET /api/inventory` - Lista
- `POST /api/inventory` - Aggiungi
- `PUT /api/inventory/:id` - Modifica
- `DELETE /api/inventory/:id` - Elimina

### Reports
- `GET /api/reports` - Lista
- `POST /api/reports` - Crea
- `DELETE /api/reports/:id` - Elimina

Tutti gli endpoint richiedono header:
```
Authorization: Bearer <token>
```

---

## ⚙️ Configurazione Necessaria

### 1. Crea file .env

```bash
cd server
cp .env.example .env
nano .env
```

### 2. Configura Variabili

```env
PORT=3000
NODE_ENV=production
JWT_SECRET=<GENERA_CHIAVE_SICURA_32_CARATTERI>
DB_HOST=localhost
DB_PORT=5432
DB_NAME=movarisch
DB_USER=postgres
DB_PASSWORD=<PASSWORD_POSTGRES>
```

**Genera JWT_SECRET:**
```bash
openssl rand -base64 32
```

---

## 🚀 Deploy

### Opzione 1: Con Dokploy (Consigliato)

Dokploy gestisce automaticamente PostgreSQL e containers.

**Leggi:** [DEPLOY_VPS.md](DEPLOY_VPS.md#opzione-a-deploy-con-dokploy-consigliato)

### Opzione 2: Docker Compose Manuale

```bash
# 1. Configura .env
cp server/.env.example server/.env
nano server/.env

# 2. Controlla porte disponibili
sudo netstat -tlnp | grep -E ':(3001|8005)'

# 3. Deploy
docker-compose -f docker-compose.vps.yml up -d --build

# 4. Verifica
docker-compose -f docker-compose.vps.yml logs -f
```

---

## 🔒 Porte Predefinite

| Servizio | Porta | Modificabile in |
|----------|-------|----------------|
| Frontend | 8005  | docker-compose.vps.yml |
| Backend  | 3001  | docker-compose.vps.yml |
| PostgreSQL | 5432 | Gestito da Dokploy o sistema |

**IMPORTANTE:** Verifica che queste porte siano libere sulla tua VPS!

```bash
# Controlla porte in uso
sudo netstat -tlnp | grep :8005
sudo netstat -tlnp | grep :3001
```

Se occupate, modifica `docker-compose.vps.yml`:
```yaml
movarisch-app:
  ports:
    - "8010:80"  # Usa porta libera

movarisch-backend:
  ports:
    - "3010:3000"  # Usa porta libera
```

---

## 🧪 Test Locale Prima del Deploy

### 1. Installa Dipendenze

```bash
# Backend
cd server
npm install

# Frontend
cd ..
npm install
```

### 2. Avvia PostgreSQL Locale

```bash
# Con Docker
docker run --name postgres-test -e POSTGRES_PASSWORD=test123 -p 5432:5432 -d postgres:15

# Crea database
docker exec -it postgres-test psql -U postgres -c "CREATE DATABASE movarisch;"
```

### 3. Configura .env Locale

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=movarisch
DB_USER=postgres
DB_PASSWORD=test123
JWT_SECRET=test-secret-key-for-development
```

### 4. Avvia Server

```bash
# Backend
cd server
npm start

# In un altro terminale - Frontend
cd ..
npm run dev
```

### 5. Testa

- Apri: http://localhost:5173
- Registrati con un'azienda
- Crea luoghi, mansioni, agenti
- Verifica che i dati si salvino (ricarica pagina)

---

## ⚠️ Differenze Importanti

### SQLite → PostgreSQL

| Feature | SQLite | PostgreSQL |
|---------|--------|------------|
| Auto-increment | `AUTOINCREMENT` | `SERIAL` |
| Placeholder | `?` | `$1, $2, ...` |
| JSON | `TEXT` | `JSONB` |
| Callback | `db.run(sql, [], (err) => {})` | `await pool.query(sql, [])` |
| Risultato insert | `this.lastID` | `result.rows[0].id` |
| Risultato delete | `this.changes` | `result.rowCount` |

### localStorage → API

| Feature | localStorage | API |
|---------|-------------|-----|
| Persistenza | Browser locale | Server PostgreSQL |
| Sincronizzazione | ❌ No | ✅ Sì |
| Multi-dispositivo | ❌ No | ✅ Sì |
| Limite dati | ~5-10 MB | Illimitato |
| Sicurezza | Bassa | Alta (token JWT) |

---

## 🔐 Sicurezza

### Checklist

- [x] Password hash con bcrypt
- [x] JWT con scadenza (24h)
- [x] Validazione input su tutti gli endpoint
- [x] Isolamento dati per utente (user_id)
- [x] ON DELETE CASCADE per integrità dati
- [ ] HTTPS configurato (fai dopo deploy)
- [ ] Backup automatici (fai dopo deploy)
- [ ] Rate limiting (opzionale)

### File da NON Committare

Verificati in `.gitignore`:
- ❌ `server/.env`
- ❌ `*.db`
- ❌ `node_modules/`

---

## 📊 Flusso Dati Completo

### Registrazione Utente
```
1. User compila form → POST /api/auth/register
2. Server crea record in users
3. Server genera JWT token
4. Frontend salva token in localStorage
5. Frontend salva user/company in state
```

### Login
```
1. User inserisce email/password → POST /api/auth/login
2. Server verifica credenziali
3. Server genera JWT token
4. Frontend salva token in localStorage
```

### Caricamento App (dopo refresh)
```
1. Frontend legge token da localStorage
2. Frontend → GET /api/auth/me (con token)
3. Server valida token e ritorna user/company
4. Frontend → GET /api/workplaces (carica dati)
5. Frontend → GET /api/roles
6. Frontend → GET /api/inventory
```

### Salvataggio Dati
```
1. User crea luogo di lavoro
2. Frontend → POST /api/workplaces (con token)
3. Server salva in database
4. Server ritorna record con ID
5. Frontend aggiorna state locale
```

---

## 🐛 Troubleshooting Comune

### "Cannot connect to database"
```bash
# Verifica PostgreSQL
docker ps | grep postgres
docker logs <container-id>

# Testa connessione
psql -h localhost -U postgres -d movarisch
```

### "Invalid token"
```bash
# Cancella token e riprova
localStorage.clear()  # Da console browser
```

### "Port already in use"
```bash
# Trova processo
sudo lsof -i :3001
# Cambia porta in docker-compose.vps.yml
```

### I dati non appaiono
```bash
# Controlla che le API funzionino
curl http://localhost:3001/api/workplaces \
  -H "Authorization: Bearer <token>"

# Controlla console browser (F12)
# Verifica network tab per errori API
```

---

## 📝 Prossimi Passi

Dopo aver completato il deploy:

1. **Backup**
   - Configura backup automatici PostgreSQL
   - Vedi: [DEPLOY_VPS.md - Sezione Backup](DEPLOY_VPS.md#backup-database)

2. **HTTPS**
   - Configura Nginx reverse proxy
   - Installa certificato SSL con Let's Encrypt
   - Vedi: [DEPLOY_VPS.md - Nginx](DEPLOY_VPS.md#configurazione-nginx-reverse-proxy)

3. **Monitoraggio**
   - Configura log rotation
   - Monitora uso risorse

4. **Ottimizzazioni** (opzionale)
   - Aggiungi indici database per performance
   - Implementa caching (Redis)
   - Rate limiting API

---

## 📚 Documentazione

- **[DEPLOY_VPS.md](DEPLOY_VPS.md)** - Guida completa deploy
- **[server/.env.example](server/.env.example)** - Configurazione backend
- **[docker-compose.vps.yml](docker-compose.vps.yml)** - Docker config

---

## ✨ Vantaggi della Migrazione

### Per gli Utenti
- ✅ Dati sempre disponibili da qualsiasi dispositivo
- ✅ Nessuna perdita dati se si cambia browser
- ✅ Backup automatici sul server
- ✅ Collaborazione multi-utente possibile

### Per il Deploy
- ✅ Scalabilità orizzontale
- ✅ Database professionale (PostgreSQL)
- ✅ Separazione frontend/backend
- ✅ Compatibile con Dokploy e altri orchestrator

### Per la Sicurezza
- ✅ Autenticazione JWT robusta
- ✅ Isolamento dati per azienda
- ✅ Password hash con bcrypt
- ✅ Validazione token server-side

---

**Migrazione completata con successo!** 🎉

Per deploy immediato, segui: **[DEPLOY_VPS.md](DEPLOY_VPS.md)**
