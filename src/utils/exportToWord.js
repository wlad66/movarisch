import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType } from 'docx';
import { saveAs } from 'file-saver';

// Helper to create a standard document structure
const createDocument = (children) => {
    return new Document({
        sections: [{
            children: children
        }]
    });
};

// Export specific archived report
export const exportArchivedReport = async (report, company) => {
    try {
        const paragraphs = [];

        // Header
        paragraphs.push(
            new Paragraph({
                text: 'REPORT DPI SELEZIONATI',
                heading: HeadingLevel.HEADING_1,
                alignment: AlignmentType.CENTER,
                spacing: { after: 300 }
            })
        );

        paragraphs.push(
            new Paragraph({
                text: `Data Archiviazione: ${new Date(report.date).toLocaleDateString('it-IT')}`,
                alignment: AlignmentType.CENTER,
                spacing: { after: 500 }
            })
        );

        // Company Info (if available)
        if (company) {
            paragraphs.push(
                new Paragraph({
                    text: `Azienda: ${company.ragioneSociale || ''}`,
                    bold: true,
                    spacing: { after: 100 }
                })
            );
        }

        // Section: Chemicals
        paragraphs.push(
            new Paragraph({
                text: 'Prodotti Chimici Valutati:',
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 400, after: 200 }
            })
        );

        if (report.chemicals && report.chemicals.length > 0) {
            report.chemicals.forEach(chem => {
                paragraphs.push(
                    new Paragraph({
                        bullet: {
                            level: 0
                        },
                        children: [
                            new TextRun({ text: chem.name, bold: true }),
                            new TextRun(` (CAS: ${chem.cas})`)
                        ]
                    })
                );
            });
        } else {
            paragraphs.push(
                new Paragraph({
                    text: 'Nessun prodotto chimico elencato.',
                    italics: true
                })
            );
        }

        // Section: Gloves
        paragraphs.push(
            new Paragraph({
                text: 'DPI Selezionati (Guanti):',
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 400, after: 200 }
            })
        );

        if (report.gloves && report.gloves.length > 0) {
            report.gloves.forEach(glove => {
                paragraphs.push(
                    new Paragraph({
                        children: [
                            new TextRun({ text: 'Materiale: ', bold: true }),
                            new TextRun(glove.material || 'N/A')
                        ]
                    })
                );
                paragraphs.push(
                    new Paragraph({
                        children: [
                            new TextRun({ text: 'Spessore: ', bold: true }),
                            new TextRun(glove.thickness || 'N/A')
                        ],
                        spacing: { after: 100 }
                    })
                );
                paragraphs.push(
                    new Paragraph({
                        children: [
                            new TextRun({ text: 'Nome Commerciale: ', italics: true }),
                            new TextRun(glove.name || 'N/A')
                        ],
                        spacing: { after: 300 }
                    })
                );
            });
        } else {
            paragraphs.push(
                new Paragraph({
                    text: 'Nessun guanto selezionato.',
                    italics: true
                })
            );
        }

        // Generate and Save
        const doc = createDocument(paragraphs);
        const blob = await Packer.toBlob(doc);
        saveAs(blob, `Report_DPI_${new Date().getTime()}.docx`);

    } catch (error) {
        console.error("Error generating report:", error);
        throw new Error("Errore durante la generazione del file Word.");
    }
};

// Export single assessment (pre-optimization)
export const exportAssessmentToWord = async (assessment, user) => {
    const paragraphs = [];

    // Title
    paragraphs.push(
        new Paragraph({
            text: 'SCHEDA VALUTAZIONE RISCHIO CHIMICO',
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 }
        })
    );

    paragraphs.push(
        new Paragraph({
            text: `Data: ${new Date().toLocaleDateString('it-IT')}`,
            spacing: { after: 400 }
        })
    );

    // Basic Info
    paragraphs.push(
        new Paragraph({
            children: [
                new TextRun({ text: 'Agente Chimico: ', bold: true }),
                new TextRun(assessment.name || 'N/A')
            ],
            spacing: { after: 100 }
        })
    );

    paragraphs.push(
        new Paragraph({
            children: [
                new TextRun({ text: 'CAS: ', bold: true }),
                new TextRun(assessment.cas || 'N/A')
            ],
            spacing: { after: 100 }
        })
    );

    paragraphs.push(
        new Paragraph({
            children: [
                new TextRun({ text: 'Luogo di Lavoro: ', bold: true }),
                new TextRun(assessment.workplace || 'Non specificato')
            ],
            spacing: { after: 100 }
        })
    );

    paragraphs.push(
        new Paragraph({
            children: [
                new TextRun({ text: 'Mansione: ', bold: true }),
                new TextRun(assessment.role || 'Non specificato')
            ],
            spacing: { after: 100 }
        })
    );

    paragraphs.push(
        new Paragraph({
            children: [
                new TextRun({ text: 'Punteggio P (Pericolo): ', bold: true }),
                new TextRun(assessment.pScore ? assessment.pScore.toFixed(2) : 'N/A')
            ],
            spacing: { after: 400 }
        })
    );

    // Inhalation Parameters
    paragraphs.push(
        new Paragraph({
            text: 'PARAMETRI ESPOSIZIONE INALATORIA',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 200 }
        })
    );

    const inalParams = [
        { label: 'Stato Fisico', value: assessment.physicalState },
        { label: 'Quantità', value: assessment.quantity },
        { label: 'Tipo Uso', value: assessment.usageType },
        { label: 'Controllo', value: assessment.controlType },
        { label: 'Tempo Esposizione', value: assessment.exposureTime },
        { label: 'Distanza (d)', value: assessment.distance },
        { label: 'E_inal (calcolato)', value: assessment.calcEInal }
    ];

    inalParams.forEach(param => {
        if (param.value !== undefined && param.value !== null) {
            paragraphs.push(
                new Paragraph({
                    children: [
                        new TextRun({ text: `  • ${param.label}: `, bold: true }),
                        new TextRun(typeof param.value === 'number' ? param.value.toFixed(2) : String(param.value))
                    ],
                    spacing: { after: 50 }
                })
            );
        }
    });

    // Dermal Parameters
    paragraphs.push(
        new Paragraph({
            text: 'PARAMETRI ESPOSIZIONE CUTANEA',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 200 }
        })
    );

    const dermalParams = [
        { label: 'Tipologia d\'Uso', value: assessment.dermalUsageType },
        { label: 'Livello Contatto', value: assessment.dermalContact },
        { label: 'E_cute (calcolato)', value: assessment.calcECute }
    ];

    dermalParams.forEach(param => {
        if (param.value !== undefined && param.value !== null) {
            paragraphs.push(
                new Paragraph({
                    children: [
                        new TextRun({ text: `  • ${param.label}: `, bold: true }),
                        new TextRun(typeof param.value === 'number' ? param.value.toFixed(2) : String(param.value))
                    ],
                    spacing: { after: 50 }
                })
            );
        }
    });

    // Risk Assessment
    paragraphs.push(
        new Paragraph({
            text: 'VALUTAZIONE DEL RISCHIO',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 200 }
        })
    );

    const riskValues = [
        { label: 'Rischio Inalatorio (R_inal)', value: assessment.calcRInal },
        { label: 'Rischio Cutaneo (R_cute)', value: assessment.calcRCute },
        { label: 'Rischio Cumulativo (R_cum)', value: assessment.calcRCum }
    ];

    riskValues.forEach(risk => {
        if (risk.value !== undefined && risk.value !== null) {
            paragraphs.push(
                new Paragraph({
                    children: [
                        new TextRun({ text: `  • ${risk.label}: `, bold: true }),
                        new TextRun({ text: risk.value.toFixed(2), bold: true, color: '0066CC' })
                    ],
                    spacing: { after: 50 }
                })
            );
        }
    });

    // Risk Classification Table
    paragraphs.push(
        new Paragraph({
            text: 'CLASSIFICAZIONE DEL RISCHIO',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 200 }
        })
    );

    const rCum = assessment.calcRCum || 0;
    const riskLevels = [
        {
            range: '0,1 ≤ R < 15',
            classification: 'Irrilevante per la salute',
            description: '',
            bgColor: 'F0FDF4', // green-50 (sfondo chiaro)
            textColor: '15803D', // green-700 (testo)
            borderColor: '10B981', // green-500 (bordo)
            isActive: rCum >= 0.1 && rCum < 15
        },
        {
            range: '15 ≤ R < 21',
            classification: 'Intervallo di incertezza',
            description: 'È necessario, prima della classificazione in rischio irrilevante per la salute, rivedere con scrupolo l\'assegnazione dei vari punteggi, rivedere le misure di prevenzione e protezione adottate e consultare il medico competente per la decisione finale.',
            bgColor: 'FEF9C3', // yellow-50
            textColor: 'A16207', // yellow-700
            borderColor: 'EAB308', // yellow-500
            isActive: rCum >= 15 && rCum < 21
        },
        {
            range: '21 ≤ R ≤ 40',
            classification: 'Rischio superiore al rischio chimico irrilevante per la salute',
            description: 'Applicare gli articoli 225, 226, 229 e 230 D. Lgs 81/08 e s.m.i.',
            bgColor: 'FFF7ED', // orange-50
            textColor: 'C2410C', // orange-700
            borderColor: 'F97316', // orange-500
            isActive: rCum >= 21 && rCum <= 40
        },
        {
            range: '40 < R ≤ 80',
            classification: 'Rischio elevato',
            description: '',
            bgColor: 'FEF2F2', // red-50
            textColor: 'B91C1C', // red-700
            borderColor: 'DC2626', // red-600
            isActive: rCum > 40 && rCum <= 80
        },
        {
            range: 'R > 80',
            classification: 'Rischio grave',
            description: 'Riconsiderare il percorso dell\'identificazione delle misure di prevenzione e protezione ai fini di una loro eventuale implementazione. Intensificare i controlli quali la sorveglianza sanitaria, la misurazione degli agenti chimici e la periodicità della manutenzione.',
            bgColor: 'FAF5FF', // purple-50
            textColor: '6B21A8', // purple-700
            borderColor: '7C3AED', // purple-600
            isActive: rCum > 80
        }
    ];

    const tableRows = [
        new TableRow({
            tableHeader: true,
            children: [
                new TableCell({
                    children: [new Paragraph({ text: 'VALORI DI RISCHIO (R)', bold: true })],
                    shading: { fill: 'F1F5F9' }
                }),
                new TableCell({
                    children: [new Paragraph({ text: 'CLASSIFICAZIONE', bold: true })],
                    shading: { fill: 'F1F5F9' }
                })
            ]
        })
    ];

    riskLevels.forEach(level => {
        const classificationChildren = [
            new Paragraph({
                children: [new TextRun({
                    text: level.classification,
                    bold: level.isActive,
                    color: level.isActive ? level.textColor : '1F2937'
                })],
                spacing: { after: level.description ? 100 : 0 }
            })
        ];

        // Add description paragraph if it exists
        if (level.description) {
            classificationChildren.push(
                new Paragraph({
                    children: [new TextRun({
                        text: level.description,
                        size: 18,
                        color: '6B7280'
                    })],
                    spacing: { after: 0 }
                })
            );
        }

        tableRows.push(
            new TableRow({
                children: [
                    new TableCell({
                        children: [new Paragraph({
                            children: [new TextRun({
                                text: level.range,
                                bold: level.isActive,
                                color: level.isActive ? level.textColor : '1F2937'
                            })]
                        })]
                    }),
                    new TableCell({
                        children: classificationChildren
                    })
                ]
            })
        );
    });

    const classificationTable = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: tableRows
    });

    paragraphs.push(classificationTable);

    paragraphs.push(
        new Paragraph({
            text: '',
            spacing: { after: 200 }
        })
    );

    const doc = createDocument(paragraphs);
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `Valutazione_${assessment.name}_${new Date().getTime()}.docx`);
};

// Export complete report for a workplace/role group (all assessments + all DPI optimizations)
export const exportCompleteReport = async (group, company) => {
    try {
        const paragraphs = [];

        // Main Title
        paragraphs.push(
            new Paragraph({
                text: 'REPORT COMPLETO VALUTAZIONE RISCHIO CHIMICO E DPI',
                heading: HeadingLevel.HEADING_1,
                alignment: AlignmentType.CENTER,
                spacing: { after: 400 }
            })
        );

        // Company Info
        if (company) {
            paragraphs.push(
                new Paragraph({
                    children: [
                        new TextRun({ text: 'Azienda: ', bold: true }),
                        new TextRun(company.ragioneSociale || 'N/A')
                    ],
                    spacing: { after: 100 }
                })
            );
        }

        // Workplace and Role
        paragraphs.push(
            new Paragraph({
                children: [
                    new TextRun({ text: 'Luogo di Lavoro: ', bold: true }),
                    new TextRun(group.workplace || 'Non specificato')
                ],
                spacing: { after: 100 }
            })
        );

        paragraphs.push(
            new Paragraph({
                children: [
                    new TextRun({ text: 'Mansione: ', bold: true }),
                    new TextRun(group.role || 'Non specificato')
                ],
                spacing: { after: 100 }
            })
        );

        paragraphs.push(
            new Paragraph({
                text: `Data Generazione Report: ${new Date().toLocaleDateString('it-IT')}`,
                spacing: { after: 400 }
            })
        );

        paragraphs.push(
            new Paragraph({
                text: `Numero di report archiviati: ${group.reports.length}`,
                bold: true,
                spacing: { after: 600 }
            })
        );

        // Process each report in the group
        group.reports.forEach((report, reportIdx) => {
            // Report Section Header
            paragraphs.push(
                new Paragraph({
                    text: `REPORT ${reportIdx + 1} - ${report.date}`,
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 600, after: 300 }
                })
            );

            // Assessments Section
            paragraphs.push(
                new Paragraph({
                    text: 'VALUTAZIONI EFFETTUATE',
                    heading: HeadingLevel.HEADING_3,
                    spacing: { before: 300, after: 200 }
                })
            );

            if (report.assessments && report.assessments.length > 0) {
                report.assessments.forEach((assessment, idx) => {
                    paragraphs.push(
                        new Paragraph({
                            text: `Agente Chimico ${idx + 1}: ${assessment.name}`,
                            bold: true,
                            spacing: { before: 200, after: 100 }
                        })
                    );

                    // Basic Info
                    paragraphs.push(
                        new Paragraph({
                            children: [
                                new TextRun({ text: 'CAS: ', bold: true }),
                                new TextRun(assessment.cas || 'N/A')
                            ],
                            spacing: { after: 50 }
                        })
                    );

                    // Inhalation Parameters
                    paragraphs.push(
                        new Paragraph({
                            text: 'Parametri Inalazione:',
                            italics: true,
                            spacing: { before: 100, after: 50 }
                        })
                    );

                    const inalParams = [
                        { label: 'Punteggio P (Pericolo)', value: assessment.pScore },
                        { label: 'Stato Fisico', value: assessment.physicalState },
                        { label: 'Quantità', value: assessment.quantity },
                        { label: 'Tipo Uso', value: assessment.usageType },
                        { label: 'Controllo', value: assessment.controlType },
                        { label: 'Tempo Esposizione', value: assessment.exposureTime },
                        { label: 'Distanza (d)', value: assessment.distance },
                        { label: 'E_inal (calc)', value: assessment.calcEInal }
                    ];

                    inalParams.forEach(param => {
                        if (param.value !== undefined && param.value !== null) {
                            paragraphs.push(
                                new Paragraph({
                                    children: [
                                        new TextRun({ text: `  • ${param.label}: `, bold: true }),
                                        new TextRun(typeof param.value === 'number' ? param.value.toFixed(2) : String(param.value))
                                    ],
                                    spacing: { after: 30 }
                                })
                            );
                        }
                    });

                    // Dermal Parameters
                    paragraphs.push(
                        new Paragraph({
                            text: 'Parametri Cutanei:',
                            italics: true,
                            spacing: { before: 100, after: 50 }
                        })
                    );

                    const dermalParams = [
                        { label: 'Tipologia d\'Uso', value: assessment.dermalUsageType },
                        { label: 'Livello Contatto', value: assessment.dermalContact },
                        { label: 'E_cute (calc)', value: assessment.calcECute }
                    ];

                    dermalParams.forEach(param => {
                        if (param.value !== undefined && param.value !== null) {
                            paragraphs.push(
                                new Paragraph({
                                    children: [
                                        new TextRun({ text: `  • ${param.label}: `, bold: true }),
                                        new TextRun(typeof param.value === 'number' ? param.value.toFixed(2) : String(param.value))
                                    ],
                                    spacing: { after: 30 }
                                })
                            );
                        }
                    });

                    // Final Risk Assessment
                    paragraphs.push(
                        new Paragraph({
                            text: 'Valutazione del Rischio:',
                            italics: true,
                            spacing: { before: 100, after: 50 }
                        })
                    );

                    const riskValues = [
                        { label: 'Rischio Inalatorio (R_inal)', value: assessment.calcRInal },
                        { label: 'Rischio Cutaneo (R_cute)', value: assessment.calcRCute },
                        { label: 'Rischio Cumulativo (R_cum)', value: assessment.calcRCum }
                    ];

                    riskValues.forEach(risk => {
                        if (risk.value !== undefined && risk.value !== null) {
                            paragraphs.push(
                                new Paragraph({
                                    children: [
                                        new TextRun({ text: `  • ${risk.label}: `, bold: true }),
                                        new TextRun({ text: String(risk.value), bold: true, color: '0066CC' })
                                    ],
                                    spacing: { after: 30 }
                                })
                            );
                        }
                    });
                });
            } else {
                paragraphs.push(
                    new Paragraph({
                        text: 'Nessuna valutazione dettagliata disponibile.',
                        italics: true,
                        spacing: { after: 200 }
                    })
                );
            }

            // DPI Section
            paragraphs.push(
                new Paragraph({
                    text: 'DPI OTTIMIZZATI SELEZIONATI',
                    heading: HeadingLevel.HEADING_3,
                    spacing: { before: 300, after: 200 }
                })
            );

            if (report.gloves && report.gloves.length > 0) {
                report.gloves.forEach((glove, idx) => {
                    paragraphs.push(
                        new Paragraph({
                            text: `Guanto ${idx + 1}:`,
                            bold: true,
                            spacing: { before: 100, after: 50 }
                        })
                    );

                    paragraphs.push(
                        new Paragraph({
                            children: [
                                new TextRun({ text: '  • Materiale: ', bold: true }),
                                new TextRun(glove.material || 'N/A')
                            ],
                            spacing: { after: 30 }
                        })
                    );

                    paragraphs.push(
                        new Paragraph({
                            children: [
                                new TextRun({ text: '  • Spessore: ', bold: true }),
                                new TextRun(glove.thickness || 'N/A')
                            ],
                            spacing: { after: 30 }
                        })
                    );

                    paragraphs.push(
                        new Paragraph({
                            children: [
                                new TextRun({ text: '  • Nome Commerciale: ', bold: true }),
                                new TextRun(glove.name || 'N/A')
                            ],
                            spacing: { after: 100 }
                        })
                    );
                });
            } else {
                paragraphs.push(
                    new Paragraph({
                        text: 'Nessun DPI selezionato.',
                        italics: true
                    })
                );
            }

            // Add separator between reports
            if (reportIdx < group.reports.length - 1) {
                paragraphs.push(
                    new Paragraph({
                        text: '───────────────────────────────────────────────────',
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 400, after: 400 }
                    })
                );
            }
        });

        // Generate and Save
        const doc = createDocument(paragraphs);
        const blob = await Packer.toBlob(doc);
        const filename = `Report_Completo_${group.workplace.replace(/\s+/g, '_')}_${group.role.replace(/\s+/g, '_')}_${new Date().getTime()}.docx`;
        saveAs(blob, filename);

    } catch (error) {
        console.error("Error generating complete report:", error);
        throw new Error("Errore durante la generazione del report completo.");
    }
};
