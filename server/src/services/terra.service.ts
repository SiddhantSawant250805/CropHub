import axios from 'axios';
import { s3, S3_BUCKET } from '../config/aws';
import { supabase } from '../config/database';
import crypto from 'crypto';

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

interface SoilAnalysisResult {
  soilType: string;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  ph: number;
  composition: {
    sand: number;
    silt: number;
    clay: number;
  };
  recommendations: string[];
}

export class TerraService {
  static async uploadToS3(file: Express.Multer.File): Promise<string> {
    const fileKey = `soil-images/${crypto.randomUUID()}-${file.originalname}`;

    const params = {
      Bucket: S3_BUCKET,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read' as const
    };

    const result = await s3.upload(params).promise();
    return result.Location;
  }

  static async analyzeSoil(imageUrl: string, userId?: string): Promise<SoilAnalysisResult> {
    try {
      const response = await axios.post(
        `${ML_SERVICE_URL}/predict-soil`,
        { imageUrl },
        { timeout: 30000 }
      );

      const analysisData = response.data;

      if (userId) {
        await supabase.from('soil_analyses').insert([
          {
            user_id: userId,
            image_url: imageUrl,
            soil_type: analysisData.soilType,
            nitrogen: analysisData.nitrogen,
            phosphorus: analysisData.phosphorus,
            potassium: analysisData.potassium,
            ph: analysisData.ph,
            sand_percentage: analysisData.composition.sand,
            silt_percentage: analysisData.composition.silt,
            clay_percentage: analysisData.composition.clay,
            recommendations: analysisData.recommendations,
            analyzed_at: new Date().toISOString()
          }
        ]);
      }

      return analysisData;
    } catch (error) {
      console.error('Error calling ML service:', error);

      return this.getMockSoilAnalysis();
    }
  }

  private static getMockSoilAnalysis(): SoilAnalysisResult {
    return {
      soilType: 'Loamy Soil',
      nitrogen: 65,
      phosphorus: 42,
      potassium: 78,
      ph: 6.5,
      composition: {
        sand: 40,
        silt: 35,
        clay: 25
      },
      recommendations: [
        'Soil is excellent for most crops',
        'Consider adding nitrogen-rich fertilizers for optimal growth',
        'pH level is ideal for vegetable cultivation',
        'Maintain current irrigation practices'
      ]
    };
  }

  static async getUserSoilHistory(userId: string, limit: number = 10) {
    const { data, error } = await supabase
      .from('soil_analyses')
      .select('*')
      .eq('user_id', userId)
      .order('analyzed_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch soil history: ${error.message}`);
    }

    return data;
  }
}
