import React, { useState, useEffect, useMemo } from 'react';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { DataProvider, useData } from './src/context/DataContext';
import Login from './src/components/Login';
import Register from './src/components/Register';
import DataManagement from './src/components/DataManagement';
import { AlertTriangle, Wind, Hand, Activity, Info, RotateCcw, FileText, CheckCircle, AlertOctagon, Shield, Database, Download, ChevronDown } from 'lucide-react';
import PPEOptimizer from './src/components/PPEOptimizer';
import ppeData from './src/data/ppe_database.json';
import { hCodes as hCodesImported } from './src/data/hCodes';
const hCodes = Array.isArray(hCodesImported) ? hCodesImported : [];
import { Matrix1QuantityUse, Matrix2UsageType, Matrix3ControlType, Matrix4ExposureTime, Matrix5DermalExposure } from './src/components/RiskMatrices';
import { exportCompleteReport, exportAssessmentToWord, exportArchivedReport } from './src/utils/exportToWord';

// --- COMPONENTE PER LA GESTIONE DEGLI ERRORI (ERROR BOUNDARY) ---
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Errore catturato:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-800 m-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <AlertTriangle className="text-red-600" />
            Si Ã¨ verificato un errore imprevisto
          </h2>
          <p className="mt-2 text-sm font-mono bg-white p-2 border rounded">{this.state.error?.toString()}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Ricarica Applicazione
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Matrici
const matrix1 = [
  [1, 1, 1, 2, 2],
  [1, 2, 3, 3, 4],
  [1, 3, 3, 4, 4],
  [2, 3, 4, 4, 4]
];

const matrix2 = [
  [1, 1, 1, 2],
  [1, 2, 2, 3],
  [1, 2, 3, 3],
  [2, 3, 3, 3]
];

const matrix3 = [
  [1, 1, 1, 2, 2],
  [1, 2, 2, 3, 3],
  [1, 2, 3, 3, 3]
];

const matrix4 = [
  [1, 1, 3, 3, 7],
  [1, 3, 7, 7, 10],
  [3, 7, 10, 10, 10]
];

const matrixCute = [
  [1, 1, 3, 7],
  [1, 3, 3, 7],
  [1, 3, 7, 10],
  [1, 3, 7, 10]
];

// --- COMPONENTE ARCHIVIO ---
const ArchiveView = ({ reports, onDelete }) => {
  const { company } = useAuth();
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <FileText className="text-blue-600" />
        Archivio Valutazioni
      </h2>

      {reports.length === 0 ? (
        <div className="text-center p-12 bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 text-slate-500">
          <Info size={48} className="mx-auto mb-4 opacity-50" />
          <p>Nessun report archiviato.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reports.map((report) => (
            <div key={report.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 p-4 border-b flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-700">{report.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => exportArchivedReport(report, company)}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium border border-blue-200 px-3 py-1 rounded hover:bg-blue-50 transition"
                  >
                    <Download size={14} /> Esporta Docx
                  </button>
                  {onDelete && (
                    <button
                      onClick={() => onDelete(report.id)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium px-3 py-1"
                    >
                      Elimina
                    </button>
                  )}
                </div>
              </div>
              <div className="p-4 grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Prodotti Valutati</h4>
                  <ul className="space-y-1">
                    {report.chemicals.map((chem, idx) => (
                      <li key={idx} className="text-sm text-slate-700 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                        {chem.name} <span className="text-slate-400 text-xs">({chem.cas})</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">DPI Selezionati</h4>
                  <ul className="space-y-2">
                    {report.gloves.map((glove, idx) => (
                      <li key={idx} className="text-sm bg-green-50 border border-green-100 p-2 rounded text-green-900">
                        <div className="font-bold">{glove.material} ({glove.thickness})</div>
                        <div className="text-xs opacity-80">{glove.name}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- COMPONENTE PRINCIPALE ---
const MoVaRisChContent = ({ savedAssessments, addAssessment }) => {
  const { workplaces, roles, inventory } = useData();
  const [step, setStep] = useState(1);

  // State Dati
  const [companyName, setCompanyName] = useState(""); // Ora sarÃ  Reparto/Luogo
  const [selectedWorkplace, setSelectedWorkplace] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [agentName, setAgentName] = useState("");
  const [casNumber, setCasNumber] = useState("");
  const [selectedHCodes, setSelectedHCodes] = useState([]);
  const [pScore, setPScore] = useState(1.00);

  // Parametri Inalazione
  const [physicalState, setPhysicalState] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [usageType, setUsageType] = useState(2);
  const [controlType, setControlType] = useState(3);
  const [exposureTime, setExposureTime] = useState(4);
  const [distance, setDistance] = useState(1);

  // Parametri Cute
  const [dermalContact, setDermalContact] = useState(1);

  // Handle Agent Selection
  const handleAgentSelect = (e) => {
    const agentId = e.target.value;
    setSelectedAgentId(agentId);

    if (agentId) {
      const agent = inventory.find(i => i.id === Number(agentId));
      if (agent) {
        setAgentName(agent.name);
        setCasNumber(agent.cas);
        setSelectedHCodes(agent.hCodes || []);
      }
    } else {
      setAgentName("");
      setCasNumber("");
      setSelectedHCodes([]);
    }
  };

  // Calcolo P Score
  useEffect(() => {
    if (selectedHCodes.length === 0) {
      setPScore(1.00);
    } else {
      const maxScore = Math.max(...selectedHCodes.map(c => c.score));
      setPScore(maxScore || 1.00);
    }
  }, [selectedHCodes]);

  // Calcoli Matrici con controlli di sicurezza (Safe Access)
  const D_Index = useMemo(() => {
    const row = matrix1[physicalState] || [];
    return row[quantity] || 1;
  }, [physicalState, quantity]);

  const U_Index = useMemo(() => {
    const row = matrix2[D_Index - 1] || [];
    return row[usageType] || 1;
  }, [D_Index, usageType]);

  const C_Index = useMemo(() => {
    const row = matrix3[U_Index - 1] || [];
    return row[controlType] || 1;
  }, [U_Index, controlType]);

  const I_Val = useMemo(() => {
    const row = matrix4[C_Index - 1] || [];
    return row[exposureTime] || 1;
  }, [C_Index, exposureTime]);

  const calcEInal = I_Val * distance;

  const calcECute = useMemo(() => {
    const row = matrixCute[usageType] || [];
    return row[dermalContact] || 1;
  }, [usageType, dermalContact]);

  const calcRInal = pScore * calcEInal;
  const calcRCute = pScore * calcECute;
  const calcRCum = Math.sqrt(Math.pow(calcRInal, 2) + Math.pow(calcRCute, 2));

  // Logica Suggerimento DPI (Step 4)
  const suggestedPPE = useMemo(() => {
    if (!casNumber) return null;

    // Trova tutte le performance per questo CAS
    const performances = ppeData.performance.filter(p => p.cas === casNumber.trim());

    if (performances.length === 0) return null;

    // Ordina per sicurezza (Green > Yellow > Orange > Red)
    const scoreMap = { 'green': 3, 'yellow': 2, 'orange': 1, 'red': 0 };
    performances.sort((a, b) => scoreMap[b.color] - scoreMap[a.color]);

    // Prendi il migliore
    const bestPerf = performances[0];
    const glove = ppeData.gloves.find(g => g.id === bestPerf.gloveId);

    return {
      glove,
      performance: bestPerf
    };
  }, [casNumber]);

  // Helpers
  const toggleHCode = (item) => {
    if (selectedHCodes.find(x => x.code === item.code)) {
      setSelectedHCodes(selectedHCodes.filter(x => x.code !== item.code));
    } else {
      setSelectedHCodes([...selectedHCodes, item]);
    }
  };

  const getRiskColor = (r) => {
    if (r < 15) return "bg-green-500";
    if (r < 21) return "bg-yellow-400";
    if (r <= 40) return "bg-orange-500";
    if (r <= 80) return "bg-red-600";
    return "bg-purple-700";
  };

  const getRiskLabel = (r) => {
    if (r < 15) return "IRRILEVANTE PER LA SALUTE";
    if (r < 21) return "INCERTEZZA (Consultare Medico)";
    if (r <= 40) return "RISCHIO (Misure necessarie)";
    if (r <= 80) return "ALTO (Misure urgenti)";
    return "GRAVISSIMO (Immediato intervento)";
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Header rimosso da qui perchÃ© ora Ã¨ in App */}
      <main className="max-w-4xl mx-auto p-4 md:p-6">
        <div className="flex justify-between mb-8 relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-10 rounded"></div>
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className={`flex flex-col items-center gap-2 bg-slate-50 px-2`}>
              <div
                onClick={() => setStep(s)}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold cursor-pointer transition-all ${step === s ? 'bg-blue-600 text-white scale-110 shadow-lg' : step > s ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-500'}`}
              >
                {step > s ? <CheckCircle size={20} /> : s}
              </div>
              <span className="text-xs font-medium hidden md:block text-center">
                {s === 1 && "Pericolo P"}
                {s === 2 && "Esposizione Inal."}
                {s === 3 && "Esposizione Cute"}
                {s === 4 && "Risultato"}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 min-h-[400px]">

          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-xl font-bold text-blue-900 flex items-center gap-2 border-b pb-2">
                <AlertTriangle className="text-orange-500" />
                Identificazione Pericolo (P)
              </h2>

              {/* Selezione Luogo e Mansione */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Luogo di Lavoro</label>
                  <select
                    value={selectedWorkplace}
                    onChange={(e) => setSelectedWorkplace(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Seleziona Luogo...</option>
                    {workplaces.map(w => <option key={w.id} value={w.name}>{w.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Mansione / Lavoratore</label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Seleziona Mansione...</option>
                    {roles.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                  </select>
                </div>
              </div>

              {/* Selezione Agente Chimico */}
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <label className="block text-sm font-bold text-blue-900 mb-2">Seleziona Agente da Inventario</label>
                <select
                  value={selectedAgentId}
                  onChange={handleAgentSelect}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none mb-4"
                >
                  <option value="">-- Seleziona o Inserisci Manualmente --</option>
                  {inventory
                    .filter(i => !savedAssessments.find(a => a.cas === i.cas))
                    .map(i => <option key={i.id} value={i.id}>{i.name} (CAS: {i.cas})</option>)}
                </select>

                <div className="grid md:grid-cols-3 gap-4">
                  {/* Nome Agente */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Nome Agente Chimico / Miscela</label>
                    <input
                      type="text"
                      value={agentName}
                      onChange={(e) => setAgentName(e.target.value)}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Es. Acetone..."
                    />
                  </div>
                  {/* CAS Number */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Numero CAS</label>
                    <input
                      type="text"
                      value={casNumber}
                      onChange={(e) => setCasNumber(e.target.value)}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                      placeholder="Es. 67-64-1"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Seleziona Frasi H</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto border p-2 rounded bg-slate-50">
                  {hCodes.map((h) => (
                    <div
                      key={h.code}
                      onClick={() => toggleHCode(h)}
                      className={`cursor-pointer p-2 rounded border text-sm flex justify-between items-center transition ${selectedHCodes.find(x => x.code === h.code) ? 'bg-blue-100 border-blue-500' : 'bg-white border-slate-200 hover:bg-slate-100'}`}
                    >
                      <span className="font-bold text-blue-800 w-24">{h.code}</span>
                      <span className="flex-1 truncate">{h.text}</span>
                      <span className="text-xs bg-slate-200 px-2 py-1 rounded ml-2">Score: {h.score.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex justify-between items-center">
                <span className="text-sm text-blue-800 font-medium">Score P Calcolato:</span>
                <span className="text-3xl font-bold text-blue-900">{pScore.toFixed(2)}</span>
              </div>
              <button onClick={() => setStep(2)} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow mt-4">
                Avanti &rarr;
              </button>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-xl font-bold text-blue-900 flex items-center gap-2 border-b pb-2">
                <Wind className="text-cyan-500" />
                Esposizione Inalatoria
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">1. Stato Fisico</label>
                  <select value={physicalState} onChange={(e) => setPhysicalState(Number(e.target.value))} className="w-full p-2 border rounded">
                    <option value={0}>Solido / Nebbie</option>
                    <option value={1}>Liquido Bassa VolatilitÃ </option>
                    <option value={2}>Media/Alta VolatilitÃ  / Polveri</option>
                    <option value={3}>Gas</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">2. QuantitÃ </label>
                  <select value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="w-full p-2 border rounded">
                    <option value={0}>{'<'} 0,1 Kg</option>
                    <option value={1}>0,1 - 1 Kg</option>
                    <option value={2}>1 - 10 Kg</option>
                    <option value={3}>10 - 100 Kg</option>
                    <option value={4}>{'>'} 100 Kg</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">3. Tipo Uso</label>
                  <select value={usageType} onChange={(e) => setUsageType(Number(e.target.value))} className="w-full p-2 border rounded">
                    <option value={0}>Sistema Chiuso</option>
                    <option value={1}>Inclusione in Matrice</option>
                    <option value={2}>Uso Controllato</option>
                    <option value={3}>Uso Dispersivo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">4. Controllo</label>
                  <select value={controlType} onChange={(e) => setControlType(Number(e.target.value))} className="w-full p-2 border rounded">
                    <option value={0}>Contenimento Completo</option>
                    <option value={1}>Aspirazione Localizzata</option>
                    <option value={2}>Segregazione</option>
                    <option value={3}>Ventilazione Generale</option>
                    <option value={4}>Manipolazione Diretta</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">5. Tempo</label>
                  <select value={exposureTime} onChange={(e) => setExposureTime(Number(e.target.value))} className="w-full p-2 border rounded">
                    <option value={0}>{'<'} 15 min</option>
                    <option value={1}>15 min - 2 ore</option>
                    <option value={2}>2 - 4 ore</option>
                    <option value={3}>4 - 6 ore</option>
                    <option value={4}>{'>'} 6 ore</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Distanza (d)</label>
                  <select value={distance} onChange={(e) => setDistance(Number(e.target.value))} className="w-full p-2 border rounded">
                    <option value={1}>{'<'} 1m (Operatore)</option>
                    <option value={0.75}>1 - 3m</option>
                    <option value={0.50}>3 - 5m</option>
                    <option value={0.25}>5 - 10m</option>
                    <option value={0.10}>{'>'} 10m</option>
                  </select>
                </div>
              </div>

              <div className="bg-slate-100 p-3 rounded text-xs text-slate-500 flex gap-4 justify-center mt-4">
                <span className="font-bold text-blue-900 text-sm">E_inal (calc): {calcEInal.toFixed(2)}</span>
              </div>

              <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="flex-1 py-3 border border-slate-300 text-slate-600 rounded-lg font-medium hover:bg-slate-50">&larr; Indietro</button>
                <button onClick={() => setStep(3)} className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow">Avanti &rarr;</button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-xl font-bold text-blue-900 flex items-center gap-2 border-b pb-2">
                <Hand className="text-purple-500" />
                Esposizione Cutanea
              </h2>
              <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 text-sm rounded">
                <Info size={16} className="inline mr-2" />
                Valutazione necessaria se presente rischio cutaneo (es. H312, H317).
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Livello Contatto</label>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { val: 0, label: "Nessun Contatto", desc: "Impossibile" },
                    { val: 1, label: "Accidentale", desc: "Max 1 evento/gg" },
                    { val: 2, label: "Discontinuo", desc: "2-10 eventi/gg" },
                    { val: 3, label: "Esteso", desc: "> 10 eventi/gg" },
                  ].map((opt) => (
                    <div
                      key={opt.val}
                      onClick={() => setDermalContact(opt.val)}
                      className={`p-4 border rounded-lg cursor-pointer flex justify-between items-center transition ${dermalContact === opt.val ? 'bg-purple-50 border-purple-500 ring-1 ring-purple-500' : 'hover:bg-slate-50'}`}
                    >
                      <div>
                        <div className="font-bold text-slate-800">{opt.label}</div>
                        <div className="text-sm text-slate-500">{opt.desc}</div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${dermalContact === opt.val ? 'border-purple-500' : 'border-slate-300'}`}>
                        {dermalContact === opt.val && <div className="w-2.5 h-2.5 rounded-full bg-purple-500"></div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-slate-100 p-3 rounded text-xs text-slate-500 text-center mt-4">
                E_cute (calc): <span className="font-bold text-purple-700 text-sm">{calcECute}</span>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStep(2)} className="flex-1 py-3 border border-slate-300 text-slate-600 rounded-lg font-medium hover:bg-slate-50">&larr; Indietro</button>
                <button onClick={() => setStep(4)} className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow">Calcola &rarr;</button>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-800">Risultati</h2>
                <p className="text-slate-500">{agentName || "Agente senza nome"}</p>
                {selectedWorkplace && <p className="text-sm text-slate-400">Luogo: {selectedWorkplace}</p>}
                {selectedRole && <p className="text-sm text-slate-400">Mansione: {selectedRole}</p>}
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {/* Inalatorio */}
                <div className="bg-white border rounded-xl p-4 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500"></div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-slate-500 text-sm font-medium uppercase">R. Inalatorio</span>
                    <Wind size={20} className="text-cyan-500" />
                  </div>
                  <div className="text-3xl font-bold text-slate-800 mb-1">{calcRInal.toFixed(2)}</div>
                  <div className={`mt-3 text-xs font-bold text-white px-2 py-1 rounded inline-block ${getRiskColor(calcRInal)}`}>
                    {getRiskLabel(calcRInal)}
                  </div>
                </div>

                {/* Cutaneo */}
                <div className="bg-white border rounded-xl p-4 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-slate-500 text-sm font-medium uppercase">R. Cutaneo</span>
                    <Hand size={20} className="text-purple-500" />
                  </div>
                  <div className="text-3xl font-bold text-slate-800 mb-1">{calcRCute.toFixed(2)}</div>
                  <div className={`mt-3 text-xs font-bold text-white px-2 py-1 rounded inline-block ${getRiskColor(calcRCute)}`}>
                    {getRiskLabel(calcRCute)}
                  </div>
                </div>

                {/* Cumulativo */}
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 shadow-lg relative overflow-hidden text-white">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-slate-300 text-sm font-medium uppercase">R. Cumulativo</span>
                    <AlertOctagon size={20} className="text-yellow-400" />
                  </div>
                  <div className="text-4xl font-bold mb-1">{calcRCum.toFixed(2)}</div>
                  <div className={`mt-3 text-xs font-bold text-white px-2 py-1 rounded inline-block ${getRiskColor(calcRCum)}`}>
                    {getRiskLabel(calcRCum)}
                  </div>
                </div>
              </div>

              {/* Suggerimento DPI */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                  <Shield className="text-blue-600" />
                  DPI Suggerito (Protezione Chimica)
                </h3>

                {suggestedPPE ? (
                  <div className="flex items-start gap-4">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold shadow-sm shrink-0
                      ${suggestedPPE.performance.color === 'green' ? 'bg-green-500' :
                        suggestedPPE.performance.color === 'yellow' ? 'bg-yellow-400' :
                          suggestedPPE.performance.color === 'orange' ? 'bg-orange-500' : 'bg-red-600'}`}
                    >
                      {suggestedPPE.performance.time}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-slate-900">Guanto in {suggestedPPE.glove.material} ({suggestedPPE.glove.thickness})</h4>
                      <p className="text-slate-600 text-sm mb-1">
                        <span className="font-medium">Esempio:</span> {suggestedPPE.glove.name} <span className="italic text-slate-500">(o equivalente)</span>
                      </p>
                      <div className="text-xs text-slate-500 bg-white border px-2 py-1 rounded inline-block">
                        CAS: {casNumber}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-slate-500 italic flex items-center gap-2">
                    <Info size={16} />
                    {casNumber ? "Nessun dato specifico trovato per questo CAS nel database demo." : "Inserisci un numero CAS nello Step 1 per vedere i suggerimenti."}
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button onClick={() => {
                  // Reset all assessment data
                  setAgentName('');
                  setCasNumber('');
                  setSelectedHCodes([]);
                  setPScore(1.00);
                  setPhysicalState(0);
                  setQuantity(0);
                  setUsageType(2);
                  setControlType(3);
                  setExposureTime(4);
                  setDistance(1);
                  setDermalContact(1);
                  setStep(1);
                }} className="flex-1 py-3 border border-slate-300 text-slate-600 rounded-lg font-medium hover:bg-slate-50">Nuova Valutazione</button>
                <button
                  onClick={() => {
                    if (casNumber && agentName) {
                      addAssessment({
                        cas: casNumber,
                        name: agentName,
                        company: companyName,
                        workplace: selectedWorkplace,
                        role: selectedRole,
                        hCodes: selectedHCodes,
                        pScore,
                        physicalState,
                        quantity,
                        usageType,
                        controlType,
                        exposureTime,
                        distance,
                        dermalContact
                      });
                      alert("Prodotto aggiunto al carrello per l'ottimizzazione!");
                    } else {
                      alert("Inserisci almeno Nome Agente e CAS per salvare.");
                    }
                  }}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow"
                >
                  Aggiungi a Ottimizzazione
                </button>
                <button
                  onClick={async () => {
                    try {
                      console.log('Export button clicked');
                      const assessmentData = {
                        name: agentName,
                        cas: casNumber,
                        hCodes: selectedHCodes,
                        pScore,
                        physicalState,
                        quantity,
                        usageType,
                        controlType,
                        exposureTime,
                        distance,
                        dermalContact
                      };
                      console.log('Assessment data:', assessmentData);
                      await exportAssessmentToWord(assessmentData, null);
                      console.log('Export completed');
                    } catch (error) {
                      console.error('Export error:', error);
                      alert('Errore durante l\'esportazione: ' + error.message);
                    }
                  }}
                  className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium shadow flex items-center justify-center gap-2"
                >
                  <FileText size={20} />
                  Esporta Questa Valutazione (Word)
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};


// --- COMPONENTE PRINCIPALE CON AUTH ---
const AuthenticatedApp = () => {
  const { user, logout, company } = useAuth();
  const { addToInventory } = useData();
  const [view, setView] = useState('data');
  const [savedAssessments, setSavedAssessments] = useState([]);
  const [archivedReports, setArchivedReports] = useState([]);
  const { token } = useAuth(); // Get token for API calls

  // Load reports from Backend on mount or token change
  useEffect(() => {
    const fetchReports = async () => {
      if (token) {
        try {
          const res = await fetch('/api/reports', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setArchivedReports(data);
          }
        } catch (error) {
          console.error("Error fetching reports:", error);
        }
      } else {
        setArchivedReports([]);
      }
    };
    fetchReports();
  }, [token]);

  const addAssessment = (assessment) => {
    // Pulisci il CAS da spazi
    const cleanCas = assessment.cas.trim();
    const cleanAssessment = { ...assessment, cas: cleanCas };

    // Evita duplicati basati sul CAS
    if (!savedAssessments.find(a => a.cas === cleanCas)) {
      setSavedAssessments([...savedAssessments, cleanAssessment]);

      // Aggiungi automaticamente all'inventario se non esiste giÃ 
      // (Nota: in un'app reale controlleremmo se esiste giÃ  nell'inventario)
      addToInventory({
        name: cleanAssessment.name,
        cas: cleanCas,
        hCodes: [] // Qui non abbiamo le H-codes nell'assessment object, ma va bene per ora
      });
    }
  };

  const showToast = (message, type = 'success') => {
    // Create toast element
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 16px 24px;
      background: ${type === 'success' ? '#10b981' : '#f59e0b'};
      color: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      font-weight: 600;
      z-index: 9999;
      animation: slideIn 0.3s ease-out;
    `;

    // Add animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(toast);

    // Remove after 3 seconds
    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => {
        document.body.removeChild(toast);
        document.head.removeChild(style);
      }, 300);
    }, 3000);
  };

  const archiveReport = (report) => {
    console.log('archiveReport called with:', report);
    console.log('Current archivedReports:', archivedReports);

    // Check for duplicates by comparing chemicals and selected gloves
    const isDuplicate = archivedReports.some(archived => {
      // Compare chemicals (by CAS numbers)
      const sameChemicals = JSON.stringify(archived.chemicals?.map(c => c.cas).sort()) ===
        JSON.stringify(report.chemicals?.map(c => c.cas).sort());

      // Compare first selected glove (assuming single glove selection for now)
      const archivedGlove = archived.gloves?.[0];
      const currentGlove = report.gloves?.[0];

      const sameGlove = archivedGlove?.name === currentGlove?.name &&
        archivedGlove?.material === currentGlove?.material &&
        archivedGlove?.thickness === currentGlove?.thickness;

      console.log('Comparison:', {
        archived: {
          chemicals: archived.chemicals?.map(c => c.cas),
          glove: archivedGlove
        },
        current: {
          chemicals: report.chemicals?.map(c => c.cas),
          glove: currentGlove
        },
        sameChemicals,
        sameGlove,
        isDuplicate: sameChemicals && sameGlove
      });

      return sameChemicals && sameGlove;
    });

    if (isDuplicate) {
      console.log('Duplicate detected!');
      showToast('⚠️ Questa configurazione DPI è già presente nell\'archivio!', 'warning');
      return;
    }

    setArchivedReports([...archivedReports, { ...report, id: Date.now(), date: new Date().toLocaleString() }]);

    // Save to Backend
    if (token) {
      fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(report)
      })
        .then(res => res.json())
        .then(savedReport => {
          console.log('Report saved to backend:', savedReport);
          // Optionally update local state with server ID if needed, 
          // but we're re-fetching implies eventual consistency.
          // For better UX, we could replace the temp ID here.
        })
        .catch(err => console.error("Error saving report:", err));
    }

    console.log('Archive successful!');
    showToast('✅ Configurazione DPI archiviata con successo!', 'success');
  };

  const deleteReport = async (id) => {
    // Delete from Backend
    if (token) {
      try {
        await fetch(`/api/reports/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch (error) {
        console.error("Error deleting report:", error);
        showToast('Errore durante l\'eliminazione', 'error');
        return;
      }
    }
    setArchivedReports(archivedReports.filter(r => r.id !== id));
    showToast('Report eliminato', 'success');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Top Navigation Integrated into Header */}
      <div className="bg-blue-900 text-white p-4 shadow-lg pb-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Activity size={28} className="text-blue-300" />
            <div>
              <h1 className="text-xl font-bold">MoVaRisCh 2025</h1>
              <p className="text-xs text-blue-200 opacity-80">
                {company ? `${company.ragioneSociale}` : 'Modello Valutazione Rischio Chimico'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <div className="text-sm font-bold">{user?.nome} {user?.cognome}</div>
              <div className="text-xs text-blue-300">{user?.email}</div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 bg-blue-800 hover:bg-blue-700 px-3 py-1 rounded text-sm transition border border-blue-700"
            >
              Esci
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-4xl mx-auto flex gap-1">
          <button
            onClick={() => setView('calculator')}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-medium transition ${view === 'calculator' ? 'bg-slate-50 text-blue-900' : 'text-blue-200 hover:bg-blue-800 hover:text-white'}`}
          >
            <Activity size={16} /> Calcolatore
          </button>
          <button
            onClick={() => setView('optimizer')}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-medium transition ${view === 'optimizer' ? 'bg-slate-50 text-blue-900' : 'text-blue-200 hover:bg-blue-800 hover:text-white'}`}
          >
            <Shield size={16} /> Ottimizzatore DPI
          </button>
          <button
            onClick={() => setView('archive')}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-medium transition ${view === 'archive' ? 'bg-slate-50 text-blue-900' : 'text-blue-200 hover:bg-blue-800 hover:text-white'}`}
          >
            <FileText size={16} /> Archivio
          </button>
          <button
            onClick={() => setView('data')}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-medium transition ${view === 'data' ? 'bg-slate-50 text-blue-900' : 'text-blue-200 hover:bg-blue-800 hover:text-white'}`}
          >
            <Database size={16} /> Anagrafiche
          </button>
        </div>
      </div>

      {view === 'calculator' && (
        <MoVaRisChContent savedAssessments={savedAssessments} addAssessment={addAssessment} />
      )}
      {view === 'optimizer' && (
        <PPEOptimizer savedAssessments={savedAssessments} onArchive={archiveReport} />
      )}
      {view === 'archive' && (
        <ArchiveView reports={archivedReports} onDelete={deleteReport} />
      )}
      {view === 'data' && (
        <DataManagement />
      )}
    </div>
  );
};

const AppContent = () => {
  const { user, loading } = useAuth();
  const [authView, setAuthView] = useState('login'); // 'login' or 'register'

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-slate-500">Caricamento...</div>;
  }

  if (!user) {
    if (authView === 'register') {
      return <Register onNavigateToLogin={() => setAuthView('login')} />;
    }
    return <Login onNavigateToRegister={() => setAuthView('register')} />;
  }

  return <AuthenticatedApp />;
};

const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <DataProvider>
          <AppContent />
        </DataProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
