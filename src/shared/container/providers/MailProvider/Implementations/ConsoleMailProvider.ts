import { injectable } from "tsyringe";
import { IMailProvider } from "../IMailProvider";

@injectable()
export class ConsoleMailProvider implements IMailProvider {
  async sendMail(to: string, subject: string, body: string): Promise<void> {
    console.log("=".repeat(80));
    console.log(`📧 [EMAIL SIMULADO]`);
    console.log(`Para: ${to}`);
    console.log(`Assunto: ${subject}`);
    console.log(`Conteúdo:`);
    console.log(body);
    
    const tokenMatch = body.match(/token[:\s]*([A-Z0-9]{6})/i) || body.match(/([A-Z0-9]{6})/);
    if (tokenMatch) {
      console.log("");
      console.log("🔑 TOKEN GERADO:", tokenMatch[1]);
      console.log("");
    }
    
    const linkMatch = body.match(/href=["']([^"']+)["']/);
    if (linkMatch) {
      console.log("🔗 LINK DE RESET:", linkMatch[1]);
      console.log("");
    }
    
    console.log("=".repeat(80));
  }
}







