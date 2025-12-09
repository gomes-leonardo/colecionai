import { injectable } from "tsyringe";
import { IMailProvider } from "../IMailProvider";
import nodemailer, { Transporter } from "nodemailer";

@injectable()
export class SMTPMailProvider implements IMailProvider {
  private client: Transporter;

  constructor() {
    this.client = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendMail(to: string, subject: string, body: string): Promise<void> {
    await this.client.sendMail({
      to,
      from: "Coleciona.ai <noreply@coleciona.ai>",
      subject,
      html: body,
    });

    console.log(`[SMTP] Email enviado para: ${to}`);
  }
}
