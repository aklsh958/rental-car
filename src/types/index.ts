export interface Car {
  id: string;
  year: number;
  make: string;
  model: string;
  type: string;
  img: string;
  description: string;
  fuelConsumption: string;
  engineSize: string;
  accessories: string[];
  functionalities: string[];
  rentalPrice: string;
  rentalCompany: string;
  address: string;
  rentalConditions: string | string[];
  mileage: number;
}

export interface FilterState {
  brand: string;
  price: string;
  mileageFrom: string;
  mileageTo: string;
}

export interface CarsState {
  cars: Car[];
  filteredCars: Car[];
  favorites: string[];
  filters: FilterState;
  isLoading: boolean;
  page: number;
  hasMore: boolean;
}

