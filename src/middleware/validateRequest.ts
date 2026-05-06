import { NextFunction, Request, Response } from "express";

const validateRequest =
  (schema: { parseAsync: (data: unknown) => Promise<unknown> }) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (err) {
      next(err);
    }
  };

export default validateRequest;
