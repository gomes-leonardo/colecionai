import { hash } from "bcryptjs";
import { pool } from "../db";
import { AppError } from "../errors/AppError";

export class UserService {
  async create(name: string, email: string, password: string) {
    if (!name || !email || !password) {
      throw new AppError("Nome, e-mail e senha são obrigatórios.", 400);
    }

    const passwordHash = await hash(password, 8);
    const values = [name, email, passwordHash];

    const checkUserExists = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (checkUserExists.rowCount && checkUserExists.rowCount > 0) {
      throw new AppError("Email já cadastrado.", 409);
    }

    const query =
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at";
    const { rows } = await pool.query(query, values);
    return rows[0];
  }
}
