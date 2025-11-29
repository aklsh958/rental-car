'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useCarsStore } from '@/store/carsStore';
import { Car } from '@/types';
import { formatMileage } from '@/services/api';
import { HeartIcon, LocationPinIcon, CheckIcon, CalendarIcon, CarIcon, FuelIcon, GearIcon } from '@/components/Icons/Icons';
import RentalForm from './RentalForm';
import styles from './CarDetails.module.css';

interface CarDetailsProps {
  car: Car;
}

export default function CarDetails({ car }: CarDetailsProps) {
  const { favorites, addToFavorites, removeFromFavorites } = useCarsStore();
  const isFavorite = favorites.includes(car.id);
  const [isReady] = useState(true);

  const storageKey = `booking-form-${car.id}`;

  const handleFavoriteClick = () => {
    if (isFavorite) {
      removeFromFavorites(car.id);
    } else {
      addToFavorites(car.id);
    }
  };

  const addressParts = car.address?.split(', ') ?? [];
  const city = addressParts.slice(1, -1).join(', ');
  const country = addressParts.slice(-1).join('');
  const location = [city, country].filter(Boolean).join(', ');
  const mileageFormatted = `${formatMileage(car.mileage)} km`;

  const rentalConditions = (Array.isArray(car.rentalConditions)
    ? car.rentalConditions
    : typeof car.rentalConditions === 'string'
    ? car.rentalConditions.split('\n').filter((line) => line.trim())
    : []).map((condition) => {
    const [label, value] = condition.split(':');
    return {
      label: label?.trim() || condition,
      value: value ? value.trim() : null,
    };
  });

  const specifications = [
    { label: 'Year', value: car.year, icon: CalendarIcon },
    { label: 'Type', value: car.type, icon: CarIcon },
    { label: 'Fuel Consumption', value: `${car.fuelConsumption}`, icon: FuelIcon },
    { label: 'Engine Size', value: car.engineSize, icon: GearIcon },
  ];

  const accessories = [...(car.accessories || []), ...(car.functionalities || [])];

  if (!isReady) {
    return (
      <div className={styles.carDetails}>
        <div className={styles.leftSection}>
          <div className={styles.carImageSection} style={{ minHeight: '268px' }} />
          <div className={styles.rentalFormSection} style={{ minHeight: '400px' }} />
        </div>
        <div className={styles.rightSection} style={{ minHeight: '600px' }} />
      </div>
    );
  }

  return (
    <section className={styles.carDetails}>
      <div className="container">
        <div className={styles.detailsWrapper}>
          <div className={styles.mediaColumn}>
            <div className={styles.imageWrapper}>
              <Image
                className={styles.image}
                src={car.img || '/placeholder-car.jpg'}
                alt={`${car.make} ${car.model}`}
                width={640}
                height={512}
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 640px"
              />
              <button
                onClick={handleFavoriteClick}
                className={`${styles.favoriteButton} ${isFavorite ? styles.favoriteActive : ''}`}
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <HeartIcon filled={isFavorite} />
              </button>
            </div>

            <RentalForm carId={car.id} storageKey={storageKey} />
          </div>

          <div className={styles.infoPanel}>
            <div className={styles.titleRow}>
              <h1 className={styles.carTitle}>
                {car.make} {car.model}, {car.year}
              </h1>

              <div className={styles.metaRow}>
                <span className={styles.metaItem}>
                  <LocationPinIcon className={styles.metaIcon} />
                  {location}
                </span>
                <span className={styles.metaItem}>
                  Mileage: {mileageFormatted}
                </span>
              </div>
              <p className={styles.price}>
                {typeof car.rentalPrice === 'string' && car.rentalPrice.startsWith('$') 
                  ? car.rentalPrice 
                  : `$${car.rentalPrice}`}
              </p>
              <p className={styles.description}>{car.description}</p>
            </div>

            <div className={styles.mainDesc}>
              {rentalConditions.length > 0 && (
                <div className={styles.wrapper}>
                  <h3 className={styles.wrapperTitle}>Rental Conditions:</h3>
                  <ul className={styles.conditionsList}>
                    {rentalConditions.map((condition, index) => (
                      <li
                        className={styles.conditionItem}
                        key={`${condition.label}-${index}`}
                      >
                        <CheckIcon className={styles.conditionIcon} />
                        <span>
                          {condition.label}
                          {condition.value && (
                            <span className={styles.conditionValue}>
                              : {condition.value}
                            </span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className={styles.wrapper}>
                <h3 className={styles.wrapperTitle}>Car Specifications:</h3>
                <ul className={styles.specList}>
                  {specifications.map((spec) => {
                    const IconComponent = spec.icon;
                    return (
                      <li className={styles.specItem} key={spec.label}>
                        <IconComponent className={styles.specIcon} />
                        <span>
                          {spec.label}: {spec.value}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {accessories.length > 0 && (
                <div className={styles.wrapper}>
                  <h3 className={styles.wrapperTitle}>
                    Accessories and functionalities:
                  </h3>
                  <ul className={styles.specList}>
                    {accessories.map((item) => (
                      <li className={styles.specItem} key={item}>
                        <CheckIcon className={styles.specIcon} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
