import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { AppError } from "../errors/AppError";

const userService = new UserService();

export class UserController {
  async create(req: Request, res: Response) {
    const { name, email, password } = req.body;

    try {
      const result = await userService.create(name, email, password);
      return res.status(201).json(result);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      return res.status(500).json({ error: "Erro ao criar user" });
    }
  }
}
