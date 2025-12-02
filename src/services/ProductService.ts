import { pool } from "../db";
import { AppError } from "../errors/AppError";

export class ProductService {
  async list() {
    const query = "SELECT * FROM products";
    const { rows } = await pool.query(query);

    return rows;
  }

  async create(name: string, price: number, userId: number) {
    if (!name || !price) {
      throw new AppError("Nome e preços são obrigatórios.", 400);
    }
    const query =
      "INSERT INTO products (name, price, user_id) VALUES ($1, $2, $3) RETURNING *";
    const values = [name, price, userId];

    const { rows } = await pool.query(query, values);
    return rows[0];
  }
  async update(name: string, price: number, id: number) {
    const query =
      "UPDATE products SET name = $1, price = $2 WHERE id = $3 RETURNING *;";
    const values = [name, price, id];

    const { rows, rowCount } = await pool.query(query, values);

    if (!rowCount || rowCount === 0) {
      throw new AppError("Produto não encontrado", 404);
    }

    return rows[0];
  }
  async delete(id: number) {
    const query = "DELETE FROM products WHERE id = $1";
    const values = [id];

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      throw new AppError("Produto não encontrado", 404);
    }

    return;
  }
}
