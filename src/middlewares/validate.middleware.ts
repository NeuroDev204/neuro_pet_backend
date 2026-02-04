import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ApiResponse } from '../utils/ApiResponse';

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return res.status(400).json(
        ApiResponse.error({
          statusCode: 400,
          message: errorMessages.join(', '),
          code: 'VALIDATION_ERROR',
        })
      );
    }

    // Replace body with validated & sanitized value
    req.body = value;
    next();
  };
};
