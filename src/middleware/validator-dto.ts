import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { RequestHandler } from "express";

export function validateDto(
  dtoClass: any,
  source: "body" | "query" | "params" = "body"
): RequestHandler {
  return async (req, res, next) => {
    const dtoObject = plainToInstance(dtoClass, req[source], {
      enableImplicitConversion: true,
    });

    // validate
    const errors = await validate(dtoObject, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      return res.status(417).json({
        message: "Validation failed",
        errors: errors.map((err) => ({
          property: err.property,
          constraints: err.constraints,
        })),
      });
    }

    req[source] = dtoObject;
    next();
  };
}
