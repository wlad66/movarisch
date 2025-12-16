UPDATE subscriptions SET trial_end_date = NOW() + INTERVAL '2 days' WHERE status = 'trial';
