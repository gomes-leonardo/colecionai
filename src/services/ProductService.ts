import { pool } from "../db";
import { AppError } from "../errors/AppError";

export class ProductService {
  async list() {
    const query = "SELECT * FROM products";
    const { rows } = await pool.query(query);
    return rows;
  }

  async listByUserId(userId: number) {
    const query = "SELECT * FROM products WHERE user_id = $1";
    const { rows } = await pool.query(query, [userId]);
    return rows;
  }

  async create(name: string, price: number, userId: number) {
    if (!name || !price) {
      throw new AppError("Nome e preços são obrigatórios.", 400);
    }
    const query =
      "INSERT INTO products (name, price, user_id) VALUES ($1, $2, $3) RETURNING *";
    const { rows } = await pool.query(query, [name, price, userId]);
    return rows[0];
  }

  async update(name: string, price: number, userId: number, id: number) {
    const findQuery = "SELECT * FROM products WHERE id = $1";
    const { rows, rowCount } = await pool.query(findQuery, [id]);

    if (!rowCount || rowCount === 0) {
      throw new AppError("Produto não encontrado", 404);
    }

    const product = rows[0];

    if (product.user_id !== userId) {
      throw new AppError(
        "Você não tem permissão para editar este produto",
        403
      );
    }

    const updateQuery =
      "UPDATE products SET name = $1, price = $2 WHERE id = $3 RETURNING *;";
    const result = await pool.query(updateQuery, [name, price, id]);

    return result.rows[0];
  }

  async delete(id: number, userId: number) {
    const findQuery = "SELECT * FROM products WHERE id = $1";
    const { rows, rowCount } = await pool.query(findQuery, [id]);

    if (!rowCount || rowCount === 0) {
      throw new AppError("Produto não encontrado", 404);
    }

    const product = rows[0];

    if (product.user_id !== userId) {
      throw new AppError(
        "Você não tem permissão para deletar este produto",
        403
      );
    }

    const deleteQuery = "DELETE FROM products WHERE id = $1";
    await pool.query(deleteQuery, [id]);

    return;
  }
}
