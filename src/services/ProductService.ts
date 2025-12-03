import { pool } from "../db";
import { AppError } from "../errors/AppError";
import fs from "fs";
import path from "path";
import uploadConfig from "../config/upload";
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

    if (product.banner) {
      const productBannerFilePath = path.join(
        uploadConfig.directory,
        product.banner
      );

      const productBannerFileExists = await fs.promises
        .stat(productBannerFilePath)
        .catch(() => false);

      if (productBannerFileExists) {
        await fs.promises.unlink(productBannerFilePath);
      }
    }

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

  async updateImage(id: number, userId: number, imageFilename: string) {
    const findQuery = "SELECT * FROM products WHERE id = $1";
    const values = [id];

    const { rows, rowCount } = await pool.query(findQuery, values);

    if (!rowCount || rowCount === 0) {
      throw new AppError("Produto não encontrado", 404);
    }

    const product = rows[0];

    if (product.banner) {
      const productBannerFilePath = path.join(
        uploadConfig.directory,
        product.banner
      );

      const productBannerFileExists = await fs.promises
        .stat(productBannerFilePath)
        .catch(() => false);

      if (productBannerFileExists) {
        await fs.promises.unlink(productBannerFilePath);
      }
    }

    if (product.user_id !== userId) {
      throw new AppError(
        "Você não tem permissão para editar este produto",
        403
      );
    }

    const query = "UPDATE products SET banner = $1 WHERE id = $2";
    const result = await pool.query(query, [imageFilename, id]);

    return result.rows[0];
  }
}
