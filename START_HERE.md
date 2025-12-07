# 🎯 START HERE - MoVaRisCh Deploy Guide

**Benvenuto!** Questa è la tua guida di partenza per deployare MoVaRisCh su VPS.

---

## 📚 Documentazione Disponibile

### 🚀 **Per Deploy Immediato**

1. **[DEPLOY_CHECKLIST.md](DEPLOY_CHECKLIST.md)** ⭐️ **INIZIA QUI**
   - Checklist passo-passo con checkbox
   - Non dimentichi nessun passaggio
   - Sia per Dokploy che deploy manuale

2. **[DEPLOY_QUICK_START.md](DEPLOY_QUICK_START.md)**
   - Guida rapida con comandi pronti
   - Troubleshooting integrato
   - Setup HTTPS, backup, monitoring

3. **[DEPLOY_VPS.md](DEPLOY_VPS.md)**
   - Guida completa e dettagliata
   - Tutte le opzioni disponibili
   - Configurazioni avanzate

### 📖 **Per Capire le Modifiche**

4. **[MIGRAZIONE_VPS_SUMMARY.md](MIGRAZIONE_VPS_SUMMARY.md)**
   - Cosa è cambiato (localStorage → PostgreSQL)
   - Nuove API endpoints
   - Schema database

5. **[REFACTORING_COMPLETED.md](REFACTORING_COMPLETED.md)**
   - Backend refactoring completato (423 → 45 righe)
   - Nuova architettura MVC
   - Vantaggi ottenuti

6. **[REFACTORING_EXAMPLE.md](REFACTORING_EXAMPLE.md)**
   - Esempi concreti prima/dopo
   - Pattern applicati
   - Come è stato fatto

7. **[REFACTORING_GUIDE.md](REFACTORING_GUIDE.md)**
   - Best practices codice modulare
   - Quando e come refactorare
   - Strutture consigliate

### 📘 **Riferimento Generale**

8. **[README.md](README.md)**
   - Overview progetto
   - Architettura
   - Comandi utili

---

## ⚡ Quick Start - 3 Passi

### 1️⃣ Genera JWT Secret

```bash
# Windows PowerShell
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))

# Linux/Mac
openssl rand -base64 32
```

**Annota il risultato** (esempio: `vK8x2rZ9mN3pQ7wL5tY4uR6sA1cF8eH9iJ0k`)

### 2️⃣ Push su Git

```bash
git add .
git commit -m "Production ready with refactored backend"
git push origin main
```

### 3️⃣ Scegli il Metodo

**Opzione A - Dokploy (Consigliato, più facile):**
- Vai su [DEPLOY_CHECKLIST.md - Opzione A](DEPLOY_CHECKLIST.md#opzione-a-deploy-con-dokploy-più-facile)

**Opzione B - Manuale (Più controllo):**
- Vai su [DEPLOY_CHECKLIST.md - Opzione B](DEPLOY_CHECKLIST.md#opzione-b-deploy-manuale-più-controllo)

---

## 📋 Cosa Ti Serve

### Pre-requisiti VPS

- [ ] Docker installato
- [ ] Docker Compose installato (se deploy manuale)
- [ ] PostgreSQL disponibile
- [ ] Porte libere: 3001 (backend), 8005 (frontend)

### Credenziali da Preparare

- [ ] **JWT_SECRET** (generato con comando sopra)
- [ ] **PostgreSQL credentials:**
  - DB_HOST
  - DB_NAME (default: `movarisch`)
  - DB_USER (default: `movarisch_user`)
  - DB_PASSWORD

### Repository Git

- [ ] Codice pushato su Git (GitHub, GitLab, etc.)
- [ ] URL repository disponibile

---

## 🎯 Flusso Consigliato

```
1. Leggi START_HERE.md (questo file) ← SEI QUI
   ↓
2. Vai su DEPLOY_CHECKLIST.md
   ↓
3. Segui checkbox passo-passo
   ↓
4. Se hai dubbi, consulta DEPLOY_QUICK_START.md
   ↓
5. Deploy completato! 🎉
```

---

## 🏗️ Architettura Deployata

Dopo il deploy avrai:

```
VPS
├── PostgreSQL Database
│   └── movarisch (database)
│       ├── users
│       ├── workplaces
│       ├── roles
│       ├── inventory
│       └── reports
│
├── Backend Container (Node.js + Express)
│   ├── Porta: 3001
│   ├── API: /api/auth, /api/workplaces, etc.
│   └── Connesso a PostgreSQL
│
└── Frontend Container (React + Nginx)
    ├── Porta: 8005
    ├── Build Vite ottimizzato
    └── Comunica con Backend via API
```

---

## ✅ Checklist Minima Prima di Iniziare

- [ ] Ho letto questo file (START_HERE.md)
- [ ] Ho generato JWT_SECRET
- [ ] Ho access alla VPS (SSH)
- [ ] Ho PostgreSQL sulla VPS o posso crearlo
- [ ] Ho repository Git con codice pushato
- [ ] Sono pronto per seguire [DEPLOY_CHECKLIST.md](DEPLOY_CHECKLIST.md)

---

## 🚀 Inizia Ora!

Tutto pronto? Vai su:

**👉 [DEPLOY_CHECKLIST.md](DEPLOY_CHECKLIST.md)**

Segui le checkbox passo-passo e in 20-30 minuti la tua app sarà live!

---

## 📊 File Modificati per VPS (Riepilogo)

Questi file sono stati modificati/creati per il deploy:

### Backend
- ✅ `server/server.js` - Refactored (423 → 45 righe)
- ✅ `server/config/database.js` - PostgreSQL setup
- ✅ `server/middleware/auth.js` - JWT middleware
- ✅ `server/routes/*.js` - 5 routes files
- ✅ `server/controllers/*.js` - 5 controllers
- ✅ `server/models/*.js` - 5 models
- ✅ `server/.env.example` - Template configurazione
- ✅ `server/package.json` - Aggiunte dipendenze `pg`, `dotenv`

### Frontend
- ✅ `src/context/DataContext.jsx` - Usa API invece di localStorage
- ✅ `src/context/AuthContext.jsx` - Solo token in localStorage
- ✅ Nessun altro cambio frontend necessario!

### Infrastructure
- ✅ `docker-compose.vps.yml` - Config con porte custom
- ✅ `.gitignore` - Protegge .env e file sensibili

### Documentazione
- ✅ Questo file (START_HERE.md)
- ✅ DEPLOY_CHECKLIST.md
- ✅ DEPLOY_QUICK_START.md
- ✅ DEPLOY_VPS.md
- ✅ MIGRAZIONE_VPS_SUMMARY.md
- ✅ REFACTORING_COMPLETED.md
- ✅ REFACTORING_EXAMPLE.md
- ✅ REFACTORING_GUIDE.md
- ✅ README.md (aggiornato)

---

## 🔧 Se Qualcosa Va Storto

### Problema: Backend non si avvia

1. Controlla logs:
   ```bash
   docker logs movarisch-backend
   ```

2. Verifica `.env`:
   - DB_HOST corretto?
   - DB_PASSWORD corretta?
   - JWT_SECRET impostato?

3. Testa connessione PostgreSQL:
   ```bash
   psql -U movarisch_user -h localhost -d movarisch
   ```

### Problema: Frontend mostra errori

1. Controlla che backend risponda:
   ```bash
   curl http://localhost:3001/health
   ```

2. Controlla logs frontend:
   ```bash
   docker logs movarisch-app
   ```

### Problema: Porte occupate

1. Trova chi usa la porta:
   ```bash
   sudo lsof -i :3001
   ```

2. Opzioni:
   - Stop il processo
   - Cambia porta in `docker-compose.vps.yml`

**Troubleshooting completo:** [DEPLOY_QUICK_START.md - Troubleshooting](DEPLOY_QUICK_START.md#-troubleshooting)

---

## 💡 Tips

### Dokploy vs Manuale

**Scegli Dokploy se:**
- ✅ Vuoi setup più rapido
- ✅ Hai già Dokploy sulla VPS
- ✅ Preferisci UI grafica
- ✅ Vuoi gestione automatica containers

**Scegli Manuale se:**
- ✅ Vuoi controllo totale
- ✅ Non hai Dokploy
- ✅ Preferisci command line
- ✅ Vuoi capire ogni passaggio

### Sviluppo vs Produzione

**Sviluppo (locale):**
- SQLite va bene
- Port 5173 (Vite)
- No HTTPS necessario

**Produzione (VPS):**
- ✅ PostgreSQL (scalabile)
- ✅ Porte custom (3001, 8005)
- ✅ HTTPS consigliato
- ✅ Backup automatici
- ✅ Firewall configurato

---

## 🎓 Ordine di Lettura Consigliato

### Per Deploy Rapido
1. START_HERE.md (questo file)
2. DEPLOY_CHECKLIST.md ⭐

### Per Deploy Dettagliato
1. START_HERE.md
2. DEPLOY_QUICK_START.md
3. DEPLOY_CHECKLIST.md (come riferimento)

### Per Capire Tutto
1. START_HERE.md
2. MIGRAZIONE_VPS_SUMMARY.md (cosa è cambiato)
3. REFACTORING_COMPLETED.md (come è organizzato)
4. DEPLOY_VPS.md (opzioni deploy)
5. DEPLOY_CHECKLIST.md (esecuzione)

---

## ⏰ Tempo Stimato

| Attività | Tempo |
|----------|-------|
| **Lettura START_HERE** | 5 min |
| **Deploy con Dokploy** | 20-30 min |
| **Deploy Manuale** | 30-45 min |
| **Test completo** | 10 min |
| **Setup HTTPS (opzionale)** | 15 min |
| **Setup Backup (opzionale)** | 10 min |

**Totale minimo:** ~35 minuti
**Totale con tutto:** ~90 minuti

---

## 🎉 Risultato Finale

Dopo il deploy avrai:

✅ App MoVaRisCh live su internet
✅ Backend API scalabile (PostgreSQL)
✅ Frontend ottimizzato (Vite build)
✅ Dati persistenti su database server
✅ Multi-utente con isolamento dati
✅ Architettura professionale MVC
✅ Pronto per produzione

**Accesso:**
- Frontend: `http://<tuo-ip>:8005`
- Backend API: `http://<tuo-ip>:3001`
- Health: `http://<tuo-ip>:3001/health`

---

## 📞 Hai Tutto Chiaro?

✅ **SI** → Vai su [DEPLOY_CHECKLIST.md](DEPLOY_CHECKLIST.md) e inizia!

❓ **NO** → Leggi [DEPLOY_QUICK_START.md](DEPLOY_QUICK_START.md) per più dettagli

🤔 **Dubbi tecnici** → Consulta [DEPLOY_VPS.md](DEPLOY_VPS.md) per approfondimenti

---

**Pronto per il deploy? Let's go! 🚀**

👉 **[DEPLOY_CHECKLIST.md](DEPLOY_CHECKLIST.md)**
