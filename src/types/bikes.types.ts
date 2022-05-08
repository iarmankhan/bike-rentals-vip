import { User } from "src/types/users.types";

export interface Bike {
  id?: string;
  model: string;
  color: string;
  location: string;
  rating?: Record<string, number>;
  isAvailable: boolean;
  isReservedByUser?: boolean;
  reservations?: Reservation[];
}

export interface BikeFiltersType {
  date: string;
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
  user: User | null;
  startDate: {
    seconds: number;
  };
  endDate: {
    seconds: number;
  };
}
