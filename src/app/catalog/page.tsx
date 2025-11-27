'use client';

import { useEffect, useRef } from 'react';
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
  } = useCarsStore();

  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;

    const emptyFilters = {
      brand: '',
      price: '',
      mileageFrom: '',
      mileageTo: '',
    };
    
    loadCars(emptyFilters, 1).finally(() => {
      hasInitialized.current = true;
    });
  }, [loadCars]);

  const showLoaderOnly = isLoading && filteredCars.length === 0;

  return (
    <section className={styles.catalogPage}>
      <div className={`container ${styles.container}`}>
        <h1 className={styles.pageTitle}>Catalog</h1>
        
        <Filters />

        {showLoaderOnly ? (
          <div className={styles.loaderContainer}>
            <div className="loader" />
          </div>
        ) : (
          <>
            {isLoading && filteredCars.length > 0 && (
              <div className={styles.loaderOverlay}>
                <div className="loader" />
              </div>
            )}
            <CarList cars={filteredCars} />
          </>
        )}

        {hasMore && (
          <div className={styles.loadMoreContainer}>
            <button
              type="button"
              onClick={loadMoreCars}
              disabled={isLoading}
              className={styles.loadMoreButton}
            >
              {isLoading ? 'Loading…' : 'Load more'}
            </button>
          </div>
        )}

        {!hasMore && !isLoading && filteredCars.length > 0 && (
          <p aria-live="polite" className={styles.statusMessage}>
            You&apos;ve reached the end of the catalog.
          </p>
        )}
      </div>
    </section>
  );
}

