import axios from 'axios';
import { Car, FilterState } from '@/types';

const API_BASE_URL = 'https://car-rental-api.goit.global';

const api = axios.create({
  baseURL: API_BASE_URL,
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

    // Add filters to params if they exist
    if (filters.brand) {
      params.make = filters.brand;
    }
    if (filters.price) {
      params.rentalPrice = filters.price;
    }
    if (filters.mileageFrom) {
      params.mileageFrom = filters.mileageFrom;
    }
    if (filters.mileageTo) {
      params.mileageTo = filters.mileageTo;
    }

    const response = await api.get('/api/cars', { params });
    // Handle different response formats
    if (Array.isArray(response.data)) {
      return response.data;
    }
    if (response.data?.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    if (response.data?.cars && Array.isArray(response.data.cars)) {
      return response.data.cars;
    }
    return [];
  } catch (error) {
    console.error('Error fetching cars:', error);
    throw error;
  }
};

// Fetch car by ID
export const fetchCarById = async (id: string): Promise<Car> => {
  try {
    const response = await api.get(`/api/cars/${id}`);
    // Handle different response formats
    if (response.data?.data) {
      return response.data.data;
    }
    if (response.data?.car) {
      return response.data.car;
    }
    return response.data;
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
    await api.post('/api/rentals', data);
  } catch (error) {
    console.error('Error submitting rental:', error);
    throw error;
  }
};

