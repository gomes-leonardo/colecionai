import { z } from "zod";
import { ProductCategory, ProductCondition } from "@prisma/client";

export const createProductSchema = z.object({
  body: z.object({
    name: z
      .string({ error: "Nome é obrigatório" })
      .min(3, "Nome deve ter no mínimo 3 caracteres"),

    price: z
      .number({ error: "Preço é obrigatório" })
      .positive("O preço deve ser positivo")
      .int("O preço deve ser em centavos (inteiro)"),

    description: z
      .string({ error: "Descrição é obrigatória" })
      .min(10, "Descrição deve ter no mínimo 10 caracteres"),

    category: z.nativeEnum(ProductCategory, {
      error: "Categoria inválida. Opções: ACTION_FIGURES, POP, etc.",
    }),

    condition: z.nativeEnum(ProductCondition, {
      error: "Condição inválida. Use: NEW, USED ou OPEN_BOX",
    }),
  }),
});
