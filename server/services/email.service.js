const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransporter({
            host: process.env.SMTP_HOST || 'smtp.hostinger.com',
            port: parseInt(process.env.SMTP_PORT) || 465,
            secure: process.env.SMTP_SECURE === 'true' || true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        });
    }

    /**
     * Invia email generica
     */
    async sendMail({ to, subject, html, text }) {
        try {
            const mailOptions = {
                from: `${process.env.EMAIL_FROM_NAME || 'MoVaRisCh'} <${process.env.EMAIL_FROM || 'info@safetyprosuite.com'}>`,
                to,
                subject,
                html,
                text
            };

            const info = await this.transporter.sendMail(mailOptions);
            console.log('Email sent successfully:', info.messageId);
            return { success: true, messageId: info.messageId };
        } catch (error) {
            console.error('Error sending email:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Email reset password
     */
    async sendPasswordResetEmail(email, nome, resetToken) {
        const resetUrl = `${process.env.APP_URL}/reset-password/${resetToken}`;

        const html = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; padding: 15px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
        .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔐 Reset Password</h1>
        </div>
        <div class="content">
            <p>Ciao ${nome || 'Utente'},</p>

            <p>Abbiamo ricevuto una richiesta di reset della password per il tuo account <strong>MoVaRisCh</strong>.</p>

            <p>Clicca sul pulsante qui sotto per creare una nuova password:</p>

            <center>
                <a href="${resetUrl}" class="button">Reset Password</a>
            </center>

            <p>Oppure copia e incolla questo link nel tuo browser:</p>
            <p style="background: #e9ecef; padding: 10px; border-radius: 4px; word-break: break-all;">
                ${resetUrl}
            </p>

            <div class="warning">
                <strong>⚠️ Importante:</strong>
                <ul>
                    <li>Questo link è valido per <strong>1 ora</strong></li>
                    <li>Può essere utilizzato <strong>una sola volta</strong></li>
                    <li>Se non hai richiesto il reset, ignora questa email</li>
                </ul>
            </div>
        </div>
        <div class="footer">
            <p><strong>TOKEM LLC</strong> (Safety Pro Suite)</p>
            <p>5500 BENTGRASS DR UNIT 301, 34235 SARASOTA (FL) - U.S.A.</p>
            <p>FEI/EIN: 84-1930240</p>
        </div>
    </div>
</body>
</html>
        `;

        const text = `
Reset Password - MoVaRisCh

Ciao ${nome || 'Utente'},

Abbiamo ricevuto una richiesta di reset della password per il tuo account MoVaRisCh.

Clicca su questo link per creare una nuova password:
${resetUrl}

IMPORTANTE:
- Questo link è valido per 1 ora
- Può essere utilizzato una sola volta
- Se non hai richiesto il reset, ignora questa email

TOKEM LLC (Safety Pro Suite)
5500 BENTGRASS DR UNIT 301, 34235 SARASOTA (FL) - U.S.A.
FEI/EIN: 84-1930240
        `;

        return this.sendMail({
            to: email,
            subject: '🔐 Reset Password - MoVaRisCh',
            html,
            text
        });
    }

    /**
     * Email benvenuto con trial attivo
     */
    async sendWelcomeEmail(email, nome, trialEndDate) {
        const daysRemaining = Math.ceil((new Date(trialEndDate) - new Date()) / (1000 * 60 * 60 * 24));

        const html = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .trial-box { background: #e7f3ff; border: 2px solid #0066cc; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
        .button { display: inline-block; padding: 15px 30px; background: #28a745; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Benvenuto su MoVaRisCh!</h1>
        </div>
        <div class="content">
            <p>Ciao ${nome},</p>

            <p>Grazie per esserti registrato su <strong>MoVaRisCh</strong>, l'applicazione professionale per la valutazione del rischio chimico secondo il metodo MoVaRisCh.</p>

            <div class="trial-box">
                <h2 style="margin-top: 0; color: #0066cc;">🚀 Trial Gratuito Attivo</h2>
                <p style="font-size: 18px; margin: 10px 0;">Hai <strong>${daysRemaining} giorni</strong> di prova gratuita</p>
                <p style="font-size: 14px; color: #666;">Scadenza: ${new Date(trialEndDate).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>

            <p><strong>Cosa puoi fare con MoVaRisCh:</strong></p>
            <ul>
                <li>✅ Valutazione rischio chimico secondo metodo MoVaRisCh</li>
                <li>✅ Selezione ottimale DPI - Guanti</li>
                <li>✅ Gestione inventario sostanze chimiche</li>
                <li>✅ Generazione report professionali DOCX</li>
            </ul>

            <center>
                <a href="${process.env.APP_URL}" class="button">Inizia Ora</a>
            </center>

            <p style="margin-top: 30px;"><strong>Dopo il trial:</strong><br/>
            Continua a utilizzare MoVaRisCh con l'abbonamento annuale a soli <strong>€50,00/anno</strong></p>
        </div>
        <div class="footer">
            <p><strong>TOKEM LLC</strong> (Safety Pro Suite)</p>
            <p>5500 BENTGRASS DR UNIT 301, 34235 SARASOTA (FL) - U.S.A.</p>
            <p>Email: info@safetyprosuite.com | FEI/EIN: 84-1930240</p>
        </div>
    </div>
</body>
</html>
        `;

        return this.sendMail({
            to: email,
            subject: '🎉 Benvenuto su MoVaRisCh - Trial Attivo!',
            html
        });
    }

    /**
     * Email trial in scadenza
     */
    async sendTrialExpiringEmail(email, nome, daysRemaining) {
        const upgradeUrl = `${process.env.APP_URL}/subscription/upgrade`;

        const html = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #ffc107; color: #333; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .warning-box { background: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; margin: 20px 0; }
        .button { display: inline-block; padding: 15px 30px; background: #28a745; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>⏰ Il tuo trial sta per scadere</h1>
        </div>
        <div class="content">
            <p>Ciao ${nome},</p>

            <div class="warning-box">
                <h3 style="margin-top: 0;">⚠️ Attenzione</h3>
                <p style="font-size: 18px;">Il tuo periodo di prova gratuito scade tra <strong>${daysRemaining} giorni</strong></p>
            </div>

            <p>Non perdere l'accesso alle tue valutazioni e ai tuoi dati!</p>

            <p><strong>Continua con l'abbonamento annuale:</strong></p>
            <ul>
                <li>💰 Solo <strong>€50,00/anno</strong></li>
                <li>✅ Accesso illimitato a tutte le funzionalità</li>
                <li>✅ Tutti i tuoi dati salvati</li>
                <li>✅ Supporto tecnico dedicato</li>
            </ul>

            <center>
                <a href="${upgradeUrl}" class="button">Attiva Abbonamento Ora</a>
            </center>
        </div>
        <div class="footer">
            <p><strong>TOKEM LLC</strong> (Safety Pro Suite)</p>
            <p>Email: info@safetyprosuite.com</p>
        </div>
    </div>
</body>
</html>
        `;

        return this.sendMail({
            to: email,
            subject: `⏰ Il tuo trial MoVaRisCh scade tra ${daysRemaining} giorni`,
            html
        });
    }

    /**
     * Email trial scaduto
     */
    async sendTrialExpiredEmail(email, nome) {
        const upgradeUrl = `${process.env.APP_URL}/subscription/upgrade`;

        const html = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #dc3545; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; padding: 15px 30px; background: #28a745; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>❌ Trial Scaduto</h1>
        </div>
        <div class="content">
            <p>Ciao ${nome},</p>

            <p>Il tuo periodo di prova gratuito di MoVaRisCh è terminato.</p>

            <p><strong>Riattiva il tuo account con l'abbonamento annuale:</strong></p>
            <ul>
                <li>💰 Solo <strong>€50,00/anno</strong></li>
                <li>✅ Riaccedi immediatamente ai tuoi dati</li>
                <li>✅ Tutte le funzionalità Premium</li>
            </ul>

            <center>
                <a href="${upgradeUrl}" class="button">Attiva Abbonamento</a>
            </center>
        </div>
        <div class="footer">
            <p><strong>TOKEM LLC</strong> (Safety Pro Suite)</p>
            <p>Email: info@safetyprosuite.com</p>
        </div>
    </div>
</body>
</html>
        `;

        return this.sendMail({
            to: email,
            subject: '❌ Trial MoVaRisCh Scaduto - Riattiva il tuo account',
            html
        });
    }

    /**
     * Email conferma pagamento
     */
    async sendPaymentConfirmationEmail(email, nome, amount, subscriptionEndDate) {
        const html = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #28a745; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .success-box { background: #d4edda; border: 2px solid #28a745; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>✅ Pagamento Confermato!</h1>
        </div>
        <div class="content">
            <p>Ciao ${nome},</p>

            <div class="success-box">
                <h2 style="margin-top: 0; color: #28a745;">✅ Abbonamento Attivato</h2>
                <p style="font-size: 18px; margin: 10px 0;">Importo pagato: <strong>€${amount.toFixed(2)}</strong></p>
                <p style="font-size: 14px; color: #666;">Valido fino al: ${new Date(subscriptionEndDate).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>

            <p>Grazie per aver scelto <strong>MoVaRisCh</strong>!</p>

            <p>Il tuo abbonamento annuale è ora attivo e hai accesso completo a tutte le funzionalità.</p>

            <p><strong>Puoi ora:</strong></p>
            <ul>
                <li>✅ Effettuare valutazioni del rischio chimico illimitate</li>
                <li>✅ Gestire il tuo inventario sostanze</li>
                <li>✅ Generare report professionali</li>
                <li>✅ Accedere al supporto tecnico dedicato</li>
            </ul>
        </div>
        <div class="footer">
            <p><strong>TOKEM LLC</strong> (Safety Pro Suite)</p>
            <p>5500 BENTGRASS DR UNIT 301, 34235 SARASOTA (FL) - U.S.A.</p>
            <p>Email: info@safetyprosuite.com | FEI/EIN: 84-1930240</p>
        </div>
    </div>
</body>
</html>
        `;

        return this.sendMail({
            to: email,
            subject: '✅ Pagamento Confermato - MoVaRisCh Attivato!',
            html
        });
    }
}

module.exports = new EmailService();
