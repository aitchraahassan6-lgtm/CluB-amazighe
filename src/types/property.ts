export type PropertyType = 'villa' | 'apartment' | 'bungalow' | 'penthouse';

export interface Property {
  id: string;
  title: string;
  titleAr: string;
  type: PropertyType;
  price: number; // In USD
  location: string;
  locationAr: string;
  city: string;
  cityAr: string;
  beds: number;
  baths: number;
  sqft: number;
  tag: string;
  tagAr: string;
  image: string;
  gallery: string[];
  description: string;
  descriptionAr: string;
  features: string[];
  featuresAr: string[];
  yearBuilt: number;
  agent: {
    name: string;
    role: string;
    roleAr: string;
    phone: string;
    email: string;
    avatar: string;
  };
  floorPlan: {
    levels: number;
    parkingSpaces: number;
    hoaMonthly: number;
  };
}

export type Currency = 'USD' | 'INR' | 'EUR' | 'GBP' | 'AED';

export interface CurrencyConfig {
  code: Currency;
  symbol: string;
  rate: number; // against 1 USD
  locale: string;
}

export const CURRENCIES: Record<Currency, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', rate: 1, locale: 'en-US' },
  INR: { code: 'INR', symbol: '₹', rate: 86.5, locale: 'en-IN' },
  EUR: { code: 'EUR', symbol: '€', rate: 0.94, locale: 'de-DE' },
  GBP: { code: 'GBP', symbol: '£', rate: 0.79, locale: 'en-GB' },
  AED: { code: 'AED', symbol: 'د.إ', rate: 3.67, locale: 'ar-AE' },
};
