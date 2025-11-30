import { Request, Response } from "express";
import { Product } from "../models/product";
import { pool } from "../db";

export class ProductController {
  async list(req: Request, res: Response) {
    try {
      const query = "SELECT * FROM products";
      const { rows } = await pool.query(query);

      return res.status(200).json(rows);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao buscar produtos" });
    }
  }

  async create(req: Request, res: Response) {
    const { name, price } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: "Nome e preço são obrigatórios" });
    }

    try {
      const query =
        "INSERT INTO products (name, price) VALUES ($1, $2) RETURNING *";
      const values = [name, price];

      const { rows } = await pool.query(query, values);

      return res.status(201).json(rows[0]);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao criar produto" });
    }
  }

  async update(req: Request, res: Response) {
    const { name, price } = req.body;
    const id = Number(req.params.id);

    if (!name || !price) {
      return res.status(400).json({ error: "Nome e preço são obrigatórios" });
    }

    try {
      const query =
        "UPDATE products SET name = $1, price = $2 WHERE id = $3 RETURNING *;";
      const values = [name, price, id];

      const { rows, rowCount } = await pool.query(query, values);

      if (!rowCount || rowCount === 0) {
        return res.status(404).json({ error: "Produto não encontrado" });
      }
      return res.status(200).json(rows[0]);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao editar produto" });
    }
  }

  async delete(req: Request, res: Response) {
    const id = Number(req.params.id);

    try {
      const query = "DELETE FROM products WHERE id = $1";
      const values = [id];

      const result = await pool.query(query, values);

      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Produto não encontrado" });
      }

      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao deletar produto" });
    }
  }
}
