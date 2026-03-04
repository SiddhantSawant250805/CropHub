import express from 'express';
import multer from 'multer';
import { TerraService } from '../services/terra.service';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

router.post(
  '/analyze',
  authenticateToken,
  upload.single('soilImage'),
  async (req: AuthRequest, res) => {
    try {
      if (!req.file) {
        res.status(400).json({
          success: false,
          error: 'No image file uploaded'
        });
        return;
      }

      const imageUrl = await TerraService.uploadToS3(req.file);

      const analysis = await TerraService.analyzeSoil(imageUrl, req.user?.id);

      res.status(200).json({
        success: true,
        data: {
          imageUrl,
          analysis
        }
      });
    } catch (error: any) {
      console.error('Error in soil analysis:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to analyze soil image'
      });
    }
  }
);

router.get('/history', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const history = await TerraService.getUserSoilHistory(req.user!.id);
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
