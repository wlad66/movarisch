import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Building, Users, MapPin, Trash2, Plus, FlaskConical, Search, Edit2, Check, X } from 'lucide-react';

const DataManagement = ({ hCodes }) => {
    // Ensure hCodes is always an array
    const hCodesArray = Array.isArray(hCodes) ? hCodes : (hCodes?.default || []);

    const {
        workplaces, addWorkplace, deleteWorkplace,
        roles, addRole, deleteRole,
        inventory, addToInventory, updateInventory, deleteFromInventory
    } = useData();

    const [activeTab, setActiveTab] = useState('workplaces');

    // Form States
    const [newWorkplace, setNewWorkplace] = useState("");
    const [newRole, setNewRole] = useState({ name: "", description: "" });

    // Inventory Form State
    const [newAgent, setNewAgent] = useState({ name: "", cas: "", hCodes: [] });
    const [agentSearch, setAgentSearch] = useState("");
    const [editingAgent, setEditingAgent] = useState(null);
    const [editForm, setEditForm] = useState({ name: "", cas: "", hCodes: [] });

    const handleAddWorkplace = (e) => {
        e.preventDefault();
        if (newWorkplace.trim()) {
            addWorkplace(newWorkplace);
            setNewWorkplace("");
        }
    };

    const handleAddRole = (e) => {
        e.preventDefault();
        if (newRole.name.trim()) {
            addRole(newRole.name, newRole.description);
            setNewRole({ name: "", description: "" });
        }
    };

    const handleAddAgent = (e) => {
        e.preventDefault();
        if (newAgent.name.trim() && newAgent.cas.trim()) {
            addToInventory(newAgent);
            setNewAgent({ name: "", cas: "", hCodes: [] });
        } else {
            alert("Inserisci almeno Nome e CAS.");
        }
    };

    const toggleAgentHCode = (codeItem) => {
        const exists = newAgent.hCodes.find(c => c.code === codeItem.code);
        if (exists) {
            setNewAgent({ ...newAgent, hCodes: newAgent.hCodes.filter(c => c.code !== codeItem.code) });
        } else {
            setNewAgent({ ...newAgent, hCodes: [...newAgent.hCodes, codeItem] });
        }
    };

    const startEditing = (agent) => {
        setEditingAgent(agent.id);
        setEditForm({ name: agent.name, cas: agent.cas, hCodes: agent.hCodes || [] });
    };

    const cancelEditing = () => {
        setEditingAgent(null);
        setEditForm({ name: "", cas: "", hCodes: [] });
    };

    const saveEditing = (id) => {
        if (editForm.name.trim() && editForm.cas.trim()) {
            updateInventory(id, editForm);
            setEditingAgent(null);
            setEditForm({ name: "", cas: "", hCodes: [] });
        } else {
            alert("Nome e CAS sono obbligatori.");
        }
    };

    const toggleEditHCode = (codeItem) => {
        const exists = editForm.hCodes.find(c => c.code === codeItem.code);
        if (exists) {
            setEditForm({ ...editForm, hCodes: editForm.hCodes.filter(c => c.code !== codeItem.code) });
        } else {
            setEditForm({ ...editForm, hCodes: [...editForm.hCodes, codeItem] });
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Building className="text-blue-600" />
                Gestione Anagrafiche
            </h2>

            <button
                onClick={() => {
                    if (confirm('SEI SICURO? Questo cancellerà tutti i dati inseriti (Luoghi, Mansioni, Inventario) e ripristinerà l\'applicazione allo stato iniziale. Questa azione è irreversibile.')) {
                        localStorage.removeItem('movarisch_inventory');
                        localStorage.removeItem('movarisch_workplaces');
                        localStorage.removeItem('movarisch_roles');
                        localStorage.removeItem('movarisch_assessments');
                        window.location.reload();
                    }
                }}
                className="mb-6 bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 flex items-center gap-2 border border-red-200 text-sm font-bold"
            >
                <Trash2 size={16} /> RESETTA TUTTI I DATI (CANCELLA TUTTO)
            </button>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-slate-200 overflow-x-auto">
                <button
                    onClick={() => setActiveTab('workplaces')}
                    className={`px-4 py-2 font-medium flex items-center gap-2 border-b-2 transition whitespace-nowrap ${activeTab === 'workplaces' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    <MapPin size={18} /> Luoghi di Lavoro
                </button>
                <button
                    onClick={() => setActiveTab('roles')}
                    className={`px-4 py-2 font-medium flex items-center gap-2 border-b-2 transition whitespace-nowrap ${activeTab === 'roles' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    <Users size={18} /> Mansioni
                </button>
                <button
                    onClick={() => setActiveTab('inventory')}
                    className={`px-4 py-2 font-medium flex items-center gap-2 border-b-2 transition whitespace-nowrap ${activeTab === 'inventory' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    <FlaskConical size={18} /> Inventario Chimico
                </button>
            </div>

            {/* WORKPLACES TAB */}
            {activeTab === 'workplaces' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Aggiungi Luogo di Lavoro</h3>
                        <form onSubmit={handleAddWorkplace} className="flex gap-4">
                            <input
                                type="text"
                                value={newWorkplace}
                                onChange={(e) => setNewWorkplace(e.target.value)}
                                placeholder="Es. Reparto Verniciatura, Magazzino A..."
                                className="flex-1 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                                <Plus size={18} /> Aggiungi
                            </button>
                        </form>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="p-4 font-semibold text-slate-600">Nome Luogo</th>
                                    <th className="p-4 font-semibold text-slate-600 text-right">Azioni</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {workplaces.length === 0 ? (
                                    <tr>
                                        <td colSpan="2" className="p-8 text-center text-slate-500 italic">
                                            Nessun luogo di lavoro inserito.
                                        </td>
                                    </tr>
                                ) : (
                                    workplaces.map((wp) => (
                                        <tr key={wp.id} className="hover:bg-slate-50">
                                            <td className="p-4 text-slate-800 font-medium">{wp.name}</td>
                                            <td className="p-4 text-right">
                                                <button
                                                    onClick={() => deleteWorkplace(wp.id)}
                                                    className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ROLES TAB */}
            {activeTab === 'roles' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Aggiungi Mansione</h3>
                        <form onSubmit={handleAddRole} className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    value={newRole.name}
                                    onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                                    placeholder="Nome Mansione (es. Verniciatore)"
                                    className="p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                                <input
                                    type="text"
                                    value={newRole.description}
                                    onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                                    placeholder="Descrizione (opzionale)"
                                    className="p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div className="flex justify-end">
                                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                                    <Plus size={18} /> Aggiungi Mansione
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="p-4 font-semibold text-slate-600">Mansione</th>
                                    <th className="p-4 font-semibold text-slate-600">Descrizione</th>
                                    <th className="p-4 font-semibold text-slate-600 text-right">Azioni</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {roles.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" className="p-8 text-center text-slate-500 italic">
                                            Nessuna mansione inserita.
                                        </td>
                                    </tr>
                                ) : (
                                    roles.map((role) => (
                                        <tr key={role.id} className="hover:bg-slate-50">
                                            <td className="p-4 text-slate-800 font-medium">{role.name}</td>
                                            <td className="p-4 text-slate-600">{role.description || "-"}</td>
                                            <td className="p-4 text-right">
                                                <button
                                                    onClick={() => deleteRole(role.id)}
                                                    className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* INVENTORY TAB */}
            {activeTab === 'inventory' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">

                    {/* Add Agent Form */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Aggiungi Agente Chimico</h3>
                        <div className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    value={newAgent.name}
                                    onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                                    placeholder="Nome Agente (es. Acetone)"
                                    className="p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                                <input
                                    type="text"
                                    value={newAgent.cas}
                                    onChange={(e) => setNewAgent({ ...newAgent, cas: e.target.value })}
                                    placeholder="Numero CAS (es. 67-64-1)"
                                    className="p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Frasi H Associate</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto border p-2 rounded bg-slate-50">
                                    {hCodesArray.map((h) => (
                                        <div
                                            key={h.code}
                                            onClick={() => toggleAgentHCode(h)}
                                            className={`cursor-pointer p-2 rounded border text-xs flex justify-between items-center transition ${newAgent.hCodes.find(x => x.code === h.code) ? 'bg-blue-100 border-blue-500' : 'bg-white border-slate-200 hover:bg-slate-100'}`}
                                        >
                                            <span className="font-bold text-blue-800 w-16">{h.code}</span>
                                            <span className="flex-1 truncate">{h.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    onClick={handleAddAgent}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                                >
                                    <Plus size={18} /> Aggiungi all'Inventario
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-4 border-b bg-slate-50">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Cerca nell'inventario..."
                                    value={agentSearch}
                                    onChange={(e) => setAgentSearch(e.target.value)}
                                    className="w-full pl-10 p-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="p-4 font-semibold text-slate-600">Agente Chimico</th>
                                    <th className="p-4 font-semibold text-slate-600">CAS</th>
                                    <th className="p-4 font-semibold text-slate-600">Frasi H</th>
                                    <th className="p-4 font-semibold text-slate-600 text-right">Azioni</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {inventory.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="p-8 text-center text-slate-500 italic">
                                            Nessun agente chimico in inventario.
                                        </td>
                                    </tr>
                                ) : (
                                    inventory
                                        .filter(i => i.name.toLowerCase().includes(agentSearch.toLowerCase()) || i.cas.includes(agentSearch))
                                        .map((item) => (
                                            <tr key={item.id} className="hover:bg-slate-50">
                                                {editingAgent === item.id ? (
                                                    <>
                                                        <td className="p-4">
                                                            <input
                                                                type="text"
                                                                value={editForm.name}
                                                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                                className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                                            />
                                                        </td>
                                                        <td className="p-4">
                                                            <input
                                                                type="text"
                                                                value={editForm.cas}
                                                                onChange={(e) => setEditForm({ ...editForm, cas: e.target.value })}
                                                                className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                                                            />
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="max-h-32 overflow-y-auto border rounded p-2 bg-slate-50">
                                                                <div className="grid grid-cols-2 gap-1">
                                                                    {hCodesArray.slice(0, 20).map((h) => (
                                                                        <div
                                                                            key={h.code}
                                                                            onClick={() => toggleEditHCode(h)}
                                                                            className={`cursor-pointer p-1 rounded border text-xs ${editForm.hCodes.find(x => x.code === h.code) ? 'bg-blue-100 border-blue-500' : 'bg-white border-slate-200'}`}
                                                                        >
                                                                            {h.code}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="p-4 text-right">
                                                            <div className="flex gap-2 justify-end">
                                                                <button
                                                                    onClick={() => saveEditing(item.id)}
                                                                    className="text-green-600 hover:text-green-700 p-2 rounded-full hover:bg-green-50 transition"
                                                                    title="Salva"
                                                                >
                                                                    <Check size={18} />
                                                                </button>
                                                                <button
                                                                    onClick={cancelEditing}
                                                                    className="text-slate-500 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 transition"
                                                                    title="Annulla"
                                                                >
                                                                    <X size={18} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </>
                                                ) : (
                                                    <>
                                                        <td className="p-4 text-slate-800 font-medium">{item.name}</td>
                                                        <td className="p-4 text-slate-600 font-mono text-sm">{item.cas}</td>
                                                        <td className="p-4">
                                                            <div className="flex flex-wrap gap-1">
                                                                {item.hCodes && item.hCodes.map(h => (
                                                                    <span key={h.code} className="text-xs bg-slate-100 border border-slate-200 px-1 rounded text-slate-600" title={h.text}>
                                                                        {h.code}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </td>
                                                        <td className="p-4 text-right">
                                                            <div className="flex gap-2 justify-end">
                                                                <button
                                                                    onClick={() => startEditing(item)}
                                                                    className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50 transition"
                                                                    title="Modifica"
                                                                >
                                                                    <Edit2 size={18} />
                                                                </button>
                                                                <button
                                                                    onClick={() => deleteFromInventory(item.id)}
                                                                    className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition"
                                                                    title="Elimina"
                                                                >
                                                                    <Trash2 size={18} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </>
                                                )}
                                            </tr>
                                        ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataManagement;
