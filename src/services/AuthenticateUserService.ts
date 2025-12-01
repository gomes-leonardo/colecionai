import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { pool } from "../db";
import { AppError } from "../errors/AppError";

export class AuthenticateUserService {
  async create(email: string, password: string) {
    if (!email || !password) {
      throw new AppError("E-mail e senha são obrigatórios.", 400);
    }

    const { rows, rowCount } = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (rowCount === 0 || !rowCount) {
      throw new AppError("Email ou senha incorretos.", 401);
    }

    const user = rows[0];

    const passwordMatched = await compare(password, user.password);
    if (!passwordMatched) {
      throw new AppError("Email ou senha incorretos.", 401);
    }

    const token = sign({}, process.env.JWT_SECRET as string, {
      subject: String(user.id),
      expiresIn: "1d",
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    };
  }
}
