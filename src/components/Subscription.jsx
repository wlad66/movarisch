import React, { useState } from 'react';
import { CreditCard, CheckCircle, AlertCircle, Calendar, Euro } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Subscription = () => {
    const { trial, subscription, fetchSubscriptionStatus } = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Calculate days remaining for trial
    const getDaysRemaining = () => {
        if (!trial || !trial.endsAt) return 0;
        const now = new Date();
        const endsAt = new Date(trial.endsAt);
        const diffTime = endsAt - now;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const handleSubscribe = async () => {
        setIsProcessing(true);
        setError(null);
        setSuccess(null);

        try {
            // TODO: Integrate with Stripe payment
            // For now, we'll create a placeholder that you can replace with Stripe
            const response = await fetch('/api/subscription/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('movarisch_token')}`
                },
                body: JSON.stringify({
                    plan: 'annual',
                    amount: 50
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Errore durante la creazione dell\'abbonamento');
            }

            setSuccess('Abbonamento attivato con successo!');

            // Refresh subscription status
            await fetchSubscriptionStatus();
        } catch (err) {
            setError(err.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const daysRemaining = getDaysRemaining();
    const isTrialActive = trial && trial.active;
    const isSubscriptionActive = subscription && subscription.status === 'active';

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                    <CreditCard size={28} className="text-blue-600" />
                    Gestione Abbonamento
                </h2>

                {/* Current Status */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-slate-700 mb-4">Stato Attuale</h3>

                    {isSubscriptionActive ? (
                        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 flex items-start gap-3">
                            <CheckCircle className="text-green-600 flex-shrink-0" size={24} />
                            <div>
                                <p className="font-bold text-green-800 mb-1">Abbonamento Attivo</p>
                                <p className="text-sm text-green-700">
                                    Il tuo abbonamento è attivo fino al {new Date(subscription.endsAt).toLocaleDateString('it-IT')}
                                </p>
                            </div>
                        </div>
                    ) : isTrialActive ? (
                        <div className={`border-2 rounded-lg p-4 flex items-start gap-3 ${
                            daysRemaining <= 1 ? 'bg-red-50 border-red-200' :
                            daysRemaining <= 3 ? 'bg-orange-50 border-orange-200' :
                            'bg-blue-50 border-blue-200'
                        }`}>
                            <AlertCircle className={`flex-shrink-0 ${
                                daysRemaining <= 1 ? 'text-red-600' :
                                daysRemaining <= 3 ? 'text-orange-600' :
                                'text-blue-600'
                            }`} size={24} />
                            <div>
                                <p className={`font-bold mb-1 ${
                                    daysRemaining <= 1 ? 'text-red-800' :
                                    daysRemaining <= 3 ? 'text-orange-800' :
                                    'text-blue-800'
                                }`}>
                                    Periodo di Prova - {daysRemaining} {daysRemaining === 1 ? 'giorno' : 'giorni'} rimanenti
                                </p>
                                <p className={`text-sm ${
                                    daysRemaining <= 1 ? 'text-red-700' :
                                    daysRemaining <= 3 ? 'text-orange-700' :
                                    'text-blue-700'
                                }`}>
                                    Il periodo di prova scade il {new Date(trial.endsAt).toLocaleDateString('it-IT')}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 flex items-start gap-3">
                            <AlertCircle className="text-red-600 flex-shrink-0" size={24} />
                            <div>
                                <p className="font-bold text-red-800 mb-1">Nessun Abbonamento Attivo</p>
                                <p className="text-sm text-red-700">
                                    Attiva un abbonamento per continuare ad utilizzare MoVaRisCh
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Subscription Plan */}
                {!isSubscriptionActive && (
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-slate-700 mb-4">Piano Abbonamento</h3>

                        <div className="border-2 border-blue-200 rounded-lg p-6 bg-gradient-to-br from-blue-50 to-blue-100">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h4 className="text-xl font-bold text-blue-900 mb-2">Piano Annuale</h4>
                                    <p className="text-sm text-blue-700 mb-4">
                                        Accesso completo a tutte le funzionalità di MoVaRisCh
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-blue-900 flex items-start gap-1">
                                        <Euro size={24} className="mt-1" />
                                        50
                                    </div>
                                    <div className="text-sm text-blue-700">all'anno</div>
                                </div>
                            </div>

                            <div className="space-y-2 mb-6">
                                <div className="flex items-center gap-2 text-sm text-blue-800">
                                    <CheckCircle size={16} className="text-blue-600" />
                                    Valutazione del rischio chimico completa
                                </div>
                                <div className="flex items-center gap-2 text-sm text-blue-800">
                                    <CheckCircle size={16} className="text-blue-600" />
                                    Ottimizzatore DPI automatico
                                </div>
                                <div className="flex items-center gap-2 text-sm text-blue-800">
                                    <CheckCircle size={16} className="text-blue-600" />
                                    Archivio illimitato delle valutazioni
                                </div>
                                <div className="flex items-center gap-2 text-sm text-blue-800">
                                    <CheckCircle size={16} className="text-blue-600" />
                                    Esportazione report in formato Word
                                </div>
                                <div className="flex items-center gap-2 text-sm text-blue-800">
                                    <CheckCircle size={16} className="text-blue-600" />
                                    Gestione anagrafica luoghi e mansioni
                                </div>
                                <div className="flex items-center gap-2 text-sm text-blue-800">
                                    <CheckCircle size={16} className="text-blue-600" />
                                    Aggiornamenti e supporto inclusi
                                </div>
                            </div>

                            {error && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-sm text-green-700">
                                    {success}
                                </div>
                            )}

                            <button
                                onClick={handleSubscribe}
                                disabled={isProcessing}
                                className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-bold text-lg transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <CreditCard size={20} />
                                {isProcessing ? 'Elaborazione...' : 'Attiva Abbonamento - €50/anno'}
                            </button>

                            <p className="text-xs text-blue-600 text-center mt-3">
                                Pagamento sicuro • Fattura disponibile • Cancellazione in qualsiasi momento
                            </p>
                        </div>
                    </div>
                )}

                {/* Subscription Info */}
                {isSubscriptionActive && (
                    <div className="bg-slate-50 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-slate-700 mb-3">Informazioni Abbonamento</h3>
                        <div className="space-y-2 text-sm text-slate-600">
                            <div className="flex items-center gap-2">
                                <Calendar size={16} className="text-slate-400" />
                                <span>Inizio: {new Date(subscription.startsAt).toLocaleDateString('it-IT')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar size={16} className="text-slate-400" />
                                <span>Scadenza: {new Date(subscription.endsAt).toLocaleDateString('it-IT')}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Subscription;
