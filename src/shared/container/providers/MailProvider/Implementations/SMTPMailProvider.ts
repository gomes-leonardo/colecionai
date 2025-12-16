import { injectable } from "tsyringe";
import { IMailProvider } from "../IMailProvider";

@injectable()
export class SMTPMailProvider implements IMailProvider {
  private client: any;

  constructor() {
    let nodemailer: any;
    try {
      nodemailer = require("nodemailer");
      if (!nodemailer || !nodemailer.createTransport) {
        throw new Error("nodemailer não está instalado corretamente");
      }
    } catch (error: any) {
      const errorMessage = error?.code === "MODULE_NOT_FOUND" 
        ? "nodemailer não está instalado. Execute: npm install nodemailer"
        : `Erro ao carregar nodemailer: ${error?.message || error}`;
      throw new Error(errorMessage);
    }

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

    console.log("[SMTP] Configurando transporter com:", {
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      user: smtpUser.substring(0, 3) + "***", // Log parcial do email
    });

    this.client = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, // true para porta 465 (SSL), false para 587 (TLS)
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      // Configurações adicionais para Gmail e produção
      tls: {
        // Não falhar em certificados inválidos (útil para alguns hosts)
        rejectUnauthorized: false,
      },
      // Timeout maior para ambientes de produção lentos
      connectionTimeout: 10000, // 10 segundos
      greetingTimeout: 10000,
      socketTimeout: 10000,
      // Debug em desenvolvimento
      debug: process.env.NODE_ENV === "development",
      logger: process.env.NODE_ENV === "development",
    });

    this.client.verify((error: any, success: any) => {
      if (error) {
        console.error("[SMTP] ⚠️  Erro ao verificar conexão SMTP:", error.message);
        console.error("[SMTP] A aplicação continuará, mas emails podem falhar");
      } else {
        console.log("[SMTP] ✅ Conexão SMTP verificada com sucesso");
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
