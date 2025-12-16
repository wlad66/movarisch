# GUIDA CONFIGURAZIONE STRIPE - MOVARISCH

## STEP 1: Dashboard Stripe

1. Login: https://dashboard.stripe.com/
2. **Verifica che sei in TEST MODE** (interruttore in alto a destra deve essere OFF/grigio)

## STEP 2: Ottieni API Keys

1. Vai su: **Developers** → **API keys**
2. Troverai:
   - **Publishable key** (inizia con `pk_test_...`)
   - **Secret key** (inizia con `sk_test_...`) - click "Reveal test key"

3. **COPIA QUESTE CHIAVI** (le useremo dopo)

## STEP 3: Crea Prodotto

1. Vai su: **Products** → Click **"Add product"** (o "Create product")
2. Compila:
   - **Name**: `MoVaRisCh Abbonamento Annuale`
   - **Description**: `Abbonamento annuale a MoVaRisCh - Valutazione Rischio Chimico`

3. **Pricing**:
   - **Price**: `50.00`
   - **Currency**: `EUR`
   - **Billing period**: Seleziona **"Custom"** → poi seleziona **"yearly"** (1 anno)
   - OPPURE: Se vuoi pagamento one-time (non ricorrente), seleziona **"One time"**

4. Click **"Save product"**

5. **COPIA IL PRICE ID** (inizia con `price_...`)
   - Lo trovi nella lista prezzi del prodotto appena creato
   - Oppure nella sezione "API ID" del prezzo

## STEP 4: Configura Webhook (Opzionale ma consigliato)

1. Vai su: **Developers** → **Webhooks** → Click **"Add endpoint"**
2. Compila:
   - **Endpoint URL**: `https://movarisch.safetyprosuite.com/api/subscription/webhook`
   - **Description**: `MoVaRisCh Payment Webhook`

3. **Events to send**:
   - Cerca e seleziona:
     - ✅ `checkout.session.completed`
     - ✅ `payment_intent.succeeded`
     - ✅ `payment_intent.payment_failed`

4. Click **"Add endpoint"**

5. **COPIA IL SIGNING SECRET** (inizia con `whsec_...`)
   - Click sul webhook appena creato
   - Troverai "Signing secret" → Click "Reveal"

## RIEPILOGO CHIAVI NECESSARIE

Al termine avrai:
- ✅ **Secret Key**: `sk_test_...`
- ✅ **Publishable Key**: `pk_test_...`
- ✅ **Price ID**: `price_...`
- ✅ **Webhook Secret**: `whsec_...` (opzionale)

## CARTE TEST STRIPE

Per testare i pagamenti usa queste carte (funzionano solo in test mode):

| Carta | Numero | Scadenza | CVC | Risultato |
|-------|--------|----------|-----|-----------|
| Successo | `4242 4242 4242 4242` | Qualsiasi futura | Qualsiasi | ✅ Pagamento OK |
| Richiede auth | `4000 0025 0000 3155` | Qualsiasi futura | Qualsiasi | ⚠️ Richiede 3D Secure |
| Fallimento | `4000 0000 0000 9995` | Qualsiasi futura | Qualsiasi | ❌ Pagamento rifiutato |

**Dettagli da usare:**
- Scadenza: es. `12/30` (qualsiasi futura)
- CVC: es. `123` (qualsiasi 3 cifre)
- ZIP: es. `12345` (qualsiasi)
- Nome: Il tuo nome

Più carte test: https://stripe.com/docs/testing
