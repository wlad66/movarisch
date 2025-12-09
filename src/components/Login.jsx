import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn, AlertCircle, Eye, EyeOff } from 'lucide-react';

const Login = ({ onNavigateToRegister, onNavigateToForgotPassword }) => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const { success, error } = await login(email, password);
        if (!success) {
            setError(error || 'Credenziali non valide.');
        } else {
            // Force reload to bypass aggressive proxy caching and load fresh JS
            window.location.reload();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-slate-200">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                        <LogIn size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800">Accedi a MoVaRisCh</h1>
                    <p className="text-slate-500">Inserisci le tue credenziali per continuare</p>
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
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 pr-12 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>
                    <div className="text-right">
                        <button
                            type="button"
                            onClick={onNavigateToForgotPassword}
                            className="text-sm text-blue-600 hover:underline"
                        >
                            Password dimenticata?
                        </button>
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow transition"
                    >
                        Accedi
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-600">
                    Non hai un account?{' '}
                    <button
                        onClick={onNavigateToRegister}
                        className="text-blue-600 font-bold hover:underline"
                    >
                        Registrati come Nuova Azienda
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
