import express from 'express';
import { FathomService } from '../services/fathom.service';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { validate, schemas } from '../middleware/validation';

const router = express.Router();

router.post(
  '/optimize',
  authenticateToken,
  validate(schemas.cropOptimization),
  async (req: AuthRequest, res) => {
    try {
      const { budget, landSize } = req.body;

      const cropPlan = await FathomService.optimizeCropAllocation({
        budget,
        landSize,
        userId: req.user?.id
      });

      res.status(200).json({
        success: true,
        data: {
          crops: cropPlan,
          totalBudget: budget,
          totalLand: landSize
        }
      });
    } catch (error: any) {
      console.error('Error in crop optimization:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to optimize crop allocation'
      });
    }
  }
);

router.get('/history', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const history = await FathomService.getUserCropPlans(req.user!.id);
    res.status(200).json({
      success: true,
      data: history
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
