import React, { useState } from 'react';
import './LegalAgreement.css';

const LegalAgreement = ({ onAccept }) => {
    const [activeTab, setActiveTab] = useState('terms');
    const [agreements, setAgreements] = useState({
        termsAccepted: false,
        privacyAccepted: false,
        disclaimerAccepted: false,
        professionalConfirmed: false
    });

    const handleCheckboxChange = (field) => {
        setAgreements(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const allAccepted = agreements.termsAccepted &&
                       agreements.privacyAccepted &&
                       agreements.disclaimerAccepted &&
                       agreements.professionalConfirmed;

    const handleProceed = () => {
        if (allAccepted) {
            onAccept(agreements);
        }
    };

    const renderTermsContent = () => (
        <div className="legal-content">
            <h2>Termini e Condizioni d'Uso - MoVaRisCh</h2>
            <p><strong>Versione:</strong> 1.0 | <strong>Data:</strong> 7 Dicembre 2025</p>

            <h3>1. Accettazione dei Termini</h3>
            <p>
                Utilizzando l'applicazione web <strong>MoVaRisCh</strong>, l'utente accetta integralmente
                e senza riserve i presenti Termini e Condizioni d'Uso. Se non si accettano questi Termini,
                si prega di non utilizzare l'Applicazione.
            </p>

            <h3>2. Descrizione del Servizio</h3>
            <p>MoVaRisCh è un'applicazione web professionale per:</p>
            <ul>
                <li>La valutazione del rischio chimico secondo il metodo MoVaRisCh</li>
                <li>La selezione ottimale dei Dispositivi di Protezione Individuale (DPI) - guanti</li>
                <li>La gestione dell'inventario delle sostanze chimiche</li>
                <li>La generazione di report professionali in formato DOCX</li>
            </ul>
            <p>
                L'Applicazione è destinata esclusivamente a <strong>professionisti qualificati</strong> nel
                campo della sicurezza sul lavoro e della valutazione del rischio chimico.
            </p>

            <h3>3. Proprietà Intellettuale</h3>
            <p>
                Tutti i diritti di proprietà intellettuale relativi all'Applicazione rimangono di esclusiva
                proprietà di <strong>TOKEM LLC</strong> (Safety Pro Suite).
            </p>

            <h3>4. Limitazione di Responsabilità</h3>
            <p>
                <strong>TOKEM LLC (Safety Pro Suite) non sarà responsabile per:</strong>
            </p>
            <ul>
                <li>Decisioni prese basandosi sui risultati dell'Applicazione</li>
                <li>Errori nei dati di input forniti dall'utente</li>
                <li>Danni diretti o indiretti derivanti dall'uso dell'Applicazione</li>
            </ul>

            <h3>5. Contatti</h3>
            <p>
                <strong>TOKEM LLC</strong><br/>
                5500 BENTGRASS DR UNIT 301<br/>
                34235 SARASOTA (FL) - U.S.A.<br/>
                Email: info@safetyprosuite.com<br/>
                FEI/EIN: 84-1930240
            </p>
        </div>
    );

    const renderPrivacyContent = () => (
        <div className="legal-content">
            <h2>Informativa sulla Privacy - MoVaRisCh</h2>
            <p><strong>Versione:</strong> 1.0 | <strong>Data:</strong> 7 Dicembre 2025</p>

            <h3>1. Titolare del Trattamento</h3>
            <p>
                <strong>TOKEM LLC (Safety Pro Suite)</strong><br/>
                5500 BENTGRASS DR UNIT 301<br/>
                34235 SARASOTA (FL) - U.S.A.<br/>
                Email: info@safetyprosuite.com<br/>
                FEI/EIN: 84-1930240
            </p>
            <p><strong>DPO:</strong> privacy@safetyprosuite.com</p>

            <h3>2. Dati Personali Raccolti</h3>
            <p><strong>Durante la Registrazione:</strong></p>
            <ul>
                <li>Email</li>
                <li>Password (criptata con bcrypt)</li>
                <li>Nome azienda</li>
                <li>Partita IVA / Codice Fiscale</li>
            </ul>

            <h3>3. Base Giuridica del Trattamento</h3>
            <ul>
                <li><strong>Esecuzione del contratto</strong> (Art. 6.1.b GDPR)</li>
                <li><strong>Obblighi legali</strong> (Art. 6.1.c GDPR - D.Lgs. 81/08)</li>
                <li><strong>Legittimo interesse</strong> (Art. 6.1.f GDPR)</li>
            </ul>

            <h3>4. Diritti dell'Interessato (GDPR)</h3>
            <p>Hai diritto di:</p>
            <ul>
                <li><strong>Accesso</strong> ai tuoi dati (Art. 15)</li>
                <li><strong>Rettifica</strong> dei dati errati (Art. 16)</li>
                <li><strong>Cancellazione</strong> (diritto all'oblio) (Art. 17)</li>
                <li><strong>Portabilità</strong> dei dati (Art. 20)</li>
                <li><strong>Opposizione</strong> al trattamento (Art. 21)</li>
                <li><strong>Reclamo</strong> al Garante Privacy (Art. 77)</li>
            </ul>

            <h3>5. Misure di Sicurezza</h3>
            <ul>
                <li>Password criptate con <strong>bcrypt</strong></li>
                <li>Autenticazione tramite <strong>JWT</strong></li>
                <li>Connessione <strong>HTTPS</strong></li>
                <li>Database protetto</li>
            </ul>

            <h3>6. Periodo di Conservazione</h3>
            <p>
                I dati sono conservati per tutta la durata del rapporto contrattuale e per 10 anni
                successivi alla cessazione (obbligo D.Lgs. 81/08).
            </p>
        </div>
    );

    const renderDisclaimerContent = () => (
        <div className="legal-content">
            <h2>⚠️ Disclaimer di Responsabilità - MoVaRisCh</h2>
            <p><strong>Versione:</strong> 1.0 | <strong>Data:</strong> 7 Dicembre 2025</p>

            <div className="warning-box">
                <h3>⚠️ AVVISO IMPORTANTE</h3>
                <p>
                    L'applicazione web <strong>MoVaRisCh</strong> è uno <strong>strumento di supporto decisionale</strong> destinato
                    esclusivamente a <strong>professionisti qualificati</strong> in materia di sicurezza sul lavoro e
                    valutazione del rischio chimico.
                </p>
            </div>

            <h3>L'utilizzo dell'Applicazione NON sostituisce:</h3>
            <ul>
                <li>La competenza professionale dell'utente</li>
                <li>La consultazione della normativa vigente</li>
                <li>Il parere del medico competente</li>
                <li>Valutazioni specifiche del contesto lavorativo</li>
                <li>Analisi strumentali quando richieste</li>
            </ul>

            <h3>Esclusione di Responsabilità</h3>
            <p><strong>TOKEM LLC (Safety Pro Suite) NON sarà in alcun modo responsabile per:</strong></p>
            <ul>
                <li>Decisioni prese dall'utente basandosi sui risultati dell'Applicazione</li>
                <li>Selezione inappropriata di DPI</li>
                <li>Valutazioni del rischio errate dovute a:
                    <ul>
                        <li>Parametri di input errati forniti dall'utente</li>
                        <li>Mancata considerazione di fattori specifici del contesto lavorativo</li>
                        <li>Interpretazione errata dei risultati</li>
                    </ul>
                </li>
                <li>Incidenti o infortuni sul lavoro</li>
                <li>Sanzioni amministrative o penali per non conformità normativa</li>
                <li>Contenziosi legali derivanti dall'uso dell'Applicazione</li>
            </ul>

            <h3>Responsabilità Finale</h3>
            <div className="important-box">
                <p>
                    <strong>La responsabilità finale della valutazione del rischio chimico e della selezione
                    dei DPI rimane sempre e comunque dell'utente professionista e/o del datore di lavoro</strong>,
                    in conformità con quanto previsto dal D.Lgs. 81/08 e s.m.i.
                </p>
            </div>

            <h3>Normativa di Riferimento</h3>
            <ul>
                <li><strong>D.Lgs. 81/2008</strong> e s.m.i. (Testo Unico sulla Salute e Sicurezza sul Lavoro)</li>
                <li><strong>Regolamento CLP</strong> (Reg. CE 1272/2008)</li>
                <li><strong>Regolamento REACH</strong> (Reg. CE 1907/2006)</li>
            </ul>

            <div className="final-warning">
                <p>
                    <strong>PER LA SALUTE E SICUREZZA DEI LAVORATORI: UTILIZZARE SEMPRE IL BUON SENSO
                    PROFESSIONALE E NON AFFIDARSI MAI ESCLUSIVAMENTE A UNO STRUMENTO INFORMATICO.</strong>
                </p>
            </div>
        </div>
    );

    return (
        <div className="legal-agreement-container">
            <div className="legal-header">
                <h1>📋 Documenti Legali Obbligatori</h1>
                <p>Prima di registrarti, devi leggere e accettare i seguenti documenti:</p>
            </div>

            <div className="legal-tabs">
                <button
                    className={`tab ${activeTab === 'terms' ? 'active' : ''}`}
                    onClick={() => setActiveTab('terms')}
                >
                    📄 Termini e Condizioni
                </button>
                <button
                    className={`tab ${activeTab === 'privacy' ? 'active' : ''}`}
                    onClick={() => setActiveTab('privacy')}
                >
                    🔒 Privacy Policy
                </button>
                <button
                    className={`tab ${activeTab === 'disclaimer' ? 'active' : ''}`}
                    onClick={() => setActiveTab('disclaimer')}
                >
                    ⚠️ Disclaimer
                </button>
            </div>

            <div className="legal-document">
                {activeTab === 'terms' && renderTermsContent()}
                {activeTab === 'privacy' && renderPrivacyContent()}
                {activeTab === 'disclaimer' && renderDisclaimerContent()}
            </div>

            <div className="legal-checkboxes">
                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        checked={agreements.termsAccepted}
                        onChange={() => handleCheckboxChange('termsAccepted')}
                    />
                    <span>
                        ✅ Ho letto e accetto i <strong>Termini e Condizioni d'Uso</strong>
                    </span>
                </label>

                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        checked={agreements.privacyAccepted}
                        onChange={() => handleCheckboxChange('privacyAccepted')}
                    />
                    <span>
                        ✅ Ho letto e accetto l'<strong>Informativa sulla Privacy</strong> e acconsento al trattamento
                        dei miei dati personali
                    </span>
                </label>

                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        checked={agreements.disclaimerAccepted}
                        onChange={() => handleCheckboxChange('disclaimerAccepted')}
                    />
                    <span>
                        ✅ Ho letto e accetto il <strong>Disclaimer di Responsabilità</strong>
                    </span>
                </label>

                <label className="checkbox-label professional">
                    <input
                        type="checkbox"
                        checked={agreements.professionalConfirmed}
                        onChange={() => handleCheckboxChange('professionalConfirmed')}
                    />
                    <span>
                        ✅ <strong>Confermo di essere un professionista qualificato</strong> in materia di
                        sicurezza sul lavoro e valutazione del rischio chimico
                    </span>
                </label>
            </div>

            <div className="legal-actions">
                <button
                    className="btn-proceed"
                    onClick={handleProceed}
                    disabled={!allAccepted}
                >
                    {allAccepted ? '✅ Procedi con la Registrazione' : '❌ Accetta tutti i documenti per procedere'}
                </button>
            </div>

            <div className="legal-footer">
                <p>
                    <strong>TOKEM LLC</strong> (Safety Pro Suite) •
                    5500 BENTGRASS DR UNIT 301, 34235 SARASOTA (FL) - U.S.A. •
                    FEI/EIN: 84-1930240
                </p>
            </div>
        </div>
    );
};

export default LegalAgreement;
