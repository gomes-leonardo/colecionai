import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object({
    name: z
      .string({ error: "Nome é obrigatório" })
      .min(3, "Nome deve ter no mínimo 3 caracteres"),

    email: z
      .string({ error: "Email é obrigatório" })
      .email("Formato de email inválido"),

    password: z
      .string({ error: "Senha é obrigatória" })
      .min(8, "Senha deve ter no mínimo 8 caracteres")
      .regex(/[A-Z]/, "Senha deve conter ao menos 1 letra maiúscula")
      .regex(/[a-z]/, "Senha deve conter ao menos 1 letra minúscula")
      .regex(/[0-9]/, "Senha deve conter ao menos 1 número")
      .regex(/[^A-Za-z0-9]/, "Senha deve conter ao menos 1 caractere especial"),
  }),
});
