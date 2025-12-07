import React from 'react';

// Componente per Matrice 1: Quantità in Uso
export const Matrix1QuantityUse = ({ physicalState, quantity, setPhysicalState, setQuantity, D_Index }) => {
    return (
        <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-3">
                Matrice 1: Quantità in Uso (Disponibilità D)
            </label>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-slate-300 text-xs">
                    <thead>
                        <tr className="bg-slate-200">
                            <th className="border border-slate-300 p-2 font-bold text-slate-700 text-left">
                                PROPRIETÀ<br />CHIMICO-FISICHE
                            </th>
                            <th colSpan="5" className="border border-slate-300 p-2 font-bold text-slate-700 text-center">
                                QUANTITÀ IN USO
                            </th>
                        </tr>
                        <tr className="bg-slate-100">
                            <th className="border border-slate-300 p-2"></th>
                            <th className="border border-slate-300 p-2 font-medium text-slate-600">&lt; 0,1 Kg</th>
                            <th className="border border-slate-300 p-2 font-medium text-slate-600">0,1 ÷ 1 kg</th>
                            <th className="border border-slate-300 p-2 font-medium text-slate-600">1 ÷ 10 Kg</th>
                            <th className="border border-slate-300 p-2 font-medium text-slate-600">10 ÷ 100 Kg</th>
                            <th className="border border-slate-300 p-2 font-medium text-slate-600">&gt; 100 kg</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Solido/nebbia */}
                        <tr>
                            <td className="border border-slate-300 p-2 font-medium text-slate-700">Solido/nebbia</td>
                            {[0, 1, 2, 3, 4].map(q => (
                                <td
                                    key={q}
                                    onClick={() => { setPhysicalState(0); setQuantity(q); }}
                                    className={`border border-slate-300 p-3 font-bold text-center cursor-pointer transition ${physicalState === 0 && quantity === q ? 'ring-2 ring-blue-500 ring-inset' : ''
                                        } ${q <= 2 ? 'bg-cyan-400 hover:bg-cyan-300' : 'bg-yellow-300 hover:bg-yellow-200'}`}
                                >
                                    {q <= 2 ? 'Bassa' : 'Medio/bassa'}
                                </td>
                            ))}
                        </tr>

                        {/* Bassa volatilità */}
                        <tr>
                            <td className="border border-slate-300 p-2 font-medium text-slate-700">Bassa volatilità</td>
                            <td
                                onClick={() => { setPhysicalState(1); setQuantity(0); }}
                                className={`border border-slate-300 p-3 font-bold text-center cursor-pointer transition ${physicalState === 1 && quantity === 0 ? 'ring-2 ring-blue-500 ring-inset' : ''
                                    } bg-cyan-400 hover:bg-cyan-300`}
                            >
                                Bassa
                            </td>
                            <td
                                onClick={() => { setPhysicalState(1); setQuantity(1); }}
                                className={`border border-slate-300 p-3 font-bold text-center cursor-pointer transition ${physicalState === 1 && quantity === 1 ? 'ring-2 ring-blue-500 ring-inset' : ''
                                    } bg-yellow-300 hover:bg-yellow-200`}
                            >
                                Medio/bassa
                            </td>
                            <td
                                onClick={() => { setPhysicalState(1); setQuantity(2); }}
                                className={`border border-slate-300 p-3 font-bold text-center cursor-pointer transition ${physicalState === 1 && quantity === 2 ? 'ring-2 ring-blue-500 ring-inset' : ''
                                    } bg-green-500 text-white hover:bg-green-400`}
                            >
                                Medio/alta
                            </td>
                            <td
                                onClick={() => { setPhysicalState(1); setQuantity(3); }}
                                className={`border border-slate-300 p-3 font-bold text-center cursor-pointer transition ${physicalState === 1 && quantity === 3 ? 'ring-2 ring-blue-500 ring-inset' : ''
                                    } bg-green-600 text-white hover:bg-green-500`}
                            >
                                Medio/alta
                            </td>
                            <td
                                onClick={() => { setPhysicalState(1); setQuantity(4); }}
                                className={`border border-slate-300 p-3 font-bold text-center cursor-pointer transition ${physicalState === 1 && quantity === 4 ? 'ring-2 ring-blue-500 ring-inset' : ''
                                    } bg-fuchsia-500 text-white hover:bg-fuchsia-400`}
                            >
                                Alta
                            </td>
                        </tr>

                        {/* Media/alta volatilità e polveri fini */}
                        <tr>
                            <td className="border border-slate-300 p-2 font-medium text-slate-700">Media/alta volatilità e polveri fini</td>
                            <td
                                onClick={() => { setPhysicalState(2); setQuantity(0); }}
                                className={`border border-slate-300 p-3 font-bold text-center cursor-pointer transition ${physicalState === 2 && quantity === 0 ? 'ring-2 ring-blue-500 ring-inset' : ''
                                    } bg-cyan-400 hover:bg-cyan-300`}
                            >
                                Bassa
                            </td>
                            {[1, 2].map(q => (
                                <td
                                    key={q}
                                    onClick={() => { setPhysicalState(2); setQuantity(q); }}
                                    className={`border border-slate-300 p-3 font-bold text-center cursor-pointer transition ${physicalState === 2 && quantity === q ? 'ring-2 ring-blue-500 ring-inset' : ''
                                        } bg-green-500 text-white hover:bg-green-400`}
                                >
                                    Medio/alta
                                </td>
                            ))}
                            {[3, 4].map(q => (
                                <td
                                    key={q}
                                    onClick={() => { setPhysicalState(2); setQuantity(q); }}
                                    className={`border border-slate-300 p-3 font-bold text-center cursor-pointer transition ${physicalState === 2 && quantity === q ? 'ring-2 ring-blue-500 ring-inset' : ''
                                        } bg-fuchsia-500 text-white hover:bg-fuchsia-400`}
                                >
                                    Alta
                                </td>
                            ))}
                        </tr>

                        {/* Stato gassoso */}
                        <tr>
                            <td className="border border-slate-300 p-2 font-medium text-slate-700">Stato gassoso</td>
                            <td
                                onClick={() => { setPhysicalState(3); setQuantity(0); }}
                                className={`border border-slate-300 p-3 font-bold text-center cursor-pointer transition ${physicalState === 3 && quantity === 0 ? 'ring-2 ring-blue-500 ring-inset' : ''
                                    } bg-yellow-300 hover:bg-yellow-200`}
                            >
                                Medio/bassa
                            </td>
                            <td
                                onClick={() => { setPhysicalState(3); setQuantity(1); }}
                                className={`border border-slate-300 p-3 font-bold text-center cursor-pointer transition ${physicalState === 3 && quantity === 1 ? 'ring-2 ring-blue-500 ring-inset' : ''
                                    } bg-green-500 text-white hover:bg-green-400`}
                            >
                                Medio/alta
                            </td>
                            {[2, 3, 4].map(q => (
                                <td
                                    key={q}
                                    onClick={() => { setPhysicalState(3); setQuantity(q); }}
                                    className={`border border-slate-300 p-3 font-bold text-center cursor-pointer transition ${physicalState === 3 && quantity === q ? 'ring-2 ring-blue-500 ring-inset' : ''
                                        } bg-fuchsia-500 text-white hover:bg-fuchsia-400`}
                                >
                                    Alta
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Legenda */}
            <div className="mt-3 border border-slate-300 rounded-lg overflow-hidden text-xs">
                <div className="bg-slate-100 p-2 font-bold text-slate-700 text-center border-b border-slate-300">
                    Valori dell'indicatore di disponibilità (D)
                </div>
                <div className="grid grid-cols-4 divide-x divide-slate-300">
                    <div className="p-2 text-center">Bassa à D = 1</div>
                    <div className="p-2 text-center">Medio/Bassa à D = 2</div>
                    <div className="p-2 text-center">Medio/Alta à D = 3</div>
                    <div className="p-2 text-center">Alta à D = 4</div>
                </div>
            </div>

            {/* Indicatore D calcolato */}
            <div className="mt-3 bg-blue-50 p-3 rounded-lg border border-blue-200 text-center">
                <span className="text-sm text-blue-800 font-medium">D (Disponibilità) = </span>
                <span className="text-2xl font-bold text-blue-900">{D_Index}</span>
            </div>
        </div>
    );
};

// Componente per Matrice 2: Tipologia d'Uso
export const Matrix2UsageType = ({ D_Index, usageType, setUsageType, U_Index }) => {
    const usageTypes = ['Sistema chiuso', 'Inclusione in matrice', 'Uso controllato', 'Uso dispersivo'];

    // Matrice colori basata su D e usageType
    const getColor = (d, u) => {
        const matrix = [
            ['bg-cyan-400', 'bg-cyan-400', 'bg-cyan-400', 'bg-yellow-300'], // D=1
            ['bg-cyan-400', 'bg-yellow-300', 'bg-green-500 text-white', 'bg-fuchsia-500 text-white'], // D=2
            ['bg-cyan-400', 'bg-yellow-300', 'bg-fuchsia-500 text-white', 'bg-fuchsia-500 text-white'], // D=3
            ['bg-yellow-300', 'bg-fuchsia-500 text-white', 'bg-fuchsia-500 text-white', 'bg-fuchsia-500 text-white'] // D=4
        ];
        return matrix[d - 1]?.[u] || 'bg-gray-200';
    };

    const getLabel = (d, u) => {
        const matrix = [
            ['Basso', 'Basso', 'Basso', 'Medio'], // D=1
            ['Basso', 'Medio', 'Medio', 'Alto'], // D=2
            ['Basso', 'Medio', 'Alto', 'Alto'], // D=3
            ['Medio', 'Alto', 'Alto', 'Alto'] // D=4
        ];
        return matrix[d - 1]?.[u] || '-';
    };

    return (
        <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-3">
                Matrice 2: Tipologia d'Uso (Uso U)
            </label>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-slate-300 text-xs">
                    <thead>
                        <tr className="bg-slate-200">
                            <th className="border border-slate-300 p-2 font-bold text-slate-700 text-center" rowSpan="2">
                                D
                            </th>
                            <th colSpan="4" className="border border-slate-300 p-2 font-bold text-slate-700 text-center">
                                TIPOLOGIA D'USO
                            </th>
                        </tr>
                        <tr className="bg-slate-100">
                            {usageTypes.map((type, idx) => (
                                <th key={idx} className="border border-slate-300 p-2 font-medium text-slate-600">{type}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {[1, 2, 3, 4].map(d => (
                            <tr key={d}>
                                <td className="border border-slate-300 p-2 font-bold text-center bg-slate-100">D = {d}</td>
                                {[0, 1, 2, 3].map(u => (
                                    <td
                                        key={u}
                                        onClick={() => setUsageType(u)}
                                        className={`border border-slate-300 p-3 font-bold text-center cursor-pointer transition ${D_Index === d && usageType === u ? 'ring-2 ring-blue-500 ring-inset' : ''
                                            } ${getColor(d, u)} ${D_Index !== d ? 'opacity-40 cursor-not-allowed' : 'hover:opacity-80'}`}
                                    >
                                        {getLabel(d, u)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Legenda */}
            <div className="mt-3 border border-slate-300 rounded-lg overflow-hidden text-xs">
                <div className="bg-slate-100 p-2 font-bold text-slate-700 text-center border-b border-slate-300">
                    Valori dell'indicatore d'uso (U)
                </div>
                <div className="grid grid-cols-3 divide-x divide-slate-300">
                    <div className="p-2 text-center">Basso à U = 1</div>
                    <div className="p-2 text-center">Medio à U = 2</div>
                    <div className="p-2 text-center">Alto à U = 3</div>
                </div>
            </div>

            {/* Indicatore U calcolato */}
            <div className="mt-3 bg-blue-50 p-3 rounded-lg border border-blue-200 text-center">
                <span className="text-sm text-blue-800 font-medium">U (Uso) = </span>
                <span className="text-2xl font-bold text-blue-900">{U_Index}</span>
            </div>
        </div>
    );
};

// Componente per Matrice 3: Tipologia di Controllo
export const Matrix3ControlType = ({ U_Index, controlType, setControlType, C_Index }) => {
    const controlTypes = ['Contenimento completo', 'Aspirazione localizzata', 'Segregazione/separazione', 'Diluizione/Ventilazione', 'Manipolazione diretta'];

    const getColor = (u, c) => {
        const matrix = [
            ['bg-cyan-400', 'bg-cyan-400', 'bg-cyan-400', 'bg-yellow-300', 'bg-yellow-300'], // U=1
            ['bg-cyan-400', 'bg-yellow-300', 'bg-yellow-300', 'bg-fuchsia-500 text-white', 'bg-fuchsia-500 text-white'], // U=2
            ['bg-cyan-400', 'bg-yellow-300', 'bg-fuchsia-500 text-white', 'bg-fuchsia-500 text-white', 'bg-fuchsia-500 text-white'] // U=3
        ];
        return matrix[u - 1]?.[c] || 'bg-gray-200';
    };

    const getLabel = (u, c) => {
        const matrix = [
            ['Basso', 'Basso', 'Basso', 'Medio', 'Medio'], // U=1
            ['Basso', 'Medio', 'Medio', 'Alto', 'Alto'], // U=2
            ['Basso', 'Medio', 'Alto', 'Alto', 'Alto'] // U=3
        ];
        return matrix[u - 1]?.[c] || '-';
    };

    return (
        <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-3">
                Matrice 3: Tipologia di Controllo (Compensazione C)
            </label>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-slate-300 text-xs">
                    <thead>
                        <tr className="bg-slate-200">
                            <th className="border border-slate-300 p-2 font-bold text-slate-700 text-center" rowSpan="2">
                                U
                            </th>
                            <th colSpan="5" className="border border-slate-300 p-2 font-bold text-slate-700 text-center">
                                TIPOLOGIA DI CONTROLLO
                            </th>
                        </tr>
                        <tr className="bg-slate-100">
                            {controlTypes.map((type, idx) => (
                                <th key={idx} className="border border-slate-300 p-2 font-medium text-slate-600 text-xs">{type}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {[1, 2, 3].map(u => (
                            <tr key={u}>
                                <td className="border border-slate-300 p-2 font-bold text-center bg-slate-100">U = {u}</td>
                                {[0, 1, 2, 3, 4].map(c => (
                                    <td
                                        key={c}
                                        onClick={() => setControlType(c)}
                                        className={`border border-slate-300 p-3 font-bold text-center cursor-pointer transition ${U_Index === u && controlType === c ? 'ring-2 ring-blue-500 ring-inset' : ''
                                            } ${getColor(u, c)} ${U_Index !== u ? 'opacity-40 cursor-not-allowed' : 'hover:opacity-80'}`}
                                    >
                                        {getLabel(u, c)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Legenda */}
            <div className="mt-3 border border-slate-300 rounded-lg overflow-hidden text-xs">
                <div className="bg-slate-100 p-2 font-bold text-slate-700 text-center border-b border-slate-300">
                    Valori dell'indicatore di compensazione (C)
                </div>
                <div className="grid grid-cols-3 divide-x divide-slate-300">
                    <div className="p-2 text-center">Basso à C = 1</div>
                    <div className="p-2 text-center">Medio à C = 2</div>
                    <div className="p-2 text-center">Alto à C = 3</div>
                </div>
            </div>

            {/* Indicatore C calcolato */}
            <div className="mt-3 bg-blue-50 p-3 rounded-lg border border-blue-200 text-center">
                <span className="text-sm text-blue-800 font-medium">C (Compensazione) = </span>
                <span className="text-2xl font-bold text-blue-900">{C_Index}</span>
            </div>
        </div>
    );
};

// Componente per Matrice 4: Tempo di Esposizione
export const Matrix4ExposureTime = ({ C_Index, exposureTime, setExposureTime, I_Val }) => {
    const timeRanges = ['< 15 min', '15 min ÷ 2 ore', '2 ore ÷ 4 ore', '4 ore ÷ 6 ore', '> 6 ore'];

    const getColor = (c, t) => {
        const matrix = [
            ['bg-cyan-400', 'bg-cyan-400', 'bg-yellow-300', 'bg-yellow-300', 'bg-green-500 text-white'], // C=1
            ['bg-cyan-400', 'bg-yellow-300', 'bg-green-500 text-white', 'bg-green-600 text-white', 'bg-fuchsia-500 text-white'], // C=2
            ['bg-yellow-300', 'bg-green-500 text-white', 'bg-fuchsia-500 text-white', 'bg-fuchsia-500 text-white', 'bg-fuchsia-500 text-white'] // C=3
        ];
        return matrix[c - 1]?.[t] || 'bg-gray-200';
    };

    const getLabel = (c, t) => {
        const matrix = [
            ['Bassa', 'Bassa', 'Medio/bassa', 'Medio/bassa', 'Medio/alta'], // C=1
            ['Bassa', 'Medio/bassa', 'Medio/alta', 'Medio/alta', 'Alta'], // C=2
            ['Medio/bassa', 'Medio/alta', 'Alta', 'Alta', 'Alta'] // C=3
        ];
        return matrix[c - 1]?.[t] || '-';
    };

    return (
        <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-3">
                Matrice 4: Tempo di Esposizione (Intensità I)
            </label>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-slate-300 text-xs">
                    <thead>
                        <tr className="bg-slate-200">
                            <th className="border border-slate-300 p-2 font-bold text-slate-700 text-center" rowSpan="2">
                                C
                            </th>
                            <th colSpan="5" className="border border-slate-300 p-2 font-bold text-slate-700 text-center">
                                TEMPO DI ESPOSIZIONE
                            </th>
                        </tr>
                        <tr className="bg-slate-100">
                            {timeRanges.map((range, idx) => (
                                <th key={idx} className="border border-slate-300 p-2 font-medium text-slate-600">{range}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {[1, 2, 3].map(c => (
                            <tr key={c}>
                                <td className="border border-slate-300 p-2 font-bold text-center bg-slate-100">C = {c}</td>
                                {[0, 1, 2, 3, 4].map(t => (
                                    <td
                                        key={t}
                                        onClick={() => setExposureTime(t)}
                                        className={`border border-slate-300 p-3 font-bold text-center cursor-pointer transition ${C_Index === c && exposureTime === t ? 'ring-2 ring-blue-500 ring-inset' : ''
                                            } ${getColor(c, t)} ${C_Index !== c ? 'opacity-40 cursor-not-allowed' : 'hover:opacity-80'}`}
                                    >
                                        {getLabel(c, t)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Legenda */}
            <div className="mt-3 border border-slate-300 rounded-lg overflow-hidden text-xs">
                <div className="bg-slate-100 p-2 font-bold text-slate-700 text-center border-b border-slate-300">
                    Valori del sub-indice di Intensità (I)
                </div>
                <div className="grid grid-cols-4 divide-x divide-slate-300">
                    <div className="p-2 text-center">Bassa à I = 1</div>
                    <div className="p-2 text-center">Medio/Bassa à I = 3</div>
                    <div className="p-2 text-center">Medio/Alta à I = 7</div>
                    <div className="p-2 text-center">Alto à I = 10</div>
                </div>
            </div>

            {/* Indicatore I calcolato */}
            <div className="mt-3 bg-blue-50 p-3 rounded-lg border border-blue-200 text-center">
                <span className="text-sm text-blue-800 font-medium">I (Intensità) = </span>
                <span className="text-2xl font-bold text-blue-900">{I_Val}</span>
            </div>
        </div>
    );
};

// Componente per Matrice 5: Esposizione Cutanea
export const Matrix5DermalExposure = ({ usageType, dermalContact, setDermalContact, calcECute }) => {
    const usageTypes = ['Sistema chiuso', 'Inclusione in matrice', 'Uso controllato', 'Uso dispersivo'];
    const contactLevels = ['Nessun contatto', 'Contatto accidentale', 'Contatto discontinuo', 'Contatto esteso'];

    const getColor = (u, c) => {
        const matrix = [
            ['bg-cyan-400', 'bg-cyan-400', 'bg-yellow-300', 'bg-fuchsia-500 text-white'], // Sistema chiuso
            ['bg-cyan-400', 'bg-yellow-300', 'bg-yellow-300', 'bg-fuchsia-500 text-white'], // Inclusione
            ['bg-cyan-400', 'bg-yellow-300', 'bg-fuchsia-500 text-white', 'bg-red-600 text-white'], // Controllato
            ['bg-cyan-400', 'bg-fuchsia-500 text-white', 'bg-fuchsia-500 text-white', 'bg-red-600 text-white'] // Dispersivo
        ];
        return matrix[u]?.[c] || 'bg-gray-200';
    };

    const getLabel = (u, c) => {
        const matrix = [
            ['Basso', 'Basso', 'Medio', 'Alto'], // Sistema chiuso
            ['Basso', 'Medio', 'Medio', 'Alto'], // Inclusione
            ['Basso', 'Medio', 'Alto', 'Molto alto'], // Controllato
            ['Basso', 'Alto', 'Alto', 'Molto alto'] // Dispersivo
        ];
        return matrix[u]?.[c] || '-';
    };

    return (
        <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-3">
                Matrice 5: Esposizione Cutanea (E_cute)
            </label>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-slate-300 text-xs">
                    <thead>
                        <tr className="bg-slate-200">
                            <th className="border border-slate-300 p-2 font-bold text-slate-700 text-center" rowSpan="2">
                                Tipologia d'uso
                            </th>
                            <th colSpan="4" className="border border-slate-300 p-2 font-bold text-slate-700 text-center">
                                ESPOSIZIONE CUTANEA
                            </th>
                        </tr>
                        <tr className="bg-slate-100">
                            {contactLevels.map((level, idx) => (
                                <th key={idx} className="border border-slate-300 p-2 font-medium text-slate-600">{level}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {usageTypes.map((type, u) => (
                            <tr key={u}>
                                <td className="border border-slate-300 p-2 font-medium text-slate-700 bg-slate-100">{type}</td>
                                {[0, 1, 2, 3].map(c => (
                                    <td
                                        key={c}
                                        onClick={() => setDermalContact(c)}
                                        className={`border border-slate-300 p-3 font-bold text-center cursor-pointer transition ${usageType === u && dermalContact === c ? 'ring-2 ring-blue-500 ring-inset' : ''
                                            } ${getColor(u, c)} ${usageType !== u ? 'opacity-40 cursor-not-allowed' : 'hover:opacity-80'}`}
                                    >
                                        {getLabel(u, c)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Legenda */}
            <div className="mt-3 border border-slate-300 rounded-lg overflow-hidden text-xs">
                <div className="bg-slate-100 p-2 font-bold text-slate-700 text-center border-b border-slate-300">
                    Valori da assegnare ad E_cute
                </div>
                <div className="grid grid-cols-4 divide-x divide-slate-300">
                    <div className="p-2 text-center">Basso à E_cute = 1</div>
                    <div className="p-2 text-center">Medio à E_cute = 3</div>
                    <div className="p-2 text-center">Alto à E_cute = 7</div>
                    <div className="p-2 text-center">Molto alto à E_cute = 10</div>
                </div>
            </div>

            {/* Indicatore E_cute calcolato */}
            <div className="mt-3 bg-purple-50 p-3 rounded-lg border border-purple-200 text-center">
                <span className="text-sm text-purple-800 font-medium">E_cute (Esposizione Cutanea) = </span>
                <span className="text-2xl font-bold text-purple-900">{calcECute}</span>
            </div>
        </div>
    );
};

// Esporta tutti i componenti
export default { Matrix1QuantityUse, Matrix2UsageType, Matrix3ControlType, Matrix4ExposureTime, Matrix5DermalExposure };
