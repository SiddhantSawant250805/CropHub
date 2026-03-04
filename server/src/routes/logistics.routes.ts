import express from 'express';
import { LogisticsService } from '../services/logistics.service';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { validate, schemas } from '../middleware/validation';

const router = express.Router();

router.post(
  '/arbitrage',
  authenticateToken,
  validate(schemas.marketArbitrage),
  async (req: AuthRequest, res) => {
    try {
      const { cropType, weightTons, farmLocation } = req.body;

      const markets = await LogisticsService.calculateMarketArbitrage({
        cropType,
        weightTons,
        farmLocation
      });

      if (req.user?.id) {
        await LogisticsService.saveArbitrageAnalysis(
          req.user.id,
          cropType,
          weightTons,
          markets
        );
      }

      res.status(200).json({
        success: true,
        data: {
          markets,
          bestMarket: markets[0],
          cropType,
          weightTons
        }
      });
    } catch (error: any) {
      console.error('Error in market arbitrage:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to calculate market arbitrage'
      });
    }
  }
);

router.get('/history', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const history = await LogisticsService.getUserMarketHistory(req.user!.id);
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
