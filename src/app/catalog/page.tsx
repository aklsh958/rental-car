'use client';

import { useEffect, useRef } from 'react';
import { useCarsStore } from '@/store/carsStore';
import CarList from '@/components/CarList/CarList';
import SearchFilters from '@/components/SearchFilters/SearchFilters';
import styles from './page.module.css';

export default function CatalogPage() {
  const {
    filteredCars,
    isLoading,
    hasMore,
    loadCars,
    loadMoreCars,
  } = useCarsStore();

  const initializationRef = useRef(false);

  useEffect(() => {
    if (initializationRef.current) {
      return;
    }

    const defaultFilters = {
      brand: '',
      price: '',
      mileageFrom: '',
      mileageTo: '',
    };

    loadCars(defaultFilters, 1).finally(() => {
      initializationRef.current = true;
    });
  }, [loadCars]);

  const shouldShowLoaderOnly = isLoading && filteredCars.length === 0;
  const shouldShowLoaderOverlay = isLoading && filteredCars.length > 0;
  const canLoadMore = hasMore && !isLoading;
  const hasNoResults = !hasMore && !isLoading && filteredCars.length === 0;

  return (
    <section className={styles.catalogSection}>
      <div className={`container ${styles.container}`}>
        <h1 className={styles.pageTitle}>Catalog</h1>
        
        <SearchFilters />

        {shouldShowLoaderOnly && (
          <div className={styles.loaderContainer}>
            <div className="loader" />
          </div>
        )}

        {!shouldShowLoaderOnly && (
          <>
            {shouldShowLoaderOverlay && (
              <div className={styles.loaderOverlay}>
                <div className="loader" />
              </div>
            )}
            <CarList cars={filteredCars} />
          </>
        )}

        {canLoadMore && (
          <div className={styles.loadMoreWrapper}>
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

        {hasNoResults && (
          <p role="alert" aria-live="assertive" className={styles.error}>
            No cars found. Try adjusting the filters.
          </p>
        )}

        {!hasMore && !isLoading && filteredCars.length > 0 && (
          <p aria-live="polite" className={styles.statusText}>
            You&apos;ve reached the end of the catalog.
          </p>
        )}
      </div>
    </section>
  );
}

