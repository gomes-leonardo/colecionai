import { ProductCategory, ProductCondition } from "@prisma/client";
import { z } from "zod";

const NOW_GRACE_MS = 5_000;

export const createAuctionSchema = z.object({
  body: z
    .object({
      product_id: z.string().uuid("ID do produto inválido"),

      start_price: z.coerce.number().positive("O preço deve ser positivo"),

      start_date: z.coerce.date().superRefine((startDate, ctx) => {
        const now = new Date();
        if (startDate.getTime() < now.getTime() - NOW_GRACE_MS) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "A data de início não pode ser no passado",
          });
        }
      }),

      end_date: z.coerce.date(),
    })
    .superRefine((data, ctx) => {
      // end > start
      if (data.end_date <= data.start_date) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "A data de término deve ser após a data de início",
          path: ["end_date"],
        });
      }

      const TWO_DAYS_IN_MS = 2 * 24 * 60 * 60 * 1000;
      const diff = data.end_date.getTime() - data.start_date.getTime();
      if (diff > TWO_DAYS_IN_MS) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "O leilão não pode durar mais que 2 dias",
          path: ["end_date"],
        });
      }
    }),
});

export const listAuctionsQuerySchema = z.object({
  name: z.string().optional(),

  category: z
    .nativeEnum(ProductCategory, {
      error: () => ({ message: "Categoria inválida" }),
    })
    .optional(),

  condition: z
    .nativeEnum(ProductCondition, {
      error: () => ({ message: "Condição inválida" }),
    })
    .optional(),
  page: z.coerce.number().min(1).default(1),
  per_page: z.coerce.number().min(1).max(50).default(10),
});
