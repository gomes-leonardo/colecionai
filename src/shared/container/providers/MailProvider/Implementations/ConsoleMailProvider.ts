import { injectable } from "tsyringe";
import { IMailProvider } from "../IMailProvider";

@injectable()
export class ConsoleMailProvider implements IMailProvider {
  async sendMail(to: string, subject: string, body: string): Promise<void> {
    console.log("=".repeat(80));
    console.log(`[EMAIL SIMULADO] Enviando email para: ${to}`);
    console.log(`[EMAIL SIMULADO] Assunto: ${subject}`);
    console.log(`[EMAIL SIMULADO] Conteúdo:`);
    console.log(body);
    console.log("=".repeat(80));
  }
}






