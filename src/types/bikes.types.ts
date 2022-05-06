export interface Bike {
  id?: string;
  model: string;
  color: string;
  location: string;
  rating?: Record<string, number>;
  isAvailable: boolean;
}

export interface BikeFiltersType {
  location: string;
  model: string;
  color: string;
  rating: string | number;
}
