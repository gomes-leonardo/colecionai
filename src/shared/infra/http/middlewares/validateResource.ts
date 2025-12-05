import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

export const validateResource =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      const validatedData = result as any;

      if (validatedData.body) {
        req.body = validatedData.body;
      }

      if (validatedData.query) {
        Object.assign(req.query, validatedData.query);
      }

      if (validatedData.params) {
        Object.assign(req.params, validatedData.params);
      }

      return next();
    } catch (e: any) {
      if (e instanceof ZodError) {
        return res.status(400).json({
          status: "error",
          message: "Erro de validação",
          issues: e.issues.map((issue) => ({
            field: (issue.path[1] as string) ?? issue.path[0],
            message: issue.message,
          })),
        });
      }

      return res.status(400).json({
        status: "error",
        message: "Erro desconhecido na validação",
        originalError: e.message || e,
      });
    }
  };
