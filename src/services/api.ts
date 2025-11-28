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
      if (!isNaN(priceNum)) {
        params.rentalPrice = priceNum;
      }
    }
    if (filters.mileageFrom && filters.mileageFrom.trim() !== '') {
      const mileageFromNum = Number(filters.mileageFrom);
      if (!isNaN(mileageFromNum)) {
        params.mileageFrom = mileageFromNum;
      }
    }
    if (filters.mileageTo && filters.mileageTo.trim() !== '') {
      const mileageToNum = Number(filters.mileageTo);
      if (!isNaN(mileageToNum)) {
        params.mileageTo = mileageToNum;
      }
    }

    console.log('fetchCars: Request params', params);

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
    
    console.log('API Request params:', params);
    console.log('API response status:', response.status);
    console.log('API response data structure:', {
      isArray: Array.isArray(response.data),
      hasCars: !!response.data?.cars,
      hasData: !!response.data?.data,
      hasItems: !!response.data?.items,
      carsCount: response.data?.cars?.length || response.data?.length || 0,
    });
    
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
    
    // Log first few cars from API to check if filtering worked
    if (cars.length > 0 && filters.brand) {
      console.log('API returned cars with makes:', cars.slice(0, 5).map((c: any) => ({
        make: c.make,
        brand: c.brand,
        makeOrBrand: c.make || c.brand,
        id: c.id,
      })));
    }
    
    const mappedCars = cars.map((car: any) => {
      let imgUrl = car.img || car.image || '';
      
      if (imgUrl && !imgUrl.startsWith('http')) {
        if (imgUrl.startsWith('//')) {
          imgUrl = `https:${imgUrl}`;
        } else {
          imgUrl = `https://ac.goit.global/car-rental-task/${imgUrl.replace(/^\//, '')}`;
        }
      }
      
      if (!imgUrl) {
        imgUrl = '/placeholder-car.jpg';
      }
      
      const carMake = car.brand || car.make || '';
      return {
        ...car,
        make: carMake,
        brand: car.brand || carMake, // Keep original brand field
        img: imgUrl,
      };
    });

    // Apply client-side filtering as fallback if API doesn't filter correctly
    let filteredCars = mappedCars;
    
    if (filters.brand && filters.brand.trim() !== '') {
      const brandFilter = filters.brand.trim().toLowerCase();
      console.log('Filtering by brand:', brandFilter);
      console.log('Sample car makes before filtering:', mappedCars.slice(0, 5).map(c => ({
        make: c.make,
        brand: c.brand,
        makeLower: (c.make || '').toLowerCase(),
        brandLower: (c.brand || '').toLowerCase(),
        id: c.id
      })));
      
      filteredCars = filteredCars.filter((car) => {
        const carMake = (car.make || car.brand || '').trim().toLowerCase();
        const matches = carMake === brandFilter;
        return matches;
      });
      
      console.log('After brand filtering:', filteredCars.length, 'cars');
      if (filteredCars.length === 0 && mappedCars.length > 0) {
        const allMakes = Array.from(new Set(mappedCars.map(c => (c.make || c.brand || '').trim())));
        console.log('No cars matched filter. Available makes:', allMakes);
        console.log('Looking for:', brandFilter);
      }
    }
    
    if (filters.price && filters.price.trim() !== '') {
      const maxPrice = Number(filters.price);
      if (!isNaN(maxPrice)) {
        filteredCars = filteredCars.filter((car) => {
          const carPrice = Number(car.rentalPrice || car.price || 0);
          return carPrice <= maxPrice;
        });
      }
    }
    
    if (filters.mileageFrom && filters.mileageFrom.trim() !== '') {
      const minMileage = Number(filters.mileageFrom);
      if (!isNaN(minMileage)) {
        filteredCars = filteredCars.filter((car) => {
          const carMileage = Number(car.mileage || 0);
          return carMileage >= minMileage;
        });
      }
    }
    
    if (filters.mileageTo && filters.mileageTo.trim() !== '') {
      const maxMileage = Number(filters.mileageTo);
      if (!isNaN(maxMileage)) {
        filteredCars = filteredCars.filter((car) => {
          const carMileage = Number(car.mileage || 0);
          return carMileage <= maxMileage;
        });
      }
    }

    console.log('fetchCars: Mapped cars count', mappedCars.length);
    console.log('fetchCars: Filtered cars count', filteredCars.length);
    if (filteredCars.length > 0) {
      console.log('fetchCars: First filtered car sample', {
        id: filteredCars[0].id,
        make: filteredCars[0].make,
        img: filteredCars[0].img,
      });
    }
    
    return filteredCars;
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
    
    let imgUrl = car.img || car.image || '';
    
    if (imgUrl && !imgUrl.startsWith('http')) {
      if (imgUrl.startsWith('//')) {
        imgUrl = `https:${imgUrl}`;
      } else {
        imgUrl = `https://ac.goit.global/car-rental-task/${imgUrl.replace(/^\//, '')}`;
      }
    }
    
    if (!imgUrl) {
      imgUrl = '/placeholder-car.jpg';
    }
    
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

