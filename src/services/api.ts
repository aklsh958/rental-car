import axios from 'axios';
import { Car, FilterState } from '@/types';

const API_BASE_URL = 'https://car-rental-api.goit.global';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const formatMileage = (mileage: number): string => {
  return mileage.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};
export const fetchCars = async (
  filters: Partial<FilterState> = {},
  page: number = 1
): Promise<Car[]> => {
  try {
    const params: Record<string, string | number> = {
      page,
      limit: 12,
    };

    if (filters.brand && filters.brand.trim() !== '') {
      params.make = filters.brand.trim();
    }
    if (filters.price && filters.price.trim() !== '') {
      const priceNum = Number(filters.price);
      params.rentalPrice = priceNum;
    }
    if (filters.mileageFrom && filters.mileageFrom.trim() !== '') {
      params.mileageFrom = Number(filters.mileageFrom);
    }
    if (filters.mileageTo && filters.mileageTo.trim() !== '') {
      params.mileageTo = Number(filters.mileageTo);
    }

    let response;
    try {
      response = await api.get('/api/cars', { params });
    } catch (error: any) {
      if (error.response?.status === 404) {
        response = await api.get('/cars', { params });
      } else {
        throw error;
      }
    }
    if (process.env.NODE_ENV === 'development') {
      console.log('API Request params:', params);
      console.log('API response status:', response.status);
      console.log('API response data structure:', {
        isArray: Array.isArray(response.data),
        hasCars: !!response.data?.cars,
        hasData: !!response.data?.data,
        hasItems: !!response.data?.items,
        carsCount: response.data?.cars?.length || response.data?.length || 0,
      });
    }
    
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
    
    const mappedCars = cars.map((car: any) => {
      const imgUrl = car.img || car.image || '';
      
      return {
        ...car,
        make: car.brand || car.make,
        img: imgUrl,
      };
    });
    
    return mappedCars;
  } catch (error: any) {
    console.error('Error fetching cars:', error);
    if (error.response) {
      console.error('Response error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('Request error:', error.request);
    }
    return [];
  }
};

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
    
    let car: any;
    if (response.data?.data) {
      car = response.data.data;
    } else if (response.data?.car) {
      car = response.data.car;
    } else {
      car = response.data;
    }
    
    const imgUrl = car.img || car.image || '';
    
    return {
      ...car,
      make: car.brand || car.make,
      img: imgUrl,
    };
  } catch (error) {
    console.error('Error fetching car by ID:', error);
    throw error;
  }
};

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

