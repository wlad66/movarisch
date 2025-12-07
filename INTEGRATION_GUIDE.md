# Guida all'Integrazione delle Matrici Visive

## Stato Attuale

✅ **Completato**:
- Creato file `src/components/RiskMatrices.jsx` con tutti e 5 i componenti delle matrici
- Aggiunto import in `App.jsx`

⏳ **Da Fare**:
- Sostituire i dropdown nello STEP 2 con le matrici
- Sostituire i radio button nello STEP 3 con Matrix5

---

## Istruzioni per l'Integrazione

### STEP 1: Verifica Import

Assicurati che in `App.jsx` alla riga 11 ci sia:

```javascript
import { Matrix1QuantityUse, Matrix2UsageType, Matrix3ControlType, Matrix4ExposureTime, Matrix5DermalExposure } from './src/components/RiskMatrices';
```

✅ **Fatto** - Import già aggiunto

---

### STEP 2: Modifica STEP 2 (Esposizione Inalatoria)

**Trova** (circa linea 415-474):
```javascript
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">1. Stato Fisico</label>
                  <select value={physicalState} onChange={(e) => setPhysicalState(Number(e.target.value))} className="w-full p-2 border rounded">
                    ...
                  </select>
                </div>
                ... (altri 5 dropdown)
              </div>
```

**Sostituisci con**:
```javascript
              {/* Matrici Visive */}
              <Matrix1QuantityUse 
                physicalState={physicalState}
                quantity={quantity}
                setPhysicalState={setPhysicalState}
                setQuantity={setQuantity}
                D_Index={D_Index}
              />
              
              <Matrix2UsageType 
                D_Index={D_Index}
                usageType={usageType}
                setUsageType={setUsageType}
                U_Index={U_Index}
              />
              
              <Matrix3ControlType 
                U_Index={U_Index}
                controlType={controlType}
                setControlType={setControlType}
                C_Index={C_Index}
              />
              
              <Matrix4ExposureTime 
                C_Index={C_Index}
                exposureTime={exposureTime}
                setExposureTime={setExposureTime}
                I_Val={I_Val}
              />
              
              {/* Distanza - mantieni il dropdown */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-1">Distanza dalla sorgente (d)</label>
                <select value={distance} onChange={(e) => setDistance(Number(e.target.value))} className="w-full p-2 border rounded">
                  <option value={1}>{'<'} 1m (Operatore)</option>
                  <option value={0.75}>1 - 3m</option>
                  <option value={0.50}>3 - 5m</option>
                  <option value={0.25}>5 - 10m</option>
                  <option value={0.10}>{'>'} 10m</option>
                </select>
              </div>
```

---

### STEP 3: Modifica STEP 3 (Esposizione Cutanea)

**Trova** (circa linea 500-530):
```javascript
                <div className="space-y-3">
                  {[
                    { val: 0, label: "Nessun Contatto", desc: "Impossibile" },
                    { val: 1, label: "Accidentale", desc: "Max 1 evento/gg" },
                    { val: 2, label: "Discontinuo", desc: "2-10 eventi/gg" },
                    { val: 3, label: "Esteso", desc: "> 10 eventi/gg" },
                  ].map((opt) => (
                    <div ... onClick={() => setDermalContact(opt.val)} ...>
                      ...
                    </div>
                  ))}
                </div>
```

**Sostituisci con**:
```javascript
                <Matrix5DermalExposure 
                  usageType={usageType}
                  dermalContact={dermalContact}
                  setDermalContact={setDermalContact}
                  calcECute={calcECute}
                />
```

---

## Come Procedere

### Opzione A: Modifica Manuale (Consigliata)

1. Apri `App.jsx` in un editor di testo
2. Cerca la sezione `{/* STEP 2 */}` (circa linea 408)
3. Trova il `<div className="grid md:grid-cols-2 gap-6">` (linea 415)
4. Seleziona tutto fino a `</div>` (linea 474)
5. Sostituisci con il codice fornito sopra
6. Ripeti per STEP 3

### Opzione B: Usa Trova e Sostituisci

1. Apri `App.jsx`
2. Usa Ctrl+H (Trova e Sostituisci)
3. Cerca: `<div className="grid md:grid-cols-2 gap-6">`
4. Verifica che sia nello STEP 2
5. Sostituisci manualmente quella sezione

---

## Verifica Funzionamento

Dopo le modifiche:

1. Salva `App.jsx`
2. Il server Vite dovrebbe ricaricare automaticamente
3. Vai su "Calcolatore"
4. Vai allo STEP 2
5. Dovresti vedere le matrici colorate invece dei dropdown
6. Clicca su una cella per selezionarla
7. Verifica che i valori D, U, C, I si aggiornino

---

## Risoluzione Problemi

### Errore: "Cannot find module RiskMatrices"
- Verifica che il file `src/components/RiskMatrices.jsx` esista
- Verifica l'import in `App.jsx`

### Le matrici non si vedono
- Controlla la console del browser per errori
- Verifica che tutti i props siano passati correttamente

### I colori non corrispondono
- Verifica che le matrici in `RiskMatrices.jsx` abbiano i colori corretti
- Confronta con le immagini di riferimento

---

## File Coinvolti

1. ✅ `src/components/RiskMatrices.jsx` - Componenti delle matrici (CREATO)
2. ✅ `App.jsx` - Import aggiunto (FATTO)
3. ⏳ `App.jsx` - STEP 2 da modificare (linee 415-474)
4. ⏳ `App.jsx` - STEP 3 da modificare (linee 500-530)

---

**Nota**: A causa di problemi con i caratteri speciali (à, ì) nel file, non sono riuscito a fare le sostituzioni automaticamente. Segui questa guida per completare l'integrazione manualmente.
