import { z } from "zod";

export const sessionSchema = z.object({
  body: z.object({
    email: z
      .string({ error: "Email é obrigatório" })
      .email("Formato de email inválido"),
    password: z.string({ error: "Senha é obrigatória" }),
  }),
});
