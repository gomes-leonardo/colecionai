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
  async listByUserId(req: Request, res: Response) {
    const userId = req.user.id;
    try {
      const products = await productService.listByUserId(userId);

      return res.status(200).json(products);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao buscar produtos" });
    }
  }

  async create(req: Request, res: Response) {
    const { name, price } = req.body;
    const userId = req.user.id;
    try {
      const result = await productService.create(name, price, userId);
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
    const userId = req.user.id;

    try {
      const result = await productService.update(name, price, userId, id);
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
    const userId = req.user.id;

    try {
      await productService.delete(id, userId);
      return res.status(204).json({});
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      return res.status(500).json({ error: "Erro ao deletar produto" });
    }
  }

  async updateImage(req: Request, res: Response) {
    const id = Number(req.params.id);
    const userId = req.user.id;

    const imageFilename = req.file?.filename;
    if (!imageFilename) {
      return res.status(400).json({ error: "Arquivo de imagem obrigatório" });
    }

    try {
      const result = await productService.updateImage(
        id,
        userId,
        imageFilename
      );
      return res.json(result);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      return res.status(500).json({ error: "Erro ao atualizar imagem" });
    }
  }
}
