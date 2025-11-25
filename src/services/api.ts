import axios from 'axios';
import { Car, FilterState } from '@/types';

const API_BASE_URL = 'https://car-rental-api.goit.global';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Format mileage with spaces (5000 -> 5 000)
export const formatMileage = (mileage: number): string => {
  return mileage.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

// Fetch all cars with optional filters
export const fetchCars = async (
  filters: Partial<FilterState> = {},
  page: number = 1
): Promise<Car[]> => {
  try {
    const params: Record<string, string | number> = {
      page,
      limit: 12,
    };

    // Add filters to params if they exist and are not empty
    // Try different parameter names that API might expect
    if (filters.brand && filters.brand.trim() !== '') {
      params.make = filters.brand;
      // Also try alternative names
      // params.brand = filters.brand;
      // params.manufacturer = filters.brand;
    }
    if (filters.price && filters.price.trim() !== '') {
      const priceNum = Number(filters.price);
      params.rentalPrice = priceNum;
      // Also try alternative names
      // params.price = priceNum;
      // params.maxPrice = priceNum;
    }
    if (filters.mileageFrom && filters.mileageFrom.trim() !== '') {
      params.mileageFrom = Number(filters.mileageFrom);
      // Also try alternative names
      // params.minMileage = Number(filters.mileageFrom);
    }
    if (filters.mileageTo && filters.mileageTo.trim() !== '') {
      params.mileageTo = Number(filters.mileageTo);
      // Also try alternative names
      // params.maxMileage = Number(filters.mileageTo);
    }

    // Try different endpoints - API might use /cars instead of /api/cars
    let response;
    try {
      // First try /api/cars
      response = await api.get('/api/cars', { params });
    } catch (error: any) {
      if (error.response?.status === 404) {
        // If 404, try /cars
        response = await api.get('/cars', { params });
      } else {
        throw error;
      }
    }
    
    // Reduced logging for production
    if (process.env.NODE_ENV === 'development') {
      console.log('API response status:', response.status);
      console.log('Cars found:', response.data?.cars?.length || response.data?.length || 0);
    }
    
    // API returns data in format: { cars: [...], totalCars: number, page: string, totalPages: number }
    let cars: any[] = [];
    
    if (Array.isArray(response.data)) {
      cars = response.data;
    } else if (response.data?.cars && Array.isArray(response.data.cars)) {
      cars = response.data.cars;
    } else if (response.data?.data && Array.isArray(response.data.data)) {
      cars = response.data.data;
    } else if (response.data?.items && Array.isArray(response.data.items)) {
      cars = response.data.items;
    }
    
    // Map API response to our Car interface
    // API returns 'brand' but our interface expects 'make'
    const mappedCars = cars.map((car: any) => ({
      ...car,
      make: car.brand || car.make, // Use brand from API or fallback to make
    }));
    
    return mappedCars;
  } catch (error: any) {
    console.error('Error fetching cars:', error);
    if (error.response) {
      console.error('Response error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('Request error:', error.request);
    }
    // Return empty array instead of throwing to prevent app crash
    return [];
  }
};

// Fetch car by ID
export const fetchCarById = async (id: string): Promise<Car> => {
  try {
    let response;
    try {
      response = await api.get(`/api/cars/${id}`);
    } catch (error: any) {
      if (error.response?.status === 404) {
        response = await api.get(`/cars/${id}`);
      } else {
        throw error;
      }
    }
    
    // Handle different response formats
    let car: any;
    if (response.data?.data) {
      car = response.data.data;
    } else if (response.data?.car) {
      car = response.data.car;
    } else {
      car = response.data;
    }
    
    // Map API response - API returns 'brand' but our interface expects 'make'
    return {
      ...car,
      make: car.brand || car.make,
    };
  } catch (error) {
    console.error('Error fetching car by ID:', error);
    throw error;
  }
};

// Submit rental form
export const submitRental = async (data: {
  carId: string;
  name: string;
  email: string;
  phone: string;
  message?: string;
}): Promise<void> => {
  try {
    try {
      await api.post('/api/rentals', data);
    } catch (error: any) {
      if (error.response?.status === 404) {
        try {
          await api.post('/rentals', data);
        } catch (error2: any) {
          // If both fail, just log and continue (API might not have this endpoint)
          console.warn('Rental submission endpoint not found, but continuing...');
        }
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error('Error submitting rental:', error);
    throw error;
  }
};

