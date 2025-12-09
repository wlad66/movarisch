import React from 'react';
import { AlertCircle, Clock, CreditCard } from 'lucide-react';

const TrialBanner = ({ trial, onUpgrade }) => {
    if (!trial || !trial.active) return null;

    const daysRemaining = trial.daysRemaining || 0;
    const endsAt = trial.endsAt ? new Date(trial.endsAt) : null;

    // Calcola giorni rimanenti se non forniti
    let calculatedDays = daysRemaining;
    if (endsAt && !daysRemaining) {
        const now = new Date();
        const diffTime = endsAt - now;
        calculatedDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    // Colore del banner basato sui giorni rimanenti
    const getBannerStyle = () => {
        if (calculatedDays <= 1) {
            return 'bg-red-50 border-red-200 text-red-800';
        } else if (calculatedDays <= 3) {
            return 'bg-orange-50 border-orange-200 text-orange-800';
        } else {
            return 'bg-blue-50 border-blue-200 text-blue-800';
        }
    };

    const getIcon = () => {
        if (calculatedDays <= 1) {
            return <AlertCircle className="text-red-600" size={20} />;
        }
        return <Clock className="text-blue-600" size={20} />;
    };

    return (
        <div className={`${getBannerStyle()} border-2 rounded-lg p-4 mb-4`}>
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                    {getIcon()}
                    <div className="flex-1">
                        <h3 className="font-bold text-sm mb-1">
                            {calculatedDays <= 0 ? 'Trial Scaduto' : `Trial Attivo - ${calculatedDays} ${calculatedDays === 1 ? 'giorno' : 'giorni'} rimanenti`}
                        </h3>
                        {endsAt && calculatedDays > 0 && (
                            <p className="text-xs font-semibold mb-1">
                                Scadenza: {endsAt.toLocaleDateString('it-IT', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })} alle {endsAt.toLocaleTimeString('it-IT', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        )}
                        <p className="text-xs opacity-90">
                            {calculatedDays <= 0
                                ? 'Il tuo periodo di prova è terminato. Attiva l\'abbonamento per continuare ad utilizzare MoVaRisCh.'
                                : 'Passa all\'abbonamento annuale per continuare senza interruzioni.'
                            }
                        </p>
                    </div>
                </div>
                <button
                    onClick={onUpgrade}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg font-medium text-sm transition shadow-sm whitespace-nowrap"
                >
                    <CreditCard size={16} />
                    {calculatedDays <= 0 ? 'Attiva Ora' : 'Abbonati - €50/anno'}
                </button>
            </div>
        </div>
    );
};

export default TrialBanner;
