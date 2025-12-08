# 📋 Sistema Licensing & Password Recovery - Implementazione

**Data:** 7-8 Dicembre 2025
**Versione:** 1.0
**Status:** Backend Completato ✅ | Frontend In Corso ⏳

---

## 🎯 Obiettivi Completati

### ✅ Database
- [x] Tabella `subscriptions` - Gestione trial e abbonamenti
- [x] Tabella `payments` - Storico pagamenti
- [x] Tabella `password_reset_tokens` - Token reset password
- [x] Campi aggiunti a `users`: `subscription_status`, `trial_ends_at`, `subscription_ends_at`

### ✅ Backend Models
- [x] **Subscription.js** - CRUD completo subscription + helper methods
- [x] **Payment.js** - Gestione pagamenti e statistiche
- [x] **PasswordResetToken.js** - Token temporanei con validazione

### ✅ Email Service
- [x] Configurazione SMTP Hostinger (smtp.hostinger.com:465)
- [x] Template email password reset
- [x] Template email benvenuto (trial attivo)
- [x] Template email trial in scadenza (3 giorni)
- [x] Template email trial scaduto
- [x] Template email conferma pagamento

### ✅ API Endpoints

#### Password Recovery
```
POST   /api/auth/forgot-password          - Richiesta reset
POST   /api/auth/reset-password/:token    - Reset con token
GET    /api/auth/verify-reset-token/:token - Verifica validità
```

#### Subscription Management
```
GET    /api/subscription/status           - Stato abbonamento
POST   /api/subscription/create-checkout  - Crea sessione Stripe
POST   /api/subscription/webhook          - Webhook Stripe
POST   /api/subscription/cancel           - Cancella abbonamento
GET    /api/subscription/history          - Storico pagamenti
```

### ✅ Auto-Attivazione Trial
- [x] Trial 7 giorni attivato automaticamente alla registrazione
- [x] Email benvenuto con countdown giorni rimanenti
- [x] Aggiornamento `users.subscription_status` e `trial_ends_at`

---

## 📦 Dipendenze Installate

### Backend (server/package.json)
```json
{
  "stripe": "^14.8.0",
  "nodemailer": "^6.9.7",
  "node-cron": "^3.0.3",
  "uuid": "^9.0.1"
}
```

### Frontend (package.json)
```json
{
  "@stripe/stripe-js": "^2.4.0"
}
```

---

## 🔧 Configurazione Richiesta

### File: `server/.env`

Aggiungi le seguenti variabili al file `.env` esistente:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
STRIPE_PRICE_ID=price_your_product_price_id_here
STRIPE_SUCCESS_URL=https://movarisch.safetyprosuite.com/subscription/success
STRIPE_CANCEL_URL=https://movarisch.safetyprosuite.com/subscription/cancel

# Email Configuration (Hostinger SMTP)
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=info@safetyprosuite.com
SMTP_PASSWORD=your_email_password_here
EMAIL_FROM=info@safetyprosuite.com
EMAIL_FROM_NAME=MoVaRisCh - Safety Pro Suite

# Subscription Configuration
TRIAL_DAYS=7
SUBSCRIPTION_PRICE=50.00
SUBSCRIPTION_CURRENCY=EUR

# Application URLs
APP_URL=https://movarisch.safetyprosuite.com
API_URL=https://movarisch.safetyprosuite.com/api
```

---

## 🌐 Setup Stripe

### 1. Crea Prodotto su Stripe Dashboard

Vai su: https://dashboard.stripe.com/products

**Dati Prodotto:**
- Nome: **MoVaRisCh - Abbonamento Annuale**
- Descrizione: Accesso completo a MoVaRisCh per 1 anno
- Prezzo: **€50,00**
- Tipo: **One-time payment** (non ricorrente)
- Valuta: EUR

Dopo la creazione, copia il **Price ID** (formato: `price_xxxxx`) e inseriscilo in `.env` come `STRIPE_PRICE_ID`.

### 2. Ottieni API Keys

Vai su: https://dashboard.stripe.com/apikeys

Copia:
- **Publishable key** → `STRIPE_PUBLISHABLE_KEY`
- **Secret key** → `STRIPE_SECRET_KEY`

### 3. Configura Webhook

Vai su: https://dashboard.stripe.com/webhooks

**Endpoint URL:**
```
https://movarisch.safetyprosuite.com/api/subscription/webhook
```

**Eventi da monitorare:**
- `checkout.session.completed`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`

Dopo la creazione, copia il **Signing secret** → `STRIPE_WEBHOOK_SECRET`

---

## 📧 Setup Email (Hostinger)

### Credenziali SMTP

Dal tuo pannello Hostinger, hai già:
- Host: `smtp.hostinger.com`
- Porta: `465` (SSL)
- User: `info@safetyprosuite.com`

Devi solo inserire la password in `.env` → `SMTP_PASSWORD`

---

## 🔒 Sicurezza Implementata

### Password Recovery
- ✅ Token UUID v4 crittograficamente sicuro
- ✅ Scadenza 1 ora
- ✅ One-time use (token invalidato dopo utilizzo)
- ✅ Rate limiting: max 3 tentativi/ora per email
- ✅ Non rivela se email esiste nel sistema

### Pagamenti
- ✅ Mai salvare dati carta (gestito da Stripe)
- ✅ Webhook signature verification
- ✅ HTTPS obbligatorio
- ✅ Amount validation server-side

---

## 📂 Struttura File Creati

```
server/
├── models/
│   ├── Subscription.js          ✅ Nuovo
│   ├── Payment.js               ✅ Nuovo
│   └── PasswordResetToken.js    ✅ Nuovo
├── controllers/
│   ├── auth.controller.js       ✏️ Modificato (trial + password recovery)
│   └── subscription.controller.js ✅ Nuovo
├── routes/
│   ├── auth.routes.js           ✏️ Modificato (nuove route password)
│   └── subscription.routes.js   ✅ Nuovo
├── services/
│   └── email.service.js         ✅ Nuovo
├── server.js                    ✏️ Modificato (route subscription)
├── .env.example                 ✏️ Aggiornato
└── package.json                 ✏️ Aggiornato (dipendenze)
```

---

## 🚧 TODO - Frontend

### Componenti da Creare

#### 1. Password Recovery
- [ ] `src/components/ForgotPassword.jsx` - Form richiesta reset
- [ ] `src/components/ResetPassword.jsx` - Form nuova password
- [ ] Integrazione nel routing

#### 2. Subscription UI
- [ ] `src/components/SubscriptionStatus.jsx` - Widget stato abbonamento
- [ ] `src/components/UpgradeModal.jsx` - Modal upgrade a pagamento
- [ ] `src/components/SubscriptionExpired.jsx` - Schermata blocco app
- [ ] Banner trial nel Dashboard

#### 3. Stripe Integration
- [ ] Integrazione Stripe Checkout frontend
- [ ] Success/Cancel page post-pagamento

---

## 🔄 Flusso Utente

### 1. Registrazione
```
User compila form → Accetta documenti legali → Registrazione
                                              ↓
                        Auto-attivazione Trial 7gg + Email benvenuto
                                              ↓
                          Dashboard con banner "Trial - 7 giorni rimanenti"
```

### 2. Durante Trial
```
Login → Dashboard con countdown giorni
      ↓
      (3 giorni prima scadenza) → Email reminder
```

### 3. Upgrade
```
User clicca "Upgrade" → Stripe Checkout → Pagamento
                                         ↓
                            Webhook → Attiva subscription 1 anno
                                         ↓
                              Email conferma + Redirect dashboard
```

### 4. Password Dimenticata
```
User clicca "Password dimenticata?" → Inserisce email → Email con link
                                                        ↓
                                          Click link → Form nuova password
                                                        ↓
                                              Password aggiornata → Login
```

---

## 📊 Testing Checklist

### Backend API
- [ ] Test registrazione con auto-trial
- [ ] Test `POST /api/auth/forgot-password`
- [ ] Test `POST /api/auth/reset-password/:token`
- [ ] Test `GET /api/subscription/status`
- [ ] Test `POST /api/subscription/create-checkout`
- [ ] Test webhook Stripe (modalità test)

### Email
- [ ] Email benvenuto ricevuta
- [ ] Email reset password funzionante
- [ ] Email conferma pagamento

### Stripe
- [ ] Checkout test mode funzionante
- [ ] Webhook riceve eventi
- [ ] Subscription attivata dopo pagamento

---

## 📈 Prossimi Step

1. **Installare npm packages** (`npm install` in root e server/)
2. **Configurare .env** con credenziali Stripe e Email
3. **Creare componenti frontend**
4. **Testing locale**
5. **Deploy su VPS**
6. **Setup webhook Stripe in produzione**

---

## 💡 Note Importanti

### Rate Limiting
- Password reset: 3 tentativi/ora per email
- Considera aggiungere rate limiting generale (es. express-rate-limit)

### Cron Jobs (Opzionale - Fase 2)
Per automatizzare:
- Controllo trial scaduti giornaliero
- Email reminder 3 giorni prima scadenza
- Pulizia token scaduti

Creare: `server/jobs/subscription.jobs.js`

### Fatturazione (Opzionale - Fase 2)
- Integrazione sistema fatturazione automatico
- PDF invoice generation
- Invio fattura via email

---

## 🆘 Troubleshooting

### Email non arrivano
1. Verifica credenziali SMTP in `.env`
2. Controlla spam folder
3. Test con comando: `node -e "require('./server/services/email.service').sendMail({to:'test@example.com',subject:'Test',html:'Test'})"`

### Webhook Stripe non funziona
1. Verifica URL webhook corretto
2. Controlla `STRIPE_WEBHOOK_SECRET` in `.env`
3. Testa con Stripe CLI: `stripe listen --forward-to localhost:3000/api/subscription/webhook`

### Trial non si attiva
1. Verifica campo `TRIAL_DAYS` in `.env`
2. Controlla log console durante registrazione
3. Query database: `SELECT * FROM subscriptions WHERE user_id = X`

---

**Implementazione Backend:** ✅ Completata
**Prossimo:** Frontend Components
**Timeline stimata:** 3-4 ore per completamento frontend + testing
