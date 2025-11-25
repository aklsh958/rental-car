'use client';

import { useEffect } from 'react';
import { useCarsStore } from '@/store/carsStore';
import CarCard from '@/components/CarCard/CarCard';
import Filters from '@/components/Filters/Filters';
import styles from './page.module.css';

export default function CatalogPage() {
  const {
    filteredCars,
    isLoading,
    hasMore,
    loadCars,
    loadMoreCars,
    filters,
  } = useCarsStore();

  useEffect(() => {
    // Load cars on mount without filters first
    const emptyFilters = {
      brand: '',
      price: '',
      mileageFrom: '',
      mileageTo: '',
    };
    loadCars(emptyFilters, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLoadMore = () => {
    loadMoreCars();
  };

  return (
    <main className={styles.catalogPage}>
      <div className="container">
        <h1 className={styles.pageTitle}>Каталог</h1>
        
        <Filters />
        
        {isLoading && filteredCars.length === 0 ? (
          <div className="loader" />
        ) : filteredCars.length === 0 ? (
          <div className={styles.noResults}>
            <p>Автомобілів не знайдено. Спробуйте змінити фільтри.</p>
          </div>
        ) : (
          <>
            <div className={styles.carsGrid}>
              {filteredCars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
            
            {hasMore && (
              <div className={styles.loadMoreContainer}>
                <button
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  className={styles.loadMoreButton}
                >
                  {isLoading ? 'Завантаження...' : 'Завантажити ще'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

