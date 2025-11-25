'use client';

import { useEffect, useState } from 'react';
import { useCarsStore } from '@/store/carsStore';
import styles from './Filters.module.css';

// Price options
const PRICE_OPTIONS = [
  { value: '', label: 'All prices' },
  { value: '30', label: 'Up to $30' },
  { value: '40', label: 'Up to $40' },
  { value: '50', label: 'Up to $50' },
  { value: '60', label: 'Up to $60' },
  { value: '70', label: 'Up to $70' },
  { value: '80', label: 'Up to $80' },
  { value: '90', label: 'Up to $90' },
  { value: '100', label: 'Up to $100' },
];

export default function Filters() {
  const { filters, setFilters, loadCars, resetFilters } = useCarsStore();
  const [localFilters, setLocalFilters] = useState(filters);
  const [brands, setBrands] = useState<string[]>([]);

  // Sync local filters with store filters only on mount
  useEffect(() => {
    setLocalFilters(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch available brands (this would ideally come from an API)
  useEffect(() => {
    // For now, we'll use common car brands
    // In a real app, this would come from the API
    setBrands([
      'Buick',
      'Volvo',
      'HUMMER',
      'Subaru',
      'Mitsubishi',
      'Nissan',
      'Lincoln',
      'GMC',
      'Hyundai',
      'MINI',
      'Bentley',
      'Mercedes-Benz',
      'Aston Martin',
      'Pontiac',
      'Lamborghini',
      'Audi',
      'BMW',
      'Chevrolet',
      'Chrysler',
      'Kia',
      'Land',
    ]);
  }, []);

  const handleFilterChange = (name: string, value: string) => {
    const newFilters = { ...localFilters, [name]: value };
    setLocalFilters(newFilters);
  };

  const handleSearch = () => {
    setFilters(localFilters);
    loadCars(localFilters, 1);
  };

  const handleReset = () => {
    setLocalFilters({
      brand: '',
      price: '',
      mileageFrom: '',
      mileageTo: '',
    });
    resetFilters();
    loadCars({}, 1);
  };

  return (
    <div className={styles.filtersContainer}>
      <div className={styles.filtersGrid}>
        <div className={styles.filterGroup}>
          <label htmlFor="brand" className={styles.filterLabel}>
            Car brand
          </label>
          <select
            id="brand"
            value={localFilters.brand}
            onChange={(e) => handleFilterChange('brand', e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">Enter the text</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor="price" className={styles.filterLabel}>
            Price/1 hour
          </label>
          <select
            id="price"
            value={localFilters.price}
            onChange={(e) => handleFilterChange('price', e.target.value)}
            className={styles.filterSelect}
          >
            {PRICE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor="mileageFrom" className={styles.filterLabel}>
            Car mileage / km
          </label>
          <div className={styles.mileageInputs}>
            <input
              id="mileageFrom"
              type="number"
              value={localFilters.mileageFrom}
              onChange={(e) => handleFilterChange('mileageFrom', e.target.value)}
              placeholder="From"
              className={styles.filterInput}
              min="0"
            />
            <input
              id="mileageTo"
              type="number"
              value={localFilters.mileageTo}
              onChange={(e) => handleFilterChange('mileageTo', e.target.value)}
              placeholder="To"
              className={styles.filterInput}
              min="0"
            />
          </div>
        </div>
      </div>

      <div className={styles.filterActions}>
        <button onClick={handleSearch} className={styles.searchButton}>
          Search
        </button>
        <button onClick={handleReset} className={styles.resetButton}>
          Reset
        </button>
      </div>
    </div>
  );
}

