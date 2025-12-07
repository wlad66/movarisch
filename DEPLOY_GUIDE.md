# 🚀 Guida Deploy MoVaRisCh

## 📦 Modifiche Recenti (v2.1.0)

### Nuove Features
✅ **Tipologia d'Uso** - Parametro aggiunto in Step 3 (Esposizione Cutanea)
✅ **Tabella Classificazione Rischio** - Visualizzazione con 5 livelli secondo D.Lgs 81/08
✅ **Export Word Completo** - Tutti i parametri e valori calcolati inclusi
✅ **Validazione Obbligatoria** - Luogo di Lavoro e Mansione richiesti
✅ **Documentazione Pulita** - Rimossi 17 file .md obsoleti

### File Modificati
- `App.jsx` - Logica principale
- `src/utils/exportToWord.js` - Export completo
- `README.md` - Documentazione aggiornata

---

## 🔧 Procedura Deploy Completa

### PASSO 1: Verifica Pre-Commit

```bash
# Verifica che .env sia in gitignore
cd /c/PROGRAMMAZIONE/movarisch
git status

# Output atteso: server/.env NON deve apparire nella lista
```

✅ **CRITICO**: Se `server/.env` appare nella lista, FERMATI e non committare!

---

### PASSO 2: Commit delle Modifiche

```bash
# Aggiungi tutti i file modificati (escluso .env automaticamente)
git add .

# Verifica cosa stai per committare
git status

# Crea il commit
git commit -m "v2.1.0 - Export completo, Tipologia d'Uso, Tabella Classificazione"

# Opzionale: visualizza i file committati
git show --name-only
```

---

### PASSO 3: Push al Repository

```bash
# Push su GitHub/GitLab
git push origin main

# Verifica il push
git log --oneline -5
```

**⚠️ IMPORTANTE**: Verifica su GitHub che `server/.env` NON sia presente!

---

### PASSO 4: Deploy su VPS

#### Opzione A - Deploy Manuale (SSH)

```bash
# 1. Connettiti al VPS
ssh user@your-vps-ip

# 2. Naviga nella directory del progetto
cd /path/to/movarisch

# 3. Backup (opzionale ma consigliato)
docker exec postgres pg_dump -U movarisch_user movarisch > backup_$(date +%Y%m%d_%H%M%S).sql

# 4. Pull delle modifiche
git pull origin main

# 5. Rebuild completo dei container
docker-compose -f docker-compose.vps.yml down
docker-compose -f docker-compose.vps.yml up -d --build

# 6. Monitora i logs
docker-compose -f docker-compose.vps.yml logs -f
```

#### Opzione B - Deploy con Dokploy

```bash
# Nel panel Dokploy:
1. Vai su Projects → movarisch
2. Click su "Git" → "Pull Latest Changes"
3. Click su "Deploy" → "Rebuild & Deploy"
4. Monitora i logs nella sezione "Logs"
```

---

### PASSO 5: Verifica Post-Deploy

```bash
# Controlla i container in esecuzione
docker ps

# Verifica logs backend
docker logs movarisch-backend --tail 50

# Verifica logs frontend
docker logs movarisch-frontend --tail 50

# Testa l'applicazione
curl http://your-vps-ip:8005
```

---

## ✅ Checklist Finale

Verifica che tutto funzioni:

- [ ] **Frontend** - Apri http://your-vps-ip:8005
- [ ] **Login** - Effettua login con account esistente
- [ ] **Step 3** - Verifica presenza dropdown "Tipologia d'Uso"
- [ ] **Step 4** - Verifica presenza tabella classificazione rischio
- [ ] **Export Word** - Scarica documento e verifica contenuto completo
- [ ] **Validazione** - Verifica che Luogo e Mansione siano obbligatori

---

## 🔍 Troubleshooting

### Problema: Container non si avvia

```bash
# Controlla logs dettagliati
docker-compose -f docker-compose.vps.yml logs

# Rebuild forzato
docker-compose -f docker-compose.vps.yml build --no-cache
docker-compose -f docker-compose.vps.yml up -d
```

### Problema: Export Word non funziona

```bash
# Verifica che docx sia installato
docker exec movarisch-frontend npm list docx

# Se mancante, rebuild frontend
docker-compose -f docker-compose.vps.yml up -d --build movarisch-frontend
```

### Problema: Modifiche non visibili

```bash
# Clear cache browser (Ctrl+Shift+R)
# Oppure rebuild completo
docker-compose -f docker-compose.vps.yml down -v
docker-compose -f docker-compose.vps.yml up -d --build
```

---

## 🔐 Sicurezza

### PRIMA del deploy verifica:

```bash
# Verifica che .env non sia nel repository
git ls-files | grep .env

# Output atteso: NESSUN risultato

# Verifica .gitignore
cat .gitignore | grep .env

# Output atteso:
# .env
# server/.env
```

### Se .env è stato committato per errore:

```bash
# RIMUOVI dal repository (ma mantieni in locale)
git rm --cached server/.env
git commit -m "Remove .env from repository"
git push origin main

# IMPORTANTE: Cambia TUTTE le credenziali in server/.env!
```

---

## 📊 Monitoring

Dopo il deploy, monitora per 5-10 minuti:

```bash
# Logs in tempo reale
docker-compose -f docker-compose.vps.yml logs -f

# Uso risorse
docker stats

# Connessioni database
docker exec postgres psql -U movarisch_user -d movarisch -c "SELECT count(*) FROM pg_stat_activity;"
```

---

## 🎯 Rollback (se necessario)

Se qualcosa va storto:

```bash
# 1. Torna al commit precedente
git log --oneline -5  # Trova hash commit precedente
git reset --hard <hash-commit-precedente>
git push --force origin main

# 2. Sul VPS
cd /path/to/movarisch
git pull origin main
docker-compose -f docker-compose.vps.yml down
docker-compose -f docker-compose.vps.yml up -d --build

# 3. Restore database (se necessario)
cat backup_YYYYMMDD_HHMMSS.sql | docker exec -i postgres psql -U movarisch_user movarisch
```

---

## 📞 Supporto

In caso di problemi:
1. Controlla logs: `docker-compose logs`
2. Verifica configurazione: `cat server/.env`
3. Consulta README.md - Sezione Troubleshooting

---

**Versione Deploy Guide:** 2.1.0
**Data:** 2025-12-07
**Status:** ✅ Ready for Production
