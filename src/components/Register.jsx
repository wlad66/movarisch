import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Building2, UserPlus, ArrowRight, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import LegalAgreement from './LegalAgreement';

const Register = ({ onNavigateToLogin }) => {
    const { register } = useAuth();
    const [step, setStep] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Dati Utente
    const [userData, setUserData] = useState({
        nome: '',
        cognome: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    // Dati Azienda
    const [companyData, setCompanyData] = useState({
        ragioneSociale: '',
        partitaIva: '',
        indirizzo: '',
        citta: '',
        cap: ''
    });

    // Dati Legali
    const [legalData, setLegalData] = useState(null);

    const handleUserChange = (e) => setUserData({ ...userData, [e.target.name]: e.target.value });
    const handleCompanyChange = (e) => setCompanyData({ ...companyData, [e.target.name]: e.target.value });

    const handleLegalAccept = (agreements) => {
        setLegalData(agreements);
        setStep(1); // Vai allo step 1 (Dati Utente)
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (userData.password !== userData.confirmPassword) {
            alert("Le password non coincidono!");
            return;
        }
        const { success, error } = await register(userData, companyData, legalData);
        if (!success) {
            alert("Errore registrazione: " + error);
        } else {
            // Force reload to bypass aggressive proxy caching and load fresh JS
            window.location.reload();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
            {step === 0 ? (
                <LegalAgreement onAccept={handleLegalAccept} />
            ) : (
                <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl border border-slate-200">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-slate-800">Registrazione Azienda</h1>
                        <p className="text-slate-500">Crea il tuo account Mono Azienda</p>

                        <div className="flex justify-center mt-4 gap-2">
                            <div className={`h-2 w-12 rounded-full ${step === 1 ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
                            <div className={`h-2 w-12 rounded-full ${step === 2 ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {step === 1 && (
                        <div className="space-y-4 animate-in slide-in-from-right duration-300">
                            <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                                <UserPlus size={20} className="text-blue-500" />
                                Dati Utente Amministratore
                            </h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Nome</label>
                                    <input name="nome" required value={userData.nome} onChange={handleUserChange} className="w-full p-2 border rounded" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Cognome</label>
                                    <input name="cognome" required value={userData.cognome} onChange={handleUserChange} className="w-full p-2 border rounded" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                <input type="email" name="email" required value={userData.email} onChange={handleUserChange} className="w-full p-2 border rounded" />
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            required
                                            value={userData.password}
                                            onChange={handleUserChange}
                                            className="w-full p-2 pr-10 border rounded"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Conferma Password</label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            required
                                            value={userData.confirmPassword}
                                            onChange={handleUserChange}
                                            className="w-full p-2 pr-10 border rounded"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        >
                                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <button type="button" onClick={() => setStep(2)} className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                    Avanti <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4 animate-in slide-in-from-right duration-300">
                            <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                                <Building2 size={20} className="text-blue-500" />
                                Dati Azienda
                            </h2>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Ragione Sociale</label>
                                <input name="ragioneSociale" required value={companyData.ragioneSociale} onChange={handleCompanyChange} className="w-full p-2 border rounded" placeholder="Es. Rossi S.r.l." />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Partita IVA / C.F.</label>
                                <input name="partitaIva" required value={companyData.partitaIva} onChange={handleCompanyChange} className="w-full p-2 border rounded" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Indirizzo Sede Legale</label>
                                <input name="indirizzo" required value={companyData.indirizzo} onChange={handleCompanyChange} className="w-full p-2 border rounded" />
                            </div>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Città</label>
                                    <input name="citta" required value={companyData.citta} onChange={handleCompanyChange} className="w-full p-2 border rounded" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">CAP</label>
                                    <input name="cap" required value={companyData.cap} onChange={handleCompanyChange} className="w-full p-2 border rounded" />
                                </div>
                            </div>

                            <div className="pt-4 flex justify-between">
                                <button type="button" onClick={() => setStep(1)} className="flex items-center gap-2 px-6 py-2 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50">
                                    <ArrowLeft size={16} /> Indietro
                                </button>
                                <button type="submit" className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold shadow">
                                    Completa Registrazione
                                </button>
                            </div>
                        </div>
                    )}
                </form>

                    <div className="mt-6 text-center text-sm text-slate-600 border-t pt-4">
                        Hai già un account?{' '}
                        <button
                            onClick={onNavigateToLogin}
                            className="text-blue-600 font-bold hover:underline"
                        >
                            Accedi qui
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Register;
