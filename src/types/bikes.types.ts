export interface Bike {
  id?: string;
  model: string;
  color: string;
  location: string;
  rating?: Record<string, number>;
  isAvailable: boolean;
}
