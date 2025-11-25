'use client';

import { useEffect, useState } from 'react';
import { useCarsStore } from '@/store/carsStore';
import styles from './Filters.module.css';

// Price options
const PRICE_OPTIONS = [
  { value: '', label: 'Всі ціни' },
  { value: '30', label: 'До $30' },
  { value: '40', label: 'До $40' },
  { value: '50', label: 'До $50' },
  { value: '60', label: 'До $60' },
  { value: '70', label: 'До $70' },
  { value: '80', label: 'До $80' },
  { value: '90', label: 'До $90' },
  { value: '100', label: 'До $100' },
];

export default function Filters() {
  const { filters, setFilters, loadCars, resetFilters } = useCarsStore();
  const [localFilters, setLocalFilters] = useState(filters);
  const [brands, setBrands] = useState<string[]>([]);

  // Sync local filters with store filters
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

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
            Бренд
          </label>
          <select
            id="brand"
            value={localFilters.brand}
            onChange={(e) => handleFilterChange('brand', e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">Всі бренди</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor="price" className={styles.filterLabel}>
            Ціна за 1 год
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
            Пробіг від
          </label>
          <input
            id="mileageFrom"
            type="number"
            value={localFilters.mileageFrom}
            onChange={(e) => handleFilterChange('mileageFrom', e.target.value)}
            placeholder="Від"
            className={styles.filterInput}
            min="0"
          />
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor="mileageTo" className={styles.filterLabel}>
            Пробіг до
          </label>
          <input
            id="mileageTo"
            type="number"
            value={localFilters.mileageTo}
            onChange={(e) => handleFilterChange('mileageTo', e.target.value)}
            placeholder="До"
            className={styles.filterInput}
            min="0"
          />
        </div>
      </div>

      <div className={styles.filterActions}>
        <button onClick={handleSearch} className={styles.searchButton}>
          Пошук
        </button>
        <button onClick={handleReset} className={styles.resetButton}>
          Скинути
        </button>
      </div>
    </div>
  );
}

