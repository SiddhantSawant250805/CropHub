import SoilAnalysis from '../models/SoilAnalysis.js';
import { uploadToS3 } from '../services/s3Service.js';
import { predictSoil } from '../services/mlService.js';

export const analyzeSoil = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a soil image'
      });
    }

    const uploadResult = await uploadToS3(req.file, 'soil-images');

    const soilAnalysis = await SoilAnalysis.create({
      user: req.user._id,
      imageUrl: uploadResult.url,
      status: 'processing'
    });

    const mlPrediction = await predictSoil(uploadResult.url);

    soilAnalysis.soilType = mlPrediction.soilType || 'Unknown';
    soilAnalysis.analysis = {
      nitrogen: mlPrediction.analysis?.nitrogen || 0,
      phosphorus: mlPrediction.analysis?.phosphorus || 0,
      potassium: mlPrediction.analysis?.potassium || 0,
      ph: mlPrediction.analysis?.ph || 7,
      organicMatter: mlPrediction.analysis?.organicMatter || 0,
      moisture: mlPrediction.analysis?.moisture || 0
    };
    soilAnalysis.composition = {
      topsoil: mlPrediction.composition?.topsoil || 0,
      clay: mlPrediction.composition?.clay || 0,
      sand: mlPrediction.composition?.sand || 0,
      silt: mlPrediction.composition?.silt || 0,
      organic: mlPrediction.composition?.organic || 0
    };
    soilAnalysis.mlPredictionData = mlPrediction;
    soilAnalysis.status = 'completed';

    await soilAnalysis.save();

    res.status(201).json({
      success: true,
      data: {
        analysis: {
          id: soilAnalysis._id,
          imageUrl: soilAnalysis.imageUrl,
          soilType: soilAnalysis.soilType,
          analysis: soilAnalysis.analysis,
          composition: soilAnalysis.composition,
          status: soilAnalysis.status,
          createdAt: soilAnalysis.createdAt
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getSoilAnalyses = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const analyses = await SoilAnalysis.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await SoilAnalysis.countDocuments({ user: req.user._id });

    res.status(200).json({
      success: true,
      data: {
        analyses: analyses.map(a => ({
          id: a._id,
          imageUrl: a.imageUrl,
          soilType: a.soilType,
          analysis: a.analysis,
          composition: a.composition,
          status: a.status,
          createdAt: a.createdAt
        })),
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getSoilAnalysisById = async (req, res, next) => {
  try {
    const analysis = await SoilAnalysis.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Soil analysis not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        analysis: {
          id: analysis._id,
          imageUrl: analysis.imageUrl,
          soilType: analysis.soilType,
          analysis: analysis.analysis,
          composition: analysis.composition,
          status: analysis.status,
          createdAt: analysis.createdAt
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
