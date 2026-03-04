import axios from 'axios';
import { supabase } from '../config/database';
import { encryptFinancialData, decryptFinancialData } from '../utils/encryption';

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || '';
const MARKET_API_KEY = process.env.MARKET_API_KEY || '';

interface Location {
  latitude: number;
  longitude: number;
}

interface Market {
  name: string;
  location: Location;
  price: number;
  distance: number;
  transport: number;
  rent: number;
  profit: number;
}

interface MarketArbitrageRequest {
  cropType: string;
  weightTons: number;
  farmLocation: Location;
}

export class LogisticsService {
  static async calculateMarketArbitrage(request: MarketArbitrageRequest): Promise<Market[]> {
    const { cropType, weightTons, farmLocation } = request;

    const markets = await this.getNearbyMarkets(farmLocation);

    const marketData = await Promise.all(
      markets.map(async (market) => {
        const distance = await this.calculateDistance(farmLocation, market.location);
        const price = await this.getMarketPrice(cropType, market.name);
        const transport = this.calculateTransportCost(distance, weightTons);
        const rent = this.calculateMarketRent(market.name);

        const trueProfit = (price * weightTons) - (transport + rent);

        return {
          name: market.name,
          location: market.location,
          price,
          distance,
          transport,
          rent,
          profit: trueProfit
        };
      })
    );

    const sortedMarkets = marketData.sort((a, b) => b.profit - a.profit);

    return sortedMarkets;
  }

  private static async getNearbyMarkets(farmLocation: Location) {
    return [
      {
        name: 'Mandal Mandi',
        location: { latitude: farmLocation.latitude + 0.1, longitude: farmLocation.longitude + 0.1 }
      },
      {
        name: 'District APMC',
        location: { latitude: farmLocation.latitude + 0.25, longitude: farmLocation.longitude - 0.15 }
      },
      {
        name: 'Krishi Bazaar',
        location: { latitude: farmLocation.latitude - 0.08, longitude: farmLocation.longitude + 0.12 }
      },
      {
        name: 'Regional Market',
        location: { latitude: farmLocation.latitude + 0.35, longitude: farmLocation.longitude + 0.28 }
      }
    ];
  }

  private static async calculateDistance(from: Location, to: Location): Promise<number> {
    if (!GOOGLE_MAPS_API_KEY) {
      return this.calculateHaversineDistance(from, to);
    }

    try {
      const response = await axios.get(
        'https://maps.googleapis.com/maps/api/distancematrix/json',
        {
          params: {
            origins: `${from.latitude},${from.longitude}`,
            destinations: `${to.latitude},${to.longitude}`,
            key: GOOGLE_MAPS_API_KEY
          }
        }
      );

      const distanceInMeters = response.data.rows[0].elements[0].distance.value;
      return Math.round(distanceInMeters / 1000);
    } catch (error) {
      console.error('Error calculating distance with Google Maps:', error);
      return this.calculateHaversineDistance(from, to);
    }
  }

  private static calculateHaversineDistance(from: Location, to: Location): number {
    const R = 6371;
    const dLat = this.toRad(to.latitude - from.latitude);
    const dLon = this.toRad(to.longitude - from.longitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(from.latitude)) *
      Math.cos(this.toRad(to.latitude)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  }

  private static toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  private static async getMarketPrice(cropType: string, marketName: string): Promise<number> {
    const basePrices: Record<string, number> = {
      'wheat': 2200,
      'rice': 2800,
      'maize': 1800,
      'soybean': 3500,
      'vegetables': 4500
    };

    const basePrice = basePrices[cropType.toLowerCase()] || 2500;

    const marketMultiplier = Math.random() * 0.3 + 0.85;

    return Math.round(basePrice * marketMultiplier);
  }

  private static calculateTransportCost(distanceKm: number, weightTons: number): number {
    const costPerKmPerTon = 50;
    return Math.round(distanceKm * weightTons * costPerKmPerTon);
  }

  private static calculateMarketRent(marketName: string): number {
    const rentRates: Record<string, number> = {
      'Mandal Mandi': 200,
      'District APMC': 350,
      'Krishi Bazaar': 150,
      'Regional Market': 400
    };

    return rentRates[marketName] || 250;
  }

  static async saveArbitrageAnalysis(
    userId: string,
    cropType: string,
    weightTons: number,
    markets: Market[]
  ) {
    const encryptedMarkets = markets.map(market => encryptFinancialData(market));

    const { error } = await supabase.from('market_analyses').insert([
      {
        user_id: userId,
        crop_type: cropType,
        weight_tons: weightTons,
        markets: encryptedMarkets,
        best_market: markets[0].name,
        max_profit: markets[0].profit,
        analyzed_at: new Date().toISOString()
      }
    ]);

    if (error) {
      throw new Error(`Failed to save market analysis: ${error.message}`);
    }
  }

  static async getUserMarketHistory(userId: string, limit: number = 10) {
    const { data, error } = await supabase
      .from('market_analyses')
      .select('*')
      .eq('user_id', userId)
      .order('analyzed_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch market history: ${error.message}`);
    }

    return data.map(analysis => ({
      ...analysis,
      markets: analysis.markets.map((market: any) => decryptFinancialData(market))
    }));
  }
}
