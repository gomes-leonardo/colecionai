import { Request, Response } from "express";
import { ProductService } from "../services/ProductService";
import { AppError } from "../errors/AppError";

const productService = new ProductService();

export class ProductController {
  async list(req: Request, res: Response) {
    try {
      const products = await productService.list();
      return res.status(200).json(products);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao buscar produtos" });
    }
  }

  async create(req: Request, res: Response) {
    const { name, price } = req.body;
    try {
      const result = await productService.create(name, price);
      return res.status(201).json(result);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      return res.status(500).json({ error: "Erro ao criar produto" });
    }
  }

  async update(req: Request, res: Response) {
    const { name, price } = req.body;
    const id = Number(req.params.id);
    try {
      const result = await productService.update(name, price, id);
      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      return res.status(500).json({ error: "Erro ao editar produto." });
    }
  }

  async delete(req: Request, res: Response) {
    const id = Number(req.params.id);
    try {
      await productService.delete(id);
      return res.status(204).json({});
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      return res.status(500).json({ error: "Erro ao deletar produto" });
    }
  }
}
