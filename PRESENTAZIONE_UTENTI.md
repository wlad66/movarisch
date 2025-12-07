# MoVaRisCh 2025
## Guida Utente - Sistema di Valutazione del Rischio Chimico

---

## 🎯 Cos'è MoVaRisCh?

**MoVaRisCh** (Modello di Valutazione del Rischio Chimico) è un algoritmo scientifico per la valutazione del rischio chimico sviluppato per garantire la sicurezza dei lavoratori esposti a sostanze pericolose.

**Safety Pro Suite** ha realizzato questa applicazione web professionale integrando l'algoritmo MoVaRisCh con un sistema avanzato di **selezione ottimale dei DPI** (Dispositivi di Protezione Individuale). L'applicazione analizza tutti gli agenti chimici presenti contemporaneamente nella lavorazione e raccomanda i guanti protettivi più adatti per l'intero scenario di esposizione.

### Cosa fa l'applicazione:

- ✅ **Valuta il rischio** di esposizione a prodotti chimici (algoritmo MoVaRisCh)
- ✅ **Ottimizza la scelta dei guanti** considerando TUTTI gli agenti chimici utilizzati
- ✅ **Raccomanda il DPI migliore** per scenari multi-prodotto
- ✅ **Archivia le configurazioni** per tracciabilità completa
- ✅ **Garantisce la sicurezza** dei lavoratori in azienda

**200 prodotti chimici** nel database | **10 tipi di guanti** | **Raccomandazioni immediate**

---

## 🚀 Come Iniziare

### 1. Accesso all'Applicazione

1. Apri il browser (Chrome, Firefox, Edge)
2. Vai su `http://localhost:5173`
3. **Registrati** con:
   - Nome azienda
   - Email
   - Password
4. **Accedi** con le tue credenziali

### 2. Configurazione Iniziale

Dopo il login, configura:
- **Luoghi di lavoro** (es. Laboratorio, Verniciatura, Magazzino)
- **Mansioni** (es. Tecnico, Operatore, Addetto)

Questi dati saranno usati per l'archiviazione delle valutazioni.

---

## 📊 Funzionalità Principali

### 🧪 Calcolatore di Rischio Chimico

**Quando usarlo**: Per valutare il rischio di un singolo prodotto chimico.

**Come funziona**:

1. Clicca su **"Calcolatore"** nel menu
2. Inserisci:
   - **Nome del prodotto chimico**
   - **Numero CAS** (codice identificativo)
3. Seleziona le **frasi H** (indicazioni di pericolo)
4. Imposta i parametri di esposizione:
   - Quantità utilizzata
   - Frequenza d'uso
   - Durata esposizione
   - Ventilazione
5. Visualizza il **livello di rischio** (1-5)

**Risultato**: Il prodotto viene automaticamente aggiunto al tuo inventario.

---

### 🛡️ Ottimizzatore DPI Multi-Prodotto

**Quando usarlo**: Per trovare i guanti migliori quando lavori con più prodotti chimici contemporaneamente.

**Come funziona**:

#### Passo 1: Seleziona i Prodotti Chimici
- Nella colonna di sinistra (**Inventario Chimico**)
- Clicca sui prodotti che usi nella tua lavorazione
- Puoi selezionare anche 10+ prodotti

#### Passo 2: Analizza la Matrice
- Al centro vedrai una **tabella colorata**
- Ogni riga = un tipo di guanto
- Ogni colonna = un prodotto chimico
- I colori indicano la protezione:

| Colore | Significato | Tempo di Permeazione |
|--------|-------------|---------------------|
| 🟢 Verde | Eccellente | ≥ 8 ore |
| 🟡 Giallo | Buono | 4-8 ore |
| 🟠 Arancione | Accettabile | 1-4 ore |
| 🔴 Rosso | Scarso | 10-60 minuti |
| ⚫ Grigio | Non adatto | < 10 minuti |

#### Passo 3: Guanto Consigliato
- In alto vedrai il **DPI Consigliato**
- È il guanto che offre la **migliore protezione** per TUTTI i prodotti selezionati
- Mostra:
  - Materiale (es. Nitrile, Butyl)
  - Spessore
  - Modello Ansell

#### Passo 4: Selezione Guanti
- Spunta i guanti che vuoi utilizzare
- Puoi selezionarne più di uno

#### Passo 5: Archivia la Configurazione
1. Clicca **"Archivia Selezione DPI"**
2. Scegli il **Luogo di Lavoro** (lista numerata)
3. Scegli la **Mansione** (lista numerata)
4. Conferma

**Risultato**: La configurazione viene salvata nell'archivio!

---

### 📁 Archivio Valutazioni

**Quando usarlo**: Per consultare le configurazioni salvate.

**Cosa contiene ogni report**:
- 📅 **Data e ora** della valutazione
- 🏢 **Azienda**
- 📍 **Luogo di lavoro**
- 👷 **Mansione**
- 🧪 **Prodotti chimici** valutati (con CAS)
- 🧤 **Guanti selezionati** (materiale, spessore, modello)

**Azioni disponibili**:
- Visualizza tutti i report
- Elimina report obsoleti

---

## 💡 Esempi Pratici

### Esempio 1: Laboratorio Chimico

**Scenario**: Tecnico di laboratorio che lavora con solventi.

**Prodotti utilizzati**:
- Acetone
- Metanolo
- Toluene

**Procedura**:
1. Vai su **Ottimizzatore DPI**
2. Seleziona Acetone, Metanolo, Toluene dall'inventario
3. Guarda la matrice: il sistema consiglia **Butyl (0.65 mm)**
4. Seleziona il guanto consigliato
5. Archivia con:
   - Luogo: "Laboratorio Chimico"
   - Mansione: "Tecnico di Laboratorio"

**Risultato**: Configurazione salvata e consultabile in Archivio.

---

### Esempio 2: Reparto Verniciatura

**Scenario**: Operatore che applica vernici e diluenti.

**Prodotti utilizzati**:
- Xilene
- Acetato di etile
- MEK (Metiletilchetone)

**Procedura**:
1. Vai su **Ottimizzatore DPI**
2. Seleziona i tre prodotti
3. Sistema consiglia **Nitrile (0.38 mm)**
4. Seleziona il guanto
5. Archivia con:
   - Luogo: "Verniciatura"
   - Mansione: "Operatore Macchine"

---

## 🎨 Capire i Colori della Matrice

### 🟢 Verde - Protezione Eccellente
- **Tempo di permeazione**: ≥ 8 ore
- **Significato**: Il guanto protegge per l'intera giornata lavorativa
- **Azione**: Scelta ideale

### 🟡 Giallo - Protezione Buona
- **Tempo di permeazione**: 4-8 ore
- **Significato**: Protezione adeguata per la maggior parte delle lavorazioni
- **Azione**: Accettabile, considera la durata dell'esposizione

### 🟠 Arancione - Protezione Limitata
- **Tempo di permeazione**: 1-4 ore
- **Significato**: Protezione per esposizioni brevi
- **Azione**: Sostituire i guanti frequentemente

### 🔴 Rosso - Protezione Scarsa
- **Tempo di permeazione**: 10-60 minuti
- **Significato**: Protezione minima
- **Azione**: Evitare, scegliere altro materiale

### ⚫ Grigio - Non Adatto
- **Tempo di permeazione**: < 10 minuti o dato non disponibile
- **Significato**: Nessuna protezione
- **Azione**: NON utilizzare questo guanto

---

## ❓ Domande Frequenti (FAQ)

### Come aggiungo un nuovo prodotto chimico?
1. Vai su **Calcolatore**
2. Inserisci nome e CAS
3. Completa la valutazione
4. Il prodotto viene aggiunto automaticamente all'inventario

### Posso selezionare più guanti?
Sì! Puoi selezionare tutti i guanti che vuoi archiviare. Il sistema ti mostra comunque il guanto consigliato.

### Come trovo il numero CAS di un prodotto?
Il numero CAS è riportato sulla **Scheda di Sicurezza (SDS)** del prodotto, sezione 1.

### Cosa significa "DPI Consigliato"?
È il guanto che offre la **migliore protezione** per TUTTI i prodotti chimici che hai selezionato contemporaneamente.

### Posso modificare un report archiviato?
No, i report sono immutabili per garantire la tracciabilità. Puoi eliminare e crearne uno nuovo.

### I dati sono salvati?
Sì, tutti i dati sono salvati nel browser. Usa sempre lo stesso browser e computer per accedere ai tuoi dati.

---

## ⚠️ Avvertenze Importanti

### Sicurezza
- ⚠️ Questa applicazione è uno **strumento di supporto**
- ⚠️ Consulta sempre le **Schede di Sicurezza (SDS)**
- ⚠️ Rispetta le **normative aziendali** sulla sicurezza
- ⚠️ In caso di dubbi, contatta il **Responsabile della Sicurezza**

### Limitazioni
- I dati si basano sulla **Guida Ansell** (aggiornata 2025)
- I tempi di permeazione sono **indicativi**
- Condizioni reali possono variare (temperatura, concentrazione, ecc.)
- Verifica sempre la compatibilità con il fornitore

### Buone Pratiche
- ✅ Aggiorna regolarmente l'inventario chimico
- ✅ Archivia tutte le configurazioni DPI
- ✅ Rivedi periodicamente le valutazioni
- ✅ Sostituisci i guanti secondo le indicazioni del produttore

---

## 📞 Supporto

Per assistenza tecnica o domande sull'utilizzo:
- Contatta il **Responsabile della Sicurezza** aziendale
- Consulta la documentazione tecnica
- Verifica gli aggiornamenti dell'applicazione

---

## 🎓 Formazione

### Prerequisiti
- Conoscenza base dei prodotti chimici utilizzati
- Accesso alle Schede di Sicurezza (SDS)
- Formazione sulla sicurezza chimica

### Tempo di Apprendimento
- **Calcolatore**: 10 minuti
- **Ottimizzatore**: 20 minuti
- **Archivio**: 5 minuti

**Totale**: ~35 minuti per padroneggiare l'applicazione

---

**Versione Guida**: 1.0  
**Data**: Dicembre 2025  
**Applicazione**: MoVaRisCh 2025

---

## ✅ Checklist Rapida

Prima di iniziare una valutazione:
- [ ] Ho le Schede di Sicurezza dei prodotti?
- [ ] Conosco i numeri CAS?
- [ ] Ho configurato luoghi di lavoro e mansioni?

Durante la valutazione:
- [ ] Ho selezionato tutti i prodotti utilizzati?
- [ ] Ho verificato i colori della matrice?
- [ ] Ho letto il guanto consigliato?

Dopo la valutazione:
- [ ] Ho archiviato la configurazione?
- [ ] Ho indicato luogo e mansione corretti?
- [ ] Ho verificato il report in Archivio?

**Buon lavoro in sicurezza!** 🛡️
