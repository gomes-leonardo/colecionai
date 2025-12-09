import { Request, Response } from "express";
import { ListAllProductsUseCase } from "./listProductsUseCase";
import { container } from "tsyringe";
import { ProductCategory, ProductCondition } from "@prisma/client";

export class ListProductsController {
  async handle(req: Request, res: Response) {
    const {
      name,
      condition: conditionQuery,
      category: categoryQuery,
    } = req.query;

    const listProductUseCase = container.resolve(ListAllProductsUseCase);

    let condition: ProductCondition | undefined;
    if (typeof conditionQuery === "string") {
      if (
        Object.values(ProductCondition).includes(
          conditionQuery as ProductCondition
        )
      ) {
        condition = conditionQuery as ProductCondition;
      } else {
        return res.status(400).json({
          error: `Invalid condition. Allowed values: ${Object.values(
            ProductCondition
          ).join(", ")}`,
        });
      }
    }

    let category: ProductCategory | undefined;
    if (typeof categoryQuery === "string") {
      if (
        Object.values(ProductCategory).includes(
          categoryQuery as ProductCategory
        )
      ) {
        category = categoryQuery as ProductCategory;
      } else {
        return res.status(400).json({
          error: `Invalid category. Allowed values: ${Object.values(
            ProductCategory
          ).join(", ")}`,
        });
      }
    }

    const result = await listProductUseCase.execute({
      name: typeof name === "string" ? name : undefined,
      condition,
      category,
    });

    if (result.length === 0) {
      return res.status(204).json(result);
    }

    return res.status(200).json(result);
  }
}
