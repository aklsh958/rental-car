'use client';

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useState,
  useRef,
} from 'react';
import { useCarsStore } from '@/store/carsStore';
import { FilterState } from '@/types';
import styles from './SearchFilters.module.css';

const PRICE_OPTIONS = Array.from(
  { length: 8 },
  (_, idx) => `${(idx + 3) * 10}`
);

export default function SearchFilters() {
  const { setFilters, loadCars, isLoading } = useCarsStore();

  const initialFormState = useMemo(
    () => ({
      brand: '',
      price: '',
      mileageFrom: '',
      mileageTo: '',
    }),
    []
  );

  const [formState, setFormState] = useState(initialFormState);
  const [brandOptions, setBrandOptions] = useState<string[]>([]);
  const brandsLoadedRef = useRef(false);

  useEffect(() => {
    if (brandsLoadedRef.current) {
      return;
    }

    const brands = [
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
    ];

    setBrandOptions(brands);
    brandsLoadedRef.current = true;
  }, []);

  const handleChange = (
    event: ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Build complete filters object - empty strings for unused filters
    const filters: FilterState = {
      brand: formState.brand && formState.brand.trim() !== '' ? formState.brand.trim() : '',
      price: formState.price && formState.price.trim() !== '' ? formState.price.trim() : '',
      mileageFrom: formState.mileageFrom && formState.mileageFrom.trim() !== '' ? formState.mileageFrom.trim() : '',
      mileageTo: formState.mileageTo && formState.mileageTo.trim() !== '' ? formState.mileageTo.trim() : '',
    };

    console.log('SearchFilters: Submitting filters', filters);
    setFilters(filters);
    loadCars(filters, 1);
  };

  const sortedBrandOptions = useMemo(() => {
    return [...brandOptions].sort((a, b) => a.localeCompare(b));
  }, [brandOptions]);

  return (
    <form onSubmit={handleSubmit} aria-label="Search filters" className={styles.searchForm}>
      <div className={styles.fieldWrapper}>
        <label htmlFor="brand" className={styles.fieldLabel}>
          Car brand
        </label>
        <select
          id="brand"
          name="brand"
          value={formState.brand}
          onChange={handleChange}
          className={styles.brandSelect}
        >
          <option value="">Choose a brand</option>
          {sortedBrandOptions.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.fieldWrapper}>
        <label htmlFor="price" className={styles.fieldLabel}>
          Price/ 1 hour
        </label>
        <select
          id="price"
          name="price"
          value={formState.price}
          onChange={handleChange}
          className={styles.priceSelect}
        >
          <option value="">Any price</option>
          {PRICE_OPTIONS.map((price) => (
            <option key={price} value={price}>
              To ${price}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.distanceField}>
        <span className={styles.fieldLabel}>Car mileage / km</span>
        <div className={styles.distanceInputs}>
          <div className={styles.distanceInputContainer}>
            <span className={styles.distancePlaceholder}>From</span>
            <input
              name="mileageFrom"
              type="number"
              min={0}
              value={formState.mileageFrom}
              onChange={handleChange}
              aria-label="Minimum mileage"
              className={styles.distanceFieldInput}
            />
          </div>
          <div className={styles.distanceInputContainer}>
            <span className={styles.distancePlaceholder}>To</span>
            <input
              name="mileageTo"
              type="number"
              min={0}
              value={formState.mileageTo}
              onChange={handleChange}
              aria-label="Maximum mileage"
              className={styles.distanceFieldInput}
            />
          </div>
        </div>
      </div>

      <button type="submit" disabled={isLoading} className={styles.searchBtn}>
        Search
      </button>
    </form>
  );
}

