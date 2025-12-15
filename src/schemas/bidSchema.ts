import z from "zod";

export const bidSchema = z.object({
  amount: z.number().positive(),
  auction_id: z.string().uuid(),
});
