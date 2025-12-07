import React, { useState, useMemo } from 'react';
import { Database, Plus, Edit2, Trash2, Download, Upload, Save, X } from 'lucide-react';
import ppeData from '../data/ppe_database.json';

const PPEDatabaseManager = () => {
    const [activeTab, setActiveTab] = useState('chemicals');
    const [editMode, setEditMode] = useState(null); // { type: 'chemical'|'glove'|'performance', id: ... }
    const [formData, setFormData] = useState({});

    // Load overlay from localStorage
    const [overlay, setOverlay] = useState(() => {
        const stored = localStorage.getItem('movarisch_ppe_overlay');
        return stored ? JSON.parse(stored) : { chemicals: [], gloves: [], performance: [] };
    });

    // Merge base database with user overlay
    const mergedData = useMemo(() => {
        const chemicals = [...ppeData.chemicals];
        const gloves = [...ppeData.gloves];
        const performance = [...ppeData.performance];

        // Apply overlay modifications
        overlay.chemicals.forEach(overlayItem => {
            const idx = chemicals.findIndex(c => c.cas === overlayItem.cas && c.percentage === overlayItem.percentage);
            if (idx >= 0) {
                chemicals[idx] = { ...chemicals[idx], ...overlayItem };
            } else {
                chemicals.push(overlayItem);
            }
        });

        overlay.gloves.forEach(overlayItem => {
            const idx = gloves.findIndex(g => g.id === overlayItem.id);
            if (idx >= 0) {
                gloves[idx] = { ...gloves[idx], ...overlayItem };
            } else {
                gloves.push(overlayItem);
            }
        });

        overlay.performance.forEach(overlayItem => {
            const idx = performance.findIndex(p =>
                p.cas === overlayItem.cas &&
                p.percentage === overlayItem.percentage &&
                p.gloveId === overlayItem.gloveId
            );
            if (idx >= 0) {
                performance[idx] = { ...performance[idx], ...overlayItem };
            } else {
                performance.push(overlayItem);
            }
        });

        return { chemicals, gloves, performance };
    }, [overlay]);

    const saveOverlay = (newOverlay) => {
        setOverlay(newOverlay);
        localStorage.setItem('movarisch_ppe_overlay', JSON.stringify(newOverlay));
    };

    const handleAddChemical = () => {
        setEditMode({ type: 'chemical', id: 'new' });
        setFormData({ cas: '', name: '', percentage: 100, state: 'L' });
    };

    const handleEditChemical = (chemical) => {
        setEditMode({ type: 'chemical', id: chemical.cas });
        setFormData(chemical);
    };

    const handleSaveChemical = () => {
        const newOverlay = { ...overlay };
        const idx = newOverlay.chemicals.findIndex(c => c.cas === formData.cas && c.percentage === formData.percentage);

        if (idx >= 0) {
            newOverlay.chemicals[idx] = formData;
        } else {
            newOverlay.chemicals.push(formData);
        }

        saveOverlay(newOverlay);
        setEditMode(null);
        setFormData({});
    };

    const handleDeleteChemical = (cas, percentage) => {
        if (!confirm('Sei sicuro di voler eliminare questa sostanza?')) return;

        const newOverlay = {
            ...overlay,
            chemicals: overlay.chemicals.filter(c => !(c.cas === cas && c.percentage === percentage)),
            performance: overlay.performance.filter(p => !(p.cas === cas && p.percentage === percentage))
        };
        saveOverlay(newOverlay);
    };

    const exportToCSV = () => {
        const headers = ['CAS', 'Chemical_Name', 'Percentage', 'Physical_State', ...mergedData.gloves.map(g => g.name)];
        const rows = mergedData.chemicals.map(chem => {
            const row = [chem.cas, chem.name, chem.percentage, chem.state];
            mergedData.gloves.forEach(glove => {
                const perf = mergedData.performance.find(p =>
                    p.cas === chem.cas &&
                    p.percentage === chem.percentage &&
                    p.gloveId === glove.id
                );
                row.push(perf ? perf.time : 'N/A');
            });
            return row;
        });

        const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ppe_database_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Database className="text-blue-600" />
                        Database DPI - Gestione Archivio
                    </h2>
                    <p className="text-slate-600">Visualizza e modifica il database di riferimento CAS + DPI</p>
                </div>
                <button
                    onClick={exportToCSV}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                    <Download size={18} />
                    Esporta CSV
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-slate-200">
                <button
                    onClick={() => setActiveTab('chemicals')}
                    className={`px-4 py-2 font-medium border-b-2 transition ${activeTab === 'chemicals' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    Sostanze Chimiche ({mergedData.chemicals.length})
                </button>
                <button
                    onClick={() => setActiveTab('gloves')}
                    className={`px-4 py-2 font-medium border-b-2 transition ${activeTab === 'gloves' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    Guanti ({mergedData.gloves.length})
                </button>
                <button
                    onClick={() => setActiveTab('performance')}
                    className={`px-4 py-2 font-medium border-b-2 transition ${activeTab === 'performance' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    Dati Permeazione ({mergedData.performance.length})
                </button>
            </div>

            {/* Chemicals Tab */}
            {activeTab === 'chemicals' && (
                <div className="space-y-4">
                    <div className="flex justify-end">
                        <button
                            onClick={handleAddChemical}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            <Plus size={18} />
                            Aggiungi Sostanza
                        </button>
                    </div>

                    {editMode?.type === 'chemical' && (
                        <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
                            <h3 className="font-bold text-blue-900 mb-4">
                                {editMode.id === 'new' ? 'Nuova Sostanza' : 'Modifica Sostanza'}
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="CAS (es. 67-64-1)"
                                    value={formData.cas || ''}
                                    onChange={(e) => setFormData({ ...formData, cas: e.target.value })}
                                    className="p-2 border rounded-lg font-mono"
                                />
                                <input
                                    type="text"
                                    placeholder="Nome Sostanza"
                                    value={formData.name || ''}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="p-2 border rounded-lg"
                                />
                                <input
                                    type="number"
                                    placeholder="Percentuale"
                                    value={formData.percentage || 100}
                                    onChange={(e) => setFormData({ ...formData, percentage: parseFloat(e.target.value) })}
                                    className="p-2 border rounded-lg"
                                />
                                <select
                                    value={formData.state || 'L'}
                                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                    className="p-2 border rounded-lg"
                                >
                                    <option value="L">Liquido</option>
                                    <option value="S">Solido</option>
                                    <option value="G">Gas</option>
                                </select>
                            </div>
                            <div className="flex gap-2 mt-4">
                                <button
                                    onClick={handleSaveChemical}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                >
                                    <Save size={18} />
                                    Salva
                                </button>
                                <button
                                    onClick={() => { setEditMode(null); setFormData({}); }}
                                    className="flex items-center gap-2 px-4 py-2 bg-slate-300 text-slate-700 rounded-lg hover:bg-slate-400"
                                >
                                    <X size={18} />
                                    Annulla
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="bg-white rounded-xl shadow overflow-hidden border">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b">
                                <tr>
                                    <th className="p-3">CAS</th>
                                    <th className="p-3">Nome</th>
                                    <th className="p-3">%</th>
                                    <th className="p-3">Stato</th>
                                    <th className="p-3 text-right">Azioni</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {mergedData.chemicals.map((chem, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50">
                                        <td className="p-3 font-mono text-sm">{chem.cas}</td>
                                        <td className="p-3">{chem.name}</td>
                                        <td className="p-3">{chem.percentage}%</td>
                                        <td className="p-3">{chem.state}</td>
                                        <td className="p-3 text-right">
                                            <button
                                                onClick={() => handleEditChemical(chem)}
                                                className="text-blue-600 hover:text-blue-800 p-1 mr-2"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteChemical(chem.cas, chem.percentage)}
                                                className="text-red-600 hover:text-red-800 p-1"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Gloves Tab */}
            {activeTab === 'gloves' && (
                <div className="bg-white rounded-xl shadow overflow-hidden border">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b">
                            <tr>
                                <th className="p-3">ID</th>
                                <th className="p-3">Nome</th>
                                <th className="p-3">Materiale</th>
                                <th className="p-3">Spessore</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {mergedData.gloves.map((glove) => (
                                <tr key={glove.id} className="hover:bg-slate-50">
                                    <td className="p-3 font-mono text-sm">{glove.id}</td>
                                    <td className="p-3">{glove.name}</td>
                                    <td className="p-3">{glove.material}</td>
                                    <td className="p-3">{glove.thickness}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Performance Tab */}
            {activeTab === 'performance' && (
                <div className="bg-white rounded-xl shadow overflow-hidden border">
                    <div className="p-4 text-sm text-slate-600">
                        Totale record di permeazione: <strong>{mergedData.performance.length}</strong>
                    </div>
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b">
                            <tr>
                                <th className="p-2">CAS</th>
                                <th className="p-2">%</th>
                                <th className="p-2">Guanto</th>
                                <th className="p-2">Tempo</th>
                                <th className="p-2">Colore</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {mergedData.performance.slice(0, 100).map((perf, idx) => (
                                <tr key={idx} className="hover:bg-slate-50">
                                    <td className="p-2 font-mono">{perf.cas}</td>
                                    <td className="p-2">{perf.percentage}%</td>
                                    <td className="p-2">{perf.gloveId}</td>
                                    <td className="p-2">{perf.time}</td>
                                    <td className="p-2">
                                        <span className={`inline-block w-3 h-3 rounded-full bg-${perf.color}-500`}></span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {mergedData.performance.length > 100 && (
                        <div className="p-4 text-center text-slate-500 text-sm">
                            Mostrati primi 100 di {mergedData.performance.length} record
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PPEDatabaseManager;
