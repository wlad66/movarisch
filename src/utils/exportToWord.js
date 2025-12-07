import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel } from 'docx';
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
    const paragraphs = [
        new Paragraph({
            text: 'SCHEDA VALUTAZIONE RISCHIO CHIMICO',
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 }
        }),
        new Paragraph({
            text: `Data: ${new Date().toLocaleDateString('it-IT')}`,
            spacing: { after: 400 }
        })
    ];

    const fields = [
        { label: 'Agente Chimico', value: assessment.name },
        { label: 'CAS', value: assessment.cas },
        { label: 'Puntaeggio P', value: String(assessment.pScore || 'N/A') },
        { label: 'Luogo', value: assessment.workplace },
        { label: 'Mansione', value: assessment.role },
        { label: 'Rischio Inalatorio (R_inal)', value: String(assessment.calcRInal || 'N/A') }, // Might need recalculation if not passed
        { label: 'Rischio Cutaneo (R_cute)', value: String(assessment.calcRCute || 'N/A') },
        { label: 'Rischio Cumulativo (R_cum)', value: String(assessment.calcRCum || 'N/A') }
    ];

    fields.forEach(field => {
        paragraphs.push(
            new Paragraph({
                children: [
                    new TextRun({ text: `${field.label}: `, bold: true }),
                    new TextRun(field.value || '-')
                ],
                spacing: { after: 100 }
            })
        );
    });

    const doc = createDocument(paragraphs);
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `Valutazione_${assessment.name}_${new Date().getTime()}.docx`);
};
