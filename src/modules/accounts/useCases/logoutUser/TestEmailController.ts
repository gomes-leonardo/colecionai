import { Request, Response } from "express";
import { emailQueue } from "../../../../job/queue";

export class TestEmailController {
  async handle(req: Request, res: Response) {
    const job = await emailQueue.add("Simulando envio de e-mail para", {
      token: "123456",
      email: "bull@teste.com",
    });

    return res.status(200).json({ message: "Email está na fila de envio!" });
  }
}
