import { injectable } from "tsyringe";
import { IMailProvider } from "../IMailProvider";
import nodemailer, { Transporter } from "nodemailer";

@injectable()
export class SMTPMailProvider implements IMailProvider {
  private client: Transporter;

  constructor() {
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
      console.error("[SMTP] Variáveis de ambiente não configuradas:", {
        SMTP_HOST: !!smtpHost,
        SMTP_PORT: !!smtpPort,
        SMTP_USER: !!smtpUser,
        SMTP_PASS: !!smtpPass,
      });
      throw new Error("Configuração SMTP incompleta. Verifique as variáveis de ambiente.");
    }

    this.client = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, // true para porta 465, false para outras
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // Verificar conexão SMTP na inicialização
    this.client.verify((error, success) => {
      if (error) {
        console.error("[SMTP] Erro ao verificar conexão SMTP:", error);
      } else {
        console.log("[SMTP] Conexão SMTP verificada com sucesso");
      }
    });
  }

  async sendMail(to: string, subject: string, body: string): Promise<void> {
    try {
      if (!to || !subject || !body) {
        throw new Error("Parâmetros de email inválidos");
      }

      const result = await this.client.sendMail({
        to,
        from: "Coleciona.ai <noreply@coleciona.ai>",
        subject,
        html: body,
      });

      console.log(`[SMTP] Email enviado para: ${to}`, { messageId: result.messageId });
    } catch (error) {
      console.error(`[SMTP] Erro ao enviar email para ${to}:`, error);
      throw error;
    }
  }
}
