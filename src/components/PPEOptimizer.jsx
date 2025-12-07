import React, { useState, useMemo } from 'react';
import { Shield, AlertTriangle, CheckCircle, XCircle, Info, Edit2 } from 'lucide-react';
import ppeData from '../data/ppe_database.json';

const PPEOptimizer = ({ savedAssessments = [], onArchive, setEditingAssessment, setView }) => {
    // Helper function to normalize CAS numbers (remove leading zeros)
    const normalizeCAS = (cas) => {
        if (!cas) return '';
        return cas.split('-').map(part => parseInt(part, 10).toString()).join('-');
    };

    const [selectedChemicals, setSelectedChemicals] = useState([]);
    const [selectedGloves, setSelectedGloves] = useState([]);

    // Toggle glove selection
    const toggleGlove = (gloveId) => {
        if (selectedGloves.includes(gloveId)) {
            setSelectedGloves(selectedGloves.filter(id => id !== gloveId));
        } else {
            setSelectedGloves([...selectedGloves, gloveId]);
        }
    };

    // Handle archive
    const handleArchive = () => {
        if (selectedGloves.length === 0) {
            alert("Seleziona almeno un guanto da archiviare.");
            return;
        }

        console.log('Selected gloves IDs:', selectedGloves);
        console.log('PPE Data gloves:', ppeData.gloves);

        // Get workplace and role from the first selected assessment
        const firstAssessment = selectedChemicals.length > 0
            ? savedAssessments.find(a => a.cas === selectedChemicals[0])
            : savedAssessments[0];

        const report = {
            workplace: firstAssessment?.workplace || '',
            role: firstAssessment?.role || '',
            assessments: selectedChemicals.map(cas => {
                const assessment = savedAssessments.find(a => a.cas === cas);
                return assessment || { cas, name: 'Prodotto chimico' };
            }),
            chemicals: selectedChemicals.map(cas => {
                const assessment = savedAssessments.find(a => a.cas === cas);
                return {
                    cas: assessment?.cas || cas,
                    name: assessment?.name || 'Prodotto chimico'
                };
            }),
            gloves: selectedGloves.map(gloveId => {
                const glove = ppeData.gloves.find(g => g.id === gloveId);
                console.log(`Looking for glove ${gloveId}, found:`, glove);
                if (!glove) return null;
                return {
                    id: String(glove.id),
                    name: String(glove.name || 'N/A'),
                    material: String(glove.material || 'N/A'),
                    thickness: String(glove.thickness || 'N/A')
                };
            }).filter(g => g !== null)
        };

        console.log('Final report:', JSON.stringify(report, null, 2));
        onArchive(report);
    };

    // Show ONLY user-added chemicals (savedAssessments), not the entire database
    const availableChemicals = useMemo(() => {
        return savedAssessments;
    }, [savedAssessments]);

    // Helper to get chemical name
    const getChemicalName = (cas) => {
        const assessment = savedAssessments.find(a => a.cas === cas);
        return assessment?.name || cas;
    };

    // Toggle chemical selection
    const toggleChemical = (cas) => {
        if (selectedChemicals.includes(cas)) {
            setSelectedChemicals(selectedChemicals.filter(c => c !== cas));
        } else {
            setSelectedChemicals([...selectedChemicals, cas]);
        }
    };

    // Traffic light color helper
    const getTrafficLight = (color) => {
        const colors = {
            green: 'bg-green-500',
            yellow: 'bg-yellow-400',
            orange: 'bg-orange-500',
            red: 'bg-red-600',
            gray: 'bg-gray-400'
        };
        return colors[color] || 'bg-gray-400';
    };

    // Analyze gloves for selected chemicals
    const analysis = useMemo(() => {
        if (selectedChemicals.length === 0) return [];

        return ppeData.gloves.map(glove => {
            let minScore = 5; // Best possible (green)
            const details = [];

            selectedChemicals.forEach(cas => {
                const chemical = ppeData.chemicals.find(c => normalizeCAS(c.cas) === normalizeCAS(cas));
                const chemPercentage = chemical?.percentage || 100;

                // Try exact match first
                let perf = ppeData.performance.find(p =>
                    normalizeCAS(p.cas) === normalizeCAS(cas) &&
                    p.percentage === chemPercentage &&
                    p.gloveId === glove.id
                );

                // If no exact match, find best match (highest percentage)
                if (!perf) {
                    const allPerfsForCas = ppeData.performance.filter(p =>
                        normalizeCAS(p.cas) === normalizeCAS(cas) && p.gloveId === glove.id
                    );
                    if (allPerfsForCas.length > 0) {
                        perf = allPerfsForCas.sort((a, b) => b.percentage - a.percentage)[0];
                    }
                }

                if (perf) {
                    const colorScore = { green: 5, yellow: 3, orange: 2, red: 1, gray: 0 }[perf.color] || 0;
                    if (colorScore < minScore) minScore = colorScore;
                    details.push({ cas, time: perf.time, color: perf.color });
                } else {
                    minScore = 0;
                    details.push({ cas, time: 'N/A', color: 'gray' });
                }
            });

            return {
                id: glove.id,
                name: glove.name,
                material: glove.material,
                thickness: glove.thickness,
                minScore,
                details
            };
        }).sort((a, b) => b.minScore - a.minScore);
    }, [selectedChemicals, savedAssessments]);

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <Shield className="text-blue-600" />
                    Ottimizzatore DPI Multi-Prodotto
                </h2>
                <p className="text-slate-600">Seleziona i prodotti chimici presenti in reparto per trovare il guanto compatibile.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Chemical Selection */}
                <div className="md:col-span-1">
                    <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
                        <AlertTriangle className="text-orange-500" size={18} />
                        Inventario Chimico
                    </h3>

                    {availableChemicals.length === 0 ? (
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center text-slate-500">
                            <Info size={32} className="mx-auto mb-2 opacity-50" />
                            <p className="text-sm">Nessun prodotto chimico nel tuo inventario.</p>
                            <p className="text-xs mt-2">Aggiungi prodotti dal Calcolatore per iniziare.</p>
                        </div>
                    ) : (
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {availableChemicals.map(chem => (
                                <div
                                    key={chem.cas}
                                    onClick={() => toggleChemical(chem.cas)}
                                    className={`p-3 rounded-lg border cursor-pointer transition ${selectedChemicals.includes(chem.cas)
                                        ? 'bg-blue-50 border-blue-300'
                                        : 'bg-white border-slate-200 hover:border-blue-200'
                                        }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="font-medium text-slate-800 text-sm">{chem.name}</div>
                                            <div className="text-xs text-slate-500">CAS: {chem.cas}</div>
                                        </div>
                                        <div className="ml-2">
                                            {selectedChemicals.includes(chem.cas) ? (
                                                <CheckCircle className="text-blue-600" size={18} />
                                            ) : (
                                                <div className="w-4 h-4 border-2 border-slate-300 rounded"></div>
                                            )}
                                        </div>
                                    </div>
                                    {setEditingAssessment && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setEditingAssessment(chem);
                                                setView('calculator');
                                            }}
                                            className="mt-2 text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                        >
                                            <Edit2 size={12} /> Modifica
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Analysis Results */}
                <div className="md:col-span-2">
                    <h3 className="font-bold text-slate-700 mb-3">Analisi Compatibilità</h3>

                    {selectedChemicals.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl p-8">
                            <Info size={48} className="mb-4 opacity-50" />
                            <p>Seleziona almeno un prodotto per iniziare l'analisi.</p>
                        </div>
                    ) : (
                        <>
                            {/* Best Recommendation */}
                            {analysis[0].minScore >= 2 ? (
                                <div className="bg-green-50 border border-green-200 p-4 rounded-xl flex items-start gap-4 mb-4">
                                    <div className="bg-green-100 p-2 rounded-full">
                                        <CheckCircle className="text-green-600" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-green-900 text-lg">
                                            DPI Consigliato: {analysis[0].material === 'N/A' || analysis[0].thickness === 'N/A'
                                                ? `Guanto: ${analysis[0].name}`
                                                : `Guanto in ${analysis[0].material} (${analysis[0].thickness})`
                                            }
                                        </h3>
                                        <p className="text-green-800 text-sm mt-1">
                                            {analysis[0].material !== 'N/A' && analysis[0].thickness !== 'N/A' && (
                                                <><span className="font-medium">Esempio:</span> {analysis[0].name} <span className="italic opacity-80">(o equivalente)</span></>
                                            )}
                                        </p>
                                        <p className="text-green-800 text-xs mt-1 opacity-80">
                                            Offre una protezione adeguata per TUTTI i prodotti selezionati.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl flex items-start gap-4 mb-4">
                                    <div className="bg-orange-100 p-2 rounded-full">
                                        <AlertTriangle className="text-orange-600" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-orange-900 text-lg">Attenzione: Protezione Limitata</h3>
                                        <p className="text-orange-800 text-sm mt-1">
                                            Nessun guanto offre protezione ottimale per TUTTI i prodotti selezionati.
                                            Valuta l'uso di più guanti o riduci l'esposizione.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Matrix Table */}
                            <div className="bg-white rounded-xl shadow overflow-hidden border border-slate-200">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-50 text-slate-600 font-medium border-b">
                                        <tr>
                                            <th className="p-3 w-10">Sel.</th>
                                            <th className="p-3">Guanto / Materiale</th>
                                            {selectedChemicals.map(cas => {
                                                const name = getChemicalName(cas);
                                                return <th key={cas} className="p-3 w-32 truncate" title={name}>{name}</th>
                                            })}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {analysis.map(glove => (
                                            <tr key={glove.id} className={`hover:bg-slate-50 ${selectedGloves.includes(glove.id) ? 'bg-blue-50' : ''}`}>
                                                <td className="p-3 text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedGloves.includes(glove.id)}
                                                        onChange={() => toggleGlove(glove.id)}
                                                        className="w-4 h-4 text-blue-600 rounded"
                                                    />
                                                </td>
                                                <td className="p-3">
                                                    <div className="font-medium text-slate-800">
                                                        {glove.material === 'N/A' || glove.thickness === 'N/A'
                                                            ? glove.name
                                                            : `${glove.material} (${glove.thickness})`
                                                        }
                                                    </div>
                                                    {glove.material !== 'N/A' && glove.thickness !== 'N/A' && (
                                                        <div className="text-xs text-slate-500">{glove.name}</div>
                                                    )}
                                                </td>
                                                {glove.details.map((d, idx) => (
                                                    <td key={idx} className="p-3">
                                                        <div className="flex items-center gap-2">
                                                            <div className={`w-3 h-3 rounded-full ${getTrafficLight(d.color)}`}></div>
                                                            <span className="font-mono text-xs">{d.time}'</span>
                                                        </div>
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Archive Button */}
                            <div className="flex justify-end mt-4">
                                <button
                                    onClick={handleArchive}
                                    disabled={selectedGloves.length === 0}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold shadow-lg transition ${selectedGloves.length === 0
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-blue-900 text-white hover:bg-blue-800'
                                        }`}
                                >
                                    <Shield size={20} />
                                    Archivia Selezione DPI
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PPEOptimizer;
