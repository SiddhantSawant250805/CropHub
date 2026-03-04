import axios from 'axios';
import { supabase } from '../config/database';
import { encryptFinancialData, decryptFinancialData } from '../utils/encryption';

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

interface CropPlan {
  name: string;
  acres: number;
  budget: number;
  color: string;
  expectedYield?: number;
  roi?: number;
}

interface OptimizationRequest {
  budget: number;
  landSize: number;
  userId?: string;
  weatherData?: any;
}

export class FathomService {
  static async optimizeCropAllocation(request: OptimizationRequest): Promise<CropPlan[]> {
    const { budget, landSize, userId, weatherData } = request;

    try {
      const response = await axios.post(
        `${ML_SERVICE_URL}/optimize`,
        {
          budget,
          landSize,
          weatherData: weatherData || await this.getMockWeatherData()
        },
        { timeout: 30000 }
      );

      const cropPlan = response.data.crops;

      if (userId) {
        const encryptedPlan = cropPlan.map((crop: CropPlan) =>
          encryptFinancialData(crop)
        );

        await supabase.from('crop_plans').insert([
          {
            user_id: userId,
            total_budget: budget,
            land_size: landSize,
            crop_allocation: encryptedPlan,
            created_at: new Date().toISOString()
          }
        ]);
      }

      return cropPlan;
    } catch (error) {
      console.error('Error calling ML optimization service:', error);

      return this.getMockCropPlan(budget, landSize, userId);
    }
  }

  private static async getMockCropPlan(
    budget: number,
    landSize: number,
    userId?: string
  ): Promise<CropPlan[]> {
    const crops = [
      { name: 'Maize', ratio: 0.3, color: 'hsl(38, 92%, 50%)', yieldPerAcre: 5.5, pricePerTon: 18000 },
      { name: 'Soybean', ratio: 0.25, color: 'hsl(152, 60%, 40%)', yieldPerAcre: 3.2, pricePerTon: 35000 },
      { name: 'Wheat', ratio: 0.2, color: 'hsl(30, 30%, 45%)', yieldPerAcre: 4.8, pricePerTon: 22000 },
      { name: 'Rice', ratio: 0.15, color: 'hsl(210, 80%, 55%)', yieldPerAcre: 6.0, pricePerTon: 28000 },
      { name: 'Vegetables', ratio: 0.1, color: 'hsl(142, 76%, 36%)', yieldPerAcre: 12.0, pricePerTon: 45000 }
    ];

    const cropPlan: CropPlan[] = crops.map(crop => {
      const acres = Math.round(landSize * crop.ratio * 10) / 10;
      const allocatedBudget = Math.round(budget * crop.ratio);
      const expectedYield = Math.round(acres * crop.yieldPerAcre * 100) / 100;
      const expectedRevenue = expectedYield * crop.pricePerTon;
      const roi = Math.round(((expectedRevenue - allocatedBudget) / allocatedBudget) * 100);

      return {
        name: crop.name,
        acres,
        budget: allocatedBudget,
        color: crop.color,
        expectedYield,
        roi
      };
    });

    if (userId) {
      const encryptedPlan = cropPlan.map(crop => encryptFinancialData(crop));

      await supabase.from('crop_plans').insert([
        {
          user_id: userId,
          total_budget: budget,
          land_size: landSize,
          crop_allocation: encryptedPlan,
          created_at: new Date().toISOString()
        }
      ]);
    }

    return cropPlan;
  }

  private static async getMockWeatherData() {
    return {
      temperature: 28,
      humidity: 72,
      rainfall: 12,
      windSpeed: 14,
      condition: 'Partly Cloudy'
    };
  }

  static async getUserCropPlans(userId: string, limit: number = 10) {
    const { data, error } = await supabase
      .from('crop_plans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch crop plans: ${error.message}`);
    }

    return data.map(plan => ({
      ...plan,
      crop_allocation: plan.crop_allocation.map((crop: any) => decryptFinancialData(crop))
    }));
  }
}
