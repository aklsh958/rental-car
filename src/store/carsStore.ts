import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Car, FilterState, CarsState } from '@/types';
import { fetchCars, fetchCarById } from '@/services/api';

interface CarsStore extends CarsState {
  setCars: (cars: Car[]) => void;
  setFilteredCars: (cars: Car[]) => void;
  addToFavorites: (carId: string) => void;
  removeFromFavorites: (carId: string) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;
  setLoading: (loading: boolean) => void;
  setPage: (page: number) => void;
  setHasMore: (hasMore: boolean) => void;
  loadCars: (filters?: Partial<FilterState>, page?: number) => Promise<void>;
  loadMoreCars: () => Promise<void>;
  getCarById: (id: string) => Promise<Car | null>;
}

const initialFilters: FilterState = {
  brand: '',
  price: '',
  mileageFrom: '',
  mileageTo: '',
};

export const useCarsStore = create<CarsStore>()(
  persist(
    (set, get) => ({
      cars: [],
      filteredCars: [],
      favorites: [],
      filters: initialFilters,
      isLoading: false,
      page: 1,
      hasMore: true,

      setCars: (cars) => set({ cars }),

      setFilteredCars: (filteredCars) => set({ filteredCars }),
      
      addToFavorites: (carId) =>
        set((state) => {
          if (state.favorites.includes(carId)) {
            return state;
          }
          return {
            favorites: [...state.favorites, carId],
          };
        }),
      
      removeFromFavorites: (carId) =>
        set((state) => ({
          favorites: state.favorites.filter((id) => id !== carId),
        })),
      
      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        })),
      
      resetFilters: () => set({ filters: initialFilters }),
      
      setLoading: (isLoading) => set({ isLoading }),
      
      setPage: (page) => set({ page }),
      
      setHasMore: (hasMore) => set({ hasMore }),
      
      loadCars: async (filters, page = 1) => {
        const currentFilters = filters || get().filters;

        console.log('loadCars: Called with filters', currentFilters, 'page', page);

        set({ filteredCars: [], page: 1, hasMore: true, isLoading: true });
        set({ filters: currentFilters as FilterState });

        try {
          const cars = await fetchCars(currentFilters, page);

          console.log('loadCars: Received cars', cars.length);

          set({
            filteredCars: cars,
            cars: cars,
            page,
            hasMore: cars.length >= 12,
            isLoading: false,
          });
        } catch (error) {
          console.error('Error loading cars:', error);
          set({ isLoading: false, filteredCars: [] });
        }
      },
      
      loadMoreCars: async () => {
        const { filters, page, hasMore, isLoading } = get();
        
        if (!hasMore || isLoading) return;
        
        set({ isLoading: true });
        
        try {
          const nextPage = page + 1;
          const cars = await fetchCars(filters, nextPage);
          
          set((state) => ({
            filteredCars: [...state.filteredCars, ...cars],
            cars: [...state.cars, ...cars],
            page: nextPage,
            hasMore: cars.length >= 12,
            isLoading: false,
          }));
        } catch (error) {
          console.error('Error loading more cars:', error);
          set({ isLoading: false });
        }
      },
      
      getCarById: async (id: string) => {
        try {
          const car = await fetchCarById(id);
          return car;
        } catch (error) {
          console.error('Error fetching car:', error);
          return null;
        }
      },
    }),
    {
      name: 'cars-storage',
      partialize: (state) => ({
        favorites: state.favorites,
      }),
    }
  )
);

