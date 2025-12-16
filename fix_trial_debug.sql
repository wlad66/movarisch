-- =====================================================
-- SCRIPT SQL PER DEBUGGING E FIX TRIAL SUBSCRIPTION
-- =====================================================
-- Esegui questo script nel database PostgreSQL per verificare
-- e correggere i problemi con le subscription trial

-- 1. VERIFICA TUTTI GLI UTENTI E LE LORO SUBSCRIPTION
SELECT
    u.id as user_id,
    u.email,
    u.nome,
    u.cognome,
    u.subscription_status as user_status,
    u.trial_ends_at as user_trial_end,
    s.id as subscription_id,
    s.status as subscription_status,
    s.trial_start_date,
    s.trial_end_date,
    s.subscription_start_date,
    s.subscription_end_date,
    CASE
        WHEN s.status = 'trial' AND s.trial_end_date > NOW() THEN 'TRIAL ATTIVO'
        WHEN s.status = 'trial' AND s.trial_end_date <= NOW() THEN 'TRIAL SCADUTO'
        WHEN s.status = 'active' AND s.subscription_end_date > NOW() THEN 'ABBONAMENTO ATTIVO'
        WHEN s.status = 'active' AND s.subscription_end_date <= NOW() THEN 'ABBONAMENTO SCADUTO'
        ELSE 'NESSUNO'
    END as stato_reale,
    EXTRACT(DAY FROM (s.trial_end_date - NOW())) as giorni_trial_rimanenti,
    EXTRACT(DAY FROM (s.subscription_end_date - NOW())) as giorni_sub_rimanenti
FROM users u
LEFT JOIN subscriptions s ON u.id = s.user_id
ORDER BY u.id;

-- 2. TROVA UTENTI SENZA SUBSCRIPTION
SELECT
    id,
    email,
    nome,
    cognome,
    created_at,
    subscription_status
FROM users u
WHERE NOT EXISTS (
    SELECT 1 FROM subscriptions s WHERE s.user_id = u.id
);

-- 3. TROVA TRIAL SCADUTI
SELECT
    u.id as user_id,
    u.email,
    s.id as subscription_id,
    s.status,
    s.trial_end_date,
    NOW() as now,
    EXTRACT(DAY FROM (NOW() - s.trial_end_date)) as giorni_scaduti
FROM users u
INNER JOIN subscriptions s ON u.id = s.user_id
WHERE s.status = 'trial'
  AND s.trial_end_date < NOW();

-- 4. FIX: CREA TRIAL 7 GIORNI PER UTENTI SENZA SUBSCRIPTION
-- IMPORTANTE: Modifica l'ID utente prima di eseguire!
-- Sostituisci <USER_ID> con l'ID dell'utente che vuoi fixare

-- Esempio per user_id = 1:
/*
INSERT INTO subscriptions (
    user_id,
    status,
    trial_start_date,
    trial_end_date,
    subscription_start_date,
    subscription_end_date,
    payment_method,
    amount,
    currency,
    auto_renew,
    stripe_subscription_id
) VALUES (
    1,  -- <-- CAMBIA CON L'ID DELL'UTENTE
    'trial',
    NOW(),
    NOW() + INTERVAL '7 days',
    NULL,
    NULL,
    NULL,
    NULL,
    'EUR',
    false,
    NULL
);

-- Aggiorna anche la tabella users
UPDATE users
SET
    subscription_status = 'trial',
    trial_ends_at = NOW() + INTERVAL '7 days'
WHERE id = 1;  -- <-- CAMBIA CON L'ID DELL'UTENTE
*/

-- 5. FIX: RIATTIVA TRIAL SCADUTO (aggiungi 7 giorni da ORA)
-- IMPORTANTE: Modifica l'ID utente prima di eseguire!
/*
UPDATE subscriptions
SET
    trial_end_date = NOW() + INTERVAL '7 days',
    updated_at = NOW()
WHERE user_id = 1  -- <-- CAMBIA CON L'ID DELL'UTENTE
  AND status = 'trial';

UPDATE users
SET
    trial_ends_at = NOW() + INTERVAL '7 days'
WHERE id = 1;  -- <-- CAMBIA CON L'ID DELL'UTENTE
*/

-- 6. FIX: CANCELLA SUBSCRIPTION CORROTTA E RICREA
-- IMPORTANTE: Modifica l'ID utente prima di eseguire!
/*
-- Cancella subscription esistente
DELETE FROM subscriptions WHERE user_id = 1;

-- Ricrea trial pulito
INSERT INTO subscriptions (
    user_id, status, trial_start_date, trial_end_date,
    currency, auto_renew
) VALUES (
    1, 'trial', NOW(), NOW() + INTERVAL '7 days', 'EUR', false
);

-- Aggiorna user
UPDATE users
SET subscription_status = 'trial', trial_ends_at = NOW() + INTERVAL '7 days'
WHERE id = 1;
*/

-- 7. VERIFICA CONFIGURAZIONE STRIPE (se necessario per pagamenti)
SELECT
    name,
    setting
FROM pg_settings
WHERE name LIKE '%stripe%' OR name LIKE '%payment%';

-- 8. CONTA SUBSCRIPTION PER STATUS
SELECT
    status,
    COUNT(*) as totale,
    COUNT(CASE WHEN trial_end_date > NOW() THEN 1 END) as trial_attivi,
    COUNT(CASE WHEN trial_end_date <= NOW() THEN 1 END) as trial_scaduti,
    COUNT(CASE WHEN subscription_end_date > NOW() THEN 1 END) as sub_attivi,
    COUNT(CASE WHEN subscription_end_date <= NOW() THEN 1 END) as sub_scaduti
FROM subscriptions
GROUP BY status;

-- =====================================================
-- ISTRUZIONI PER L'USO:
-- =====================================================
-- 1. Connettiti al database PostgreSQL:
--    docker exec -it movarisch-db psql -U movarisch_app -d movarisch
--
-- 2. Esegui le query di verifica (1-3, 8) per capire il problema
--
-- 3. Se trovi utenti senza subscription, usa la query 4 (decommentala)
--
-- 4. Se trovi trial scaduti, usa la query 5 (decommentala)
--
-- 5. Se la subscription è corrotta, usa la query 6 (decommentala)
--
-- RICORDA: Sostituisci sempre <USER_ID> con l'ID effettivo dell'utente!
-- =====================================================
