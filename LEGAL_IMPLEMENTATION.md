# Implementazione Documenti Legali - MoVaRisCh

**Data:** 7 Dicembre 2025
**Versione:** 1.0

---

## 📋 Documenti Creati

Sono stati creati 3 documenti legali completi per la conformità normativa dell'applicazione:

### 1. **TERMS_OF_SERVICE.md**
Termini e Condizioni d'Uso completi che coprono:
- Accettazione dei termini
- Registrazione e account
- Utilizzo consentito e vietato
- Proprietà intellettuale
- Limitazioni di responsabilità
- Risoluzione contratto
- Legge applicabile

### 2. **PRIVACY_POLICY.md**
Informativa sulla Privacy conforme GDPR che include:
- Dati raccolti (registrazione, utilizzo, tecnici)
- Base giuridica del trattamento
- Misure di sicurezza implementate
- Diritti dell'interessato (accesso, cancellazione, portabilità, ecc.)
- Cookie policy
- Procedure di data breach
- Contatti DPO

### 3. **DISCLAIMER.md**
Disclaimer di Responsabilità specifico per valutazione rischio chimico:
- Natura di strumento di supporto
- Responsabilità finale dell'utente professionista
- Esclusioni di garanzia
- Limitazioni tecniche
- Conformità normativa (D.Lgs 81/08, CLP, REACH)
- Indennizzo

---

## 🔧 Implementazione nel Codice

### STEP 1: Creazione Componente Accettazione Legale

Creare un nuovo componente React: `src/components/LegalAgreement.jsx`

```jsx
import React, { useState } from 'react';
import { FileText, Shield, AlertTriangle } from 'lucide-react';

const LegalAgreement = ({ onAccept }) => {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [professionalConfirmed, setProfessionalConfirmed] = useState(false);
  const [activeTab, setActiveTab] = useState('terms');

  const canProceed = termsAccepted && privacyAccepted && disclaimerAccepted && professionalConfirmed;

  const handleAccept = () => {
    if (canProceed) {
      onAccept({
        termsAccepted: true,
        privacyAccepted: true,
        disclaimerAccepted: true,
        professionalConfirmed: true,
        acceptedAt: new Date().toISOString()
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          Benvenuto in MoVaRisCh
        </h1>
        <p className="text-slate-600">
          Prima di procedere, ti preghiamo di leggere e accettare i seguenti documenti
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b">
        <button
          onClick={() => setActiveTab('terms')}
          className={\`px-4 py-2 font-medium \${activeTab === 'terms' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-600'}\`}
        >
          <FileText className="inline mr-2" size={18} />
          Termini e Condizioni
        </button>
        <button
          onClick={() => setActiveTab('privacy')}
          className={\`px-4 py-2 font-medium \${activeTab === 'privacy' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-600'}\`}
        >
          <Shield className="inline mr-2" size={18} />
          Privacy Policy
        </button>
        <button
          onClick={() => setActiveTab('disclaimer')}
          className={\`px-4 py-2 font-medium \${activeTab === 'disclaimer' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-600'}\`}
        >
          <AlertTriangle className="inline mr-2" size={18} />
          Disclaimer
        </button>
      </div>

      {/* Content Area */}
      <div className="bg-white border rounded-lg p-6 mb-6 max-h-96 overflow-y-auto">
        {activeTab === 'terms' && (
          <div className="prose max-w-none">
            <h2>Termini e Condizioni d'Uso</h2>
            {/* Include content from TERMS_OF_SERVICE.md */}
            <p>Utilizzando l'applicazione web MoVaRisCh...</p>
            {/* ... resto del contenuto ... */}
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="prose max-w-none">
            <h2>Informativa sulla Privacy</h2>
            {/* Include content from PRIVACY_POLICY.md */}
            <p>La presente Informativa sulla Privacy descrive...</p>
            {/* ... resto del contenuto ... */}
          </div>
        )}

        {activeTab === 'disclaimer' && (
          <div className="prose max-w-none">
            <h2>Disclaimer di Responsabilità</h2>
            {/* Include content from DISCLAIMER.md */}
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4">
              <p className="font-bold">⚠️ AVVISO IMPORTANTE</p>
              <p>L'applicazione web MoVaRisCh è uno strumento di supporto decisionale...</p>
            </div>
            {/* ... resto del contenuto ... */}
          </div>
        )}
      </div>

      {/* Checkboxes */}
      <div className="bg-slate-50 border rounded-lg p-6 mb-6">
        <h3 className="font-bold text-lg mb-4">Dichiarazioni Obbligatorie</h3>

        <label className="flex items-start gap-3 mb-4 cursor-pointer">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="mt-1"
          />
          <span className="text-sm">
            Ho letto e accetto i <strong>Termini e Condizioni d'Uso</strong>
          </span>
        </label>

        <label className="flex items-start gap-3 mb-4 cursor-pointer">
          <input
            type="checkbox"
            checked={privacyAccepted}
            onChange={(e) => setPrivacyAccepted(e.target.checked)}
            className="mt-1"
          />
          <span className="text-sm">
            Ho letto e accetto l'<strong>Informativa sulla Privacy</strong> e acconsento al trattamento dei miei dati personali
          </span>
        </label>

        <label className="flex items-start gap-3 mb-4 cursor-pointer">
          <input
            type="checkbox"
            checked={disclaimerAccepted}
            onChange={(e) => setDisclaimerAccepted(e.target.checked)}
            className="mt-1"
          />
          <span className="text-sm">
            Ho letto e accetto il <strong>Disclaimer di Responsabilità</strong> e comprendo che la responsabilità finale della valutazione del rischio rimane mia
          </span>
        </label>

        <div className="border-t pt-4 mt-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={professionalConfirmed}
              onChange={(e) => setProfessionalConfirmed(e.target.checked)}
              className="mt-1"
            />
            <span className="text-sm font-medium">
              <strong>Confermo di essere un professionista qualificato</strong> in materia di sicurezza sul lavoro e valutazione del rischio chimico, con le competenze necessarie per utilizzare correttamente questa applicazione
            </span>
          </label>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleAccept}
          disabled={!canProceed}
          className={\`flex-1 py-3 rounded-lg font-bold transition \${
            canProceed
              ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
              : 'bg-slate-300 text-slate-500 cursor-not-allowed'
          }\`}
        >
          Accetta e Continua con la Registrazione
        </button>
      </div>

      {/* Warning if not all accepted */}
      {!canProceed && (
        <div className="mt-4 bg-yellow-50 border border-yellow-300 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            ⚠️ Per procedere è necessario accettare tutti i documenti e confermare la qualifica professionale
          </p>
        </div>
      )}
    </div>
  );
};

export default LegalAgreement;
```

---

### STEP 2: Modifica Schema Database

Aggiungere campi al database per tracciare l'accettazione legale:

```sql
-- Aggiungere colonne alla tabella users
ALTER TABLE users ADD COLUMN IF NOT EXISTS terms_accepted BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS terms_accepted_at TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS privacy_accepted BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS privacy_accepted_at TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS disclaimer_accepted BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS disclaimer_accepted_at TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS professional_confirmed BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS legal_version VARCHAR(10) DEFAULT '1.0';
```

---

### STEP 3: Modifica API di Registrazione

Aggiornare `server/server.js` per includere i campi legali:

```javascript
// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  try {
    const {
      email,
      password,
      companyName,
      legalAcceptance // Nuovo campo
    } = req.body;

    // Validazione accettazione legale
    if (!legalAcceptance ||
        !legalAcceptance.termsAccepted ||
        !legalAcceptance.privacyAccepted ||
        !legalAcceptance.disclaimerAccepted ||
        !legalAcceptance.professionalConfirmed) {
      return res.status(400).json({
        error: 'È necessario accettare tutti i documenti legali per registrarsi'
      });
    }

    // Verifica se utente esiste già
    const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email già registrata' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Inserisci nuovo utente con campi legali
    const result = await db.query(
      `INSERT INTO users (
        email,
        password,
        company_name,
        terms_accepted,
        terms_accepted_at,
        privacy_accepted,
        privacy_accepted_at,
        disclaimer_accepted,
        disclaimer_accepted_at,
        professional_confirmed,
        legal_version
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING id, email, company_name`,
      [
        email,
        hashedPassword,
        companyName,
        true,
        new Date(),
        true,
        new Date(),
        true,
        new Date(),
        true,
        '1.0'
      ]
    );

    const user = result.rows[0];
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        companyName: user.company_name
      }
    });

  } catch (error) {
    console.error('Errore registrazione:', error);
    res.status(500).json({ error: 'Errore durante la registrazione' });
  }
});
```

---

### STEP 4: Modifica Componente Register

Aggiornare `src/components/Register.jsx`:

```javascript
import React, { useState } from 'react';
import LegalAgreement from './LegalAgreement';

const Register = () => {
  const [step, setStep] = useState(1); // 1 = Legal, 2 = Registration Form
  const [legalAcceptance, setLegalAcceptance] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    companyName: ''
  });

  const handleLegalAccept = (acceptance) => {
    setLegalAcceptance(acceptance);
    setStep(2);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validazioni
    if (formData.password !== formData.confirmPassword) {
      alert('Le password non corrispondono');
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          companyName: formData.companyName,
          legalAcceptance: legalAcceptance
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Salva token e reindirizza
        localStorage.setItem('token', data.token);
        window.location.href = '/';
      } else {
        alert(data.error || 'Errore durante la registrazione');
      }
    } catch (error) {
      console.error('Errore:', error);
      alert('Errore di connessione');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
      {step === 1 && (
        <LegalAgreement onAccept={handleLegalAccept} />
      )}

      {step === 2 && (
        <div className="max-w-md mx-auto p-6">
          <h2 className="text-2xl font-bold mb-6">Completa la Registrazione</h2>
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Form fields... */}
            <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-lg">
              Registrati
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Register;
```

---

### STEP 5: Footer con Link ai Documenti

Aggiungere nel footer dell'applicazione:

```jsx
<footer className="bg-slate-800 text-white p-6 text-center text-sm">
  <div className="max-w-6xl mx-auto">
    <div className="flex justify-center gap-6 mb-4">
      <a href="/terms" className="hover:underline">Termini e Condizioni</a>
      <a href="/privacy" className="hover:underline">Privacy Policy</a>
      <a href="/disclaimer" className="hover:underline">Disclaimer</a>
    </div>
    <p>© 2025 Safety Pro Suite - MoVaRisCh v2.1.0</p>
    <p className="text-xs text-slate-400 mt-2">
      Conforme a D.Lgs 81/08, GDPR (Reg. UE 2016/679), CLP, REACH
    </p>
  </div>
</footer>
```

---

## 📝 TODO per Completare l'Implementazione

- [ ] Creare componente `LegalAgreement.jsx`
- [ ] Aggiungere campi legali al database (migration SQL)
- [ ] Modificare API `/api/auth/register`
- [ ] Aggiornare componente `Register.jsx`
- [ ] Creare pagine statiche `/terms`, `/privacy`, `/disclaimer`
- [ ] Aggiungere footer con link legali
- [ ] Testare flusso completo di registrazione
- [ ] Personalizzare email, PEC, indirizzi nei documenti .md
- [ ] Consultare legale per revisione documenti
- [ ] Decidere foro competente (città tribunale)

---

## ⚠️ IMPORTANTE - Prima del Deploy

### Personalizzazioni Obbligatorie

Nei file `.md` creati, sostituire i placeholder:

✅ **COMPLETATO** - Tutti i placeholder sono stati sostituiti con i dati TOKEM LLC:
- Email: info@safetyprosuite.com
- Email Privacy: privacy@safetyprosuite.com
- Indirizzo: 5500 BENTGRASS DR UNIT 301, 34235 SARASOTA (FL) - U.S.A.
- Website: www.safetyprosuite.com
- FEI/EIN: 84-1930240

✅ Clausola foro competente rimossa (decisione rimandata a revisione legale)

### Consulenza Legale

**RACCOMANDAZIONE FORTE**: Far revisionare i documenti da un avvocato specializzato in:
- Diritto del lavoro
- GDPR e privacy
- Sicurezza sul lavoro
- Contrattualistica IT

---

## 📚 Normativa di Riferimento

I documenti sono stati redatti considerando:

- **GDPR** - Regolamento UE 2016/679
- **D.Lgs. 196/2003** e s.m.i. - Codice Privacy italiano
- **D.Lgs. 81/2008** - Testo Unico Sicurezza Lavoro
- **Regolamento CLP** - Reg. CE 1272/2008
- **Regolamento REACH** - Reg. CE 1907/2006
- **Codice Civile** - Contratti e responsabilità
- **Codice del Consumo** - D.Lgs. 206/2005

---

**Versione:** 1.0
**Data:** 7 Dicembre 2025
