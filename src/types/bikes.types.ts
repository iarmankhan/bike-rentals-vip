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

export interface ReserveBikeDTO {
  bikeId: string;
  userId: string;
  startDate: Date;
  endDate: Date;
}

export interface Reservation {
  id: string;
  bike: Bike;
  startDate: Date;
  endDate: Date;
}
