# Changelog MoVaRisCh

## [2.1.0] - 2025-12-07

### ✨ Nuove Features

#### Tipologia d'Uso in Step 3
- Aggiunto parametro "Tipologia d'Uso" per esposizione cutanea
- 4 opzioni: Sistema Chiuso, Inclusione in Matrice, Uso Controllato, Uso Dispersivo
- Calcolo E_cute aggiornato con matrice corretta

#### Tabella Classificazione Rischio
- Visualizzazione interattiva dei 5 livelli di rischio
- Evidenziazione automatica del livello corrente
- Colori codificati: Verde, Giallo, Arancione, Rosso, Viola
- Descrizioni complete secondo D.Lgs 81/08

#### Export Word Completo
- Tutti i parametri inalatori (7 parametri)
- Tutti i parametri cutanei (3 parametri inclusa Tipologia d'Uso)
- Tutti i valori di rischio calcolati (R_inal, R_cute, R_cum)
- Tabella classificazione rischio con formattazione professionale
- Luogo di Lavoro e Mansione inclusi nell'intestazione

#### Validazione Form
- Luogo di Lavoro e Mansione obbligatori prima di selezionare agente
- Messaggio di avviso chiaro per l'utente
- Dropdown disabilitato fino a compilazione campi obbligatori

### 🔧 Miglioramenti

#### UI/UX
- Testo non wrappa nelle tabelle di classificazione rischio
- Colori coerenti tra UI e export Word
- Font size ottimizzato per descrizioni in export Word

#### Documentazione
- Eliminati 17 file .md obsoleti
- README.md semplificato e aggiornato
- Creata guida deploy completa (DEPLOY_GUIDE.md)
- Script deploy automatico (deploy.sh)

### 📝 File Modificati

**Frontend:**
- `App.jsx` - Logica principale, Step 3, Step 4, validazione
- `src/utils/exportToWord.js` - Export completo con tabella classificazione

**Documentazione:**
- `README.md` - Riferimenti aggiornati
- `DEPLOY_GUIDE.md` - Nuova guida deploy
- `deploy.sh` - Script deploy automatico
- `CHANGELOG.md` - Questo file

**Rimossi:**
- 17 file .md obsoleti (DEPLOY_VPS.md, DOCUMENTAZIONE.md, etc.)

### 🐛 Bug Fix

- Fix: E_cute ora usa parametro separato "Tipologia d'Uso" invece di riusare quello inalatorio
- Fix: Export Word ora include tutti i campi calcolati
- Fix: Luogo di Lavoro e Mansione ora sempre presenti nell'export

### 🔒 Sicurezza

- Confermata protezione `.env` in `.gitignore`
- Verificata non inclusione credenziali nel repository

---

## [2.0.0] - 2025-01-15

### Migrazione Server

- ✅ Migrato da localStorage a database PostgreSQL
- ✅ API RESTful complete
- ✅ Multi-utente con isolamento dati
- ✅ Deploy su VPS con Docker
- ✅ Autenticazione JWT robusta

---

## [1.0.0] - 2024-12-01

### Release Iniziale

- Calcolatore rischio chimico (5 matrici MoVaRisCh)
- Ottimizzatore DPI multi-prodotto
- Database 4.050 test permeazione
- Export DOCX report
- Gestione inventario sostanze chimiche

---

**Formato:** [MAJOR.MINOR.PATCH]
- MAJOR: Modifiche incompatibili
- MINOR: Nuove funzionalità compatibili
- PATCH: Bug fix compatibili
