import express from 'express';
import { AuthService } from '../services/auth.service';
import { validate, schemas } from '../middleware/validation';

const router = express.Router();

router.post('/register', validate(schemas.register), async (req, res) => {
  try {
    const result = await AuthService.register(req.body);
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

router.post('/login', validate(schemas.login), async (req, res) => {
  try {
    const result = await AuthService.login(req.body);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
