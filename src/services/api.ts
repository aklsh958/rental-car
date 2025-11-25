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

    console.log('Fetching cars with params:', params);
    
    // Try different endpoints - API might use /cars instead of /api/cars
    let response;
    try {
      // First try /api/cars
      console.log('Trying /api/cars');
      response = await api.get('/api/cars', { params });
    } catch (error: any) {
      if (error.response?.status === 404) {
        // If 404, try /cars
        console.log('404 on /api/cars, trying /cars');
        try {
          response = await api.get('/cars', { params });
        } catch (error2: any) {
          if (error2.response?.status === 404) {
            // Try root endpoint
            console.log('404 on /cars, trying root');
            response = await api.get('/', { params });
          } else {
            throw error2;
          }
        }
      } else {
        throw error;
      }
    }
    
    console.log('Full URL:', response.config.url);
    
    console.log('=== API RESPONSE DEBUG ===');
    console.log('Status:', response.status);
    console.log('Full response:', response);
    console.log('Response data:', response.data);
    console.log('Response data type:', typeof response.data);
    console.log('Is array?', Array.isArray(response.data));
    
    if (response.data) {
      if (typeof response.data === 'object' && !Array.isArray(response.data)) {
        console.log('Response data keys:', Object.keys(response.data));
        console.log('Response data structure:', {
          hasData: !!response.data.data,
          hasCars: !!response.data.cars,
          hasItems: !!response.data.items,
          hasResults: !!response.data.results,
          hasRecords: !!response.data.records,
          total: response.data.total,
          count: response.data.count,
          length: response.data.length,
        });
        
        // Log full structure
        console.log('Full response.data:', JSON.stringify(response.data, null, 2));
      } else if (Array.isArray(response.data)) {
        console.log('Response is array, length:', response.data.length);
        if (response.data.length > 0) {
          console.log('First item:', response.data[0]);
        }
      }
    } else {
      console.warn('Response data is null or undefined!');
    }
    console.log('=== END DEBUG ===');
    
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
    try {
      await api.post('/api/rentals', data);
    } catch (error: any) {
      if (error.response?.status === 404) {
        await api.post('/rentals', data);
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error('Error submitting rental:', error);
    throw error;
  }
};

