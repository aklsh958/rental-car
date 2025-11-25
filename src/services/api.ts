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

    // Add filters to params if they exist and are not empty
    if (filters.brand && filters.brand.trim() !== '') {
      params.make = filters.brand;
    }
    if (filters.price && filters.price.trim() !== '') {
      // API might expect price as number or specific format
      params.rentalPrice = Number(filters.price);
    }
    if (filters.mileageFrom && filters.mileageFrom.trim() !== '') {
      params.mileageFrom = Number(filters.mileageFrom);
    }
    if (filters.mileageTo && filters.mileageTo.trim() !== '') {
      params.mileageTo = Number(filters.mileageTo);
    }

    console.log('Fetching cars with params:', params);
    console.log('Full URL:', `${API_BASE_URL}/api/cars`);
    
    const response = await api.get('/api/cars', { params });
    
    console.log('API response status:', response.status);
    console.log('API response data:', JSON.stringify(response.data, null, 2));
    
    // API typically returns data in format: { data: [...], total: number }
    // or directly as array
    if (Array.isArray(response.data)) {
      console.log('Returning array directly, count:', response.data.length);
      return response.data;
    }
    
    // Check for nested data array
    if (response.data?.data && Array.isArray(response.data.data)) {
      console.log('Returning response.data.data, count:', response.data.data.length);
      return response.data.data;
    }
    
    // Check for cars property
    if (response.data?.cars && Array.isArray(response.data.cars)) {
      console.log('Returning response.data.cars, count:', response.data.cars.length);
      return response.data.cars;
    }
    
    // Check for items property (some APIs use this)
    if (response.data?.items && Array.isArray(response.data.items)) {
      console.log('Returning response.data.items, count:', response.data.items.length);
      return response.data.items;
    }
    
    console.warn('Unexpected response format:', response.data);
    return [];
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

