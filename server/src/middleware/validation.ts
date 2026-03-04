import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params
      });
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: 'Validation failed',
          details: error.errors
        });
        return;
      }
      next(error);
    }
  };
};

export const schemas = {
  register: z.object({
    body: z.object({
      name: z.string().min(2, 'Name must be at least 2 characters'),
      email: z.string().email('Invalid email format'),
      password: z.string().min(8, 'Password must be at least 8 characters')
    })
  }),

  login: z.object({
    body: z.object({
      email: z.string().email('Invalid email format'),
      password: z.string().min(1, 'Password is required')
    })
  }),

  soilAnalysis: z.object({
    body: z.object({
      userId: z.string().optional()
    })
  }),

  cropOptimization: z.object({
    body: z.object({
      budget: z.number().positive('Budget must be positive'),
      landSize: z.number().positive('Land size must be positive'),
      userId: z.string().optional()
    })
  }),

  marketArbitrage: z.object({
    body: z.object({
      cropType: z.string().min(1, 'Crop type is required'),
      weightTons: z.number().positive('Weight must be positive'),
      farmLocation: z.object({
        latitude: z.number(),
        longitude: z.number()
      })
    })
  })
};
