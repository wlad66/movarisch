# Informativa sulla Privacy - MoVaRisCh

**Versione:** 1.0
**Data di entrata in vigore:** 7 Dicembre 2025
**Ultimo aggiornamento:** 7 Dicembre 2025

---

## Introduzione

La presente Informativa sulla Privacy descrive come **Safety Pro Suite** (di seguito "noi", "nostro") raccoglie, utilizza, conserva e protegge i dati personali degli utenti dell'applicazione web **MoVaRisCh** (di seguito "l'Applicazione").

Questa informativa è redatta ai sensi del **Regolamento UE 2016/679** (GDPR) e del **D.Lgs. 196/2003** come modificato dal **D.Lgs. 101/2018** (Codice Privacy italiano).

---

## 1. Titolare del Trattamento

**Titolare del Trattamento:**
TOKEM LLC (Safety Pro Suite)
5500 BENTGRASS DR UNIT 301
34235 SARASOTA (FL) - U.S.A.
Email: info@safetyprosuite.com
Website: www.safetyprosuite.com
FEI/EIN: 84-1930240

**Responsabile della Protezione dei Dati (DPO):**
Email: privacy@safetyprosuite.com

---

## 2. Dati Personali Raccolti

### 2.1 Dati Forniti Direttamente dall'Utente

**Durante la Registrazione:**
- Indirizzo email (obbligatorio)
- Password (criptata con bcrypt)
- Nome azienda/ragione sociale
- Eventuale P.IVA/Codice Fiscale

**Durante l'Utilizzo:**
- Luoghi di lavoro
- Mansioni/ruoli lavoratori
- Nomi e codici CAS di sostanze chimiche
- Parametri di valutazione del rischio
- Report e valutazioni archiviate

### 2.2 Dati Raccolti Automaticamente

**Dati Tecnici:**
- Indirizzo IP
- Tipo di browser e dispositivo
- Data e ora di accesso
- Pagine visitate
- Token JWT per autenticazione (durata 24h)

**Dati di Utilizzo:**
- Numero di valutazioni effettuate
- Funzionalità utilizzate
- Report generati

### 2.3 Dati NON Raccolti

L'Applicazione **NON raccoglie**:
- Dati sensibili relativi alla salute dei lavoratori
- Dati biometrici
- Dati di pagamento (se il servizio è gratuito)
- Cookie di profilazione o tracciamento pubblicitario

---

## 3. Base Giuridica e Finalità del Trattamento

### 3.1 Esecuzione del Contratto (Art. 6.1.b GDPR)

**Finalità:**
- Fornire l'accesso all'Applicazione
- Gestire l'account utente
- Consentire le funzionalità di valutazione del rischio
- Generare ed esportare report

**Base giuridica:** Esecuzione del contratto/servizio richiesto

### 3.2 Interesse Legittimo (Art. 6.1.f GDPR)

**Finalità:**
- Migliorare l'Applicazione
- Garantire la sicurezza informatica
- Prevenire frodi e abusi
- Analisi statistiche aggregate

**Base giuridica:** Legittimo interesse del Titolare

### 3.3 Consenso (Art. 6.1.a GDPR)

**Finalità (se applicabili):**
- Invio di newsletter informative
- Comunicazioni commerciali
- Miglioramenti futuri del servizio

**Base giuridica:** Consenso esplicito dell'utente (revocabile in qualsiasi momento)

### 3.4 Obblighi Legali (Art. 6.1.c GDPR)

**Finalità:**
- Adempiere a obblighi fiscali
- Rispondere a richieste dell'autorità giudiziaria
- Conservare dati contabili

**Base giuridica:** Obbligo di legge

---

## 4. Modalità di Trattamento

### 4.1 Sicurezza dei Dati

I dati personali sono trattati con misure di sicurezza tecniche e organizzative adeguate:

**Misure Tecniche:**
- Criptazione password con **bcrypt** (salt rounds: 10)
- Autenticazione tramite **JWT** (JSON Web Token) con scadenza 24h
- Connessione **HTTPS** (TLS/SSL) per la trasmissione dati
- Database **PostgreSQL** con accesso limitato
- **Parametrized queries** per prevenire SQL injection
- **Firewall** e protezione server

**Misure Organizzative:**
- Accesso ai dati limitato al personale autorizzato
- Formazione del personale sulla protezione dati
- Procedure di backup regolari
- Policy di password sicure

### 4.2 Isolamento dei Dati

Ogni utente/azienda ha accesso **esclusivamente ai propri dati**:
- Isolamento tramite `user_id` nel database
- **ON DELETE CASCADE** per integrità referenziale
- Nessun accesso cross-utente possibile

---

## 5. Conservazione dei Dati

### 5.1 Periodo di Conservazione

| Tipo di Dato | Durata Conservazione |
|--------------|---------------------|
| Dati account attivo | Fino a cancellazione account |
| Dati account cancellato | 30 giorni (poi eliminazione completa) |
| Log di accesso | 12 mesi |
| Valutazioni archiviate | Fino a cancellazione da parte utente |
| Dati fiscali/contabili | 10 anni (obbligo di legge) |

### 5.2 Cancellazione

L'utente può richiedere la cancellazione completa dei propri dati in qualsiasi momento tramite:
- Eliminazione account dall'interno dell'Applicazione
- Richiesta email a [email da specificare]

---

## 6. Condivisione dei Dati

### 6.1 Destinatari dei Dati

I dati personali **NON sono venduti o ceduti a terzi** per scopi commerciali.

I dati possono essere condivisi solo con:

**Fornitori di Servizi Tecnici:**
- Hosting provider (server VPS)
- Servizi di database PostgreSQL
- Servizi di backup

Questi fornitori agiscono come **Responsabili del Trattamento** e sono vincolati da accordi di riservatezza.

**Autorità Competenti:**
- Solo su richiesta legale (ordine del tribunale, autorità fiscali, ecc.)

### 6.2 Trasferimento Dati Extra-UE

I dati sono conservati su server situati in **[specificare: Italia/UE]**.

Se necessario il trasferimento extra-UE, verranno adottate misure appropriate (clausole contrattuali standard, adequacy decision).

---

## 7. Diritti dell'Interessato (GDPR)

L'utente ha i seguenti diritti ai sensi del GDPR:

### 7.1 Diritto di Accesso (Art. 15)
Ottenere conferma del trattamento e copia dei propri dati

### 7.2 Diritto di Rettifica (Art. 16)
Correggere dati inesatti o incompleti

### 7.3 Diritto alla Cancellazione (Art. 17 - "Diritto all'Oblio")
Ottenere la cancellazione dei propri dati (salvo obblighi legali)

### 7.4 Diritto di Limitazione (Art. 18)
Limitare il trattamento in determinate circostanze

### 7.5 Diritto alla Portabilità (Art. 20)
Ricevere i propri dati in formato strutturato e leggibile da dispositivo automatico

### 7.6 Diritto di Opposizione (Art. 21)
Opporsi al trattamento per motivi legittimi

### 7.7 Diritto di Revoca del Consenso (Art. 7.3)
Revocare il consenso precedentemente fornito

### 7.8 Diritto di Reclamo (Art. 77)
Presentare reclamo all'Autorità Garante per la Protezione dei Dati Personali

**Autorità Garante:**
Garante per la Protezione dei Dati Personali
Piazza Venezia, 11 - 00187 Roma
Tel: +39 06.696771
Email: garante@gpdp.it
PEC: protocollo@pec.gpdp.it
Sito: www.garanteprivacy.it

---

## 8. Come Esercitare i Diritti

Per esercitare i diritti GDPR, l'utente può:

1. **Accedere alle impostazioni account** nell'Applicazione
2. **Inviare richiesta email** a: info@safetyprosuite.com oppure privacy@safetyprosuite.com
3. **Contattare direttamente** TOKEM LLC all'indirizzo sopra indicato

Risponderemo entro **30 giorni** dalla richiesta.

**Informazioni da fornire nella richiesta:**
- Nome e cognome
- Email registrata
- Tipo di richiesta (accesso, cancellazione, ecc.)
- Documento d'identità (per verifica identità)

---

## 9. Cookie e Tecnologie di Tracciamento

### 9.1 Cookie Utilizzati

**Cookie Tecnici Essenziali:**
- Token JWT (session storage) - Autenticazione utente
- Preferenze UI (local storage) - Memorizzazione impostazioni

Questi cookie sono **necessari** per il funzionamento dell'Applicazione e non richiedono consenso.

### 9.2 Cookie NON Utilizzati

L'Applicazione **NON utilizza**:
- Cookie di profilazione
- Cookie di terze parti (Google Analytics, Facebook Pixel, ecc.)
- Cookie pubblicitari

### 9.3 Gestione Cookie

L'utente può gestire i cookie tramite le impostazioni del browser:
- Chrome: Impostazioni > Privacy e sicurezza > Cookie
- Firefox: Opzioni > Privacy e sicurezza > Cookie
- Safari: Preferenze > Privacy > Cookie

---

## 10. Sicurezza dei Minori

L'Applicazione è destinata esclusivamente a **utenti maggiorenni** (18+ anni).

**NON raccogliamo consapevolmente dati di minori**. Se venissimo a conoscenza di dati di minori raccolti per errore, procederemo alla loro immediata cancellazione.

---

## 11. Modifiche alla Privacy Policy

Ci riserviamo il diritto di modificare la presente Informativa.

**Notifica modifiche:**
- Email agli utenti registrati
- Notifica nell'Applicazione
- Pubblicazione della nuova versione con data aggiornata

**Modifiche sostanziali:**
Richiederanno il rinnovo del consenso (se applicabile).

---

## 12. Data Breach

In caso di violazione dei dati personali:

1. **Notifica al Garante** entro 72 ore (se violazione ad alto rischio)
2. **Comunicazione agli interessati** se rischio elevato per diritti e libertà
3. **Misure correttive** immediate per mitigare il danno

---

## 13. Responsabile della Protezione Dati (DPO)

Per questioni relative alla privacy, contattare il DPO:

**TOKEM LLC - Data Protection Officer**
**Email:** privacy@safetyprosuite.com
**Indirizzo:** 5500 BENTGRASS DR UNIT 301, 34235 SARASOTA (FL) - U.S.A.

---

## 14. Consenso Informato

☐ **Ho letto e compreso l'Informativa sulla Privacy**

☐ **Acconsento al trattamento dei miei dati personali per le finalità indicate (esecuzione del servizio)**

☐ **Acconsento all'invio di comunicazioni commerciali e newsletter** (opzionale - revocabile in qualsiasi momento)

---

## 15. Informazioni Aggiuntive

### 15.1 Trasparenza
Questa informativa è disponibile:
- Durante la registrazione
- Nel footer dell'Applicazione
- Su richiesta via email

### 15.2 Lingua
Informativa disponibile in italiano. Versioni in altre lingue sono fornite a scopo informativo; in caso di discrepanza prevale la versione italiana.

### 15.3 Aggiornamenti Normativi
L'Applicazione è conforme a:
- GDPR (Reg. UE 2016/679)
- Codice Privacy italiano (D.Lgs. 196/2003 e s.m.i.)
- Linee guida del Garante Privacy italiano

---

## 16. Contatti Privacy

**TOKEM LLC (Safety Pro Suite)**
**Email Privacy:** privacy@safetyprosuite.com
**Email Generale:** info@safetyprosuite.com
**Indirizzo:** 5500 BENTGRASS DR UNIT 301, 34235 SARASOTA (FL) - U.S.A.
**Website:** www.safetyprosuite.com

---

**Ultimo aggiornamento:** 7 Dicembre 2025
**Versione:** 1.0

---

*Documento generato automaticamente da MoVaRisCh v2.1.0*
*Copyright © 2025 TOKEM LLC (Safety Pro Suite). Tutti i diritti riservati.*
