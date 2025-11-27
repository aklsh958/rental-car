'use client';

import { useEffect } from 'react';
import { useCarsStore } from '@/store/carsStore';
import CarList from '@/components/CarList/CarList';
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
        <h1 className={styles.pageTitle}>Catalog</h1>
        
        <Filters />
        
        {isLoading && filteredCars.length === 0 ? (
          <div className="loader" />
        ) : (
          <>
            <CarList cars={filteredCars} />
            
            {hasMore && (
              <div className={styles.loadMoreContainer}>
                <button
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  className={styles.loadMoreButton}
                >
                  {isLoading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

