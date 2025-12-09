import React, { useState } from 'react';
import { Mail, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';

const ForgotPassword = ({ onNavigateToLogin }) => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Errore durante la richiesta');
            }

            setSuccess(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
                <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-slate-200">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle size={32} className="text-green-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-800 mb-4">Email Inviata!</h1>
                        <p className="text-slate-600 mb-6">
                            Controlla la tua casella di posta <strong>{email}</strong>. Ti abbiamo inviato un link per reimpostare la password.
                        </p>
                        <p className="text-sm text-slate-500 mb-6">
                            Se non ricevi l'email entro pochi minuti, controlla nella cartella spam o contatta il supporto a <strong>info@safetyprosuite.com</strong>
                        </p>
                        <button
                            onClick={onNavigateToLogin}
                            className="flex items-center gap-2 mx-auto text-blue-600 hover:underline"
                        >
                            <ArrowLeft size={16} />
                            Torna al Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-slate-200">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail size={32} className="text-blue-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800">Password Dimenticata?</h1>
                    <p className="text-slate-500 mt-2">
                        Inserisci il tuo indirizzo email e ti invieremo un link per reimpostare la password
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 flex items-center gap-2 text-sm">
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="nome@azienda.it"
                            disabled={isSubmitting}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Invio in corso...' : 'Invia Link di Reset'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={onNavigateToLogin}
                        className="flex items-center gap-2 mx-auto text-sm text-slate-600 hover:text-slate-800"
                    >
                        <ArrowLeft size={16} />
                        Torna al Login
                    </button>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-200 text-center text-sm text-slate-500">
                    <p>Hai bisogno di aiuto? Contattaci a</p>
                    <a href="mailto:info@safetyprosuite.com" className="text-blue-600 hover:underline font-medium">
                        info@safetyprosuite.com
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
