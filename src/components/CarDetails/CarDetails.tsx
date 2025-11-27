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

  const rentalConditions = Array.isArray(car.rentalConditions)
    ? car.rentalConditions
    : typeof car.rentalConditions === 'string'
    ? car.rentalConditions.split('\n').filter((line) => line.trim())
    : [];

  const allFeatures = [
    ...(car.accessories || []),
    ...(car.functionalities || []),
  ];

  const handleFavoriteClick = () => {
    if (isFavorite) {
      removeFromFavorites(car.id);
    } else {
      addToFavorites(car.id);
    }
  };

  const addressParts = car.address.split(',');
  const city = addressParts[1]?.trim() || addressParts[0]?.trim() || '';
  const country = addressParts[2]?.trim() || 'Ukraine';

  const carIdMatch = car.id.match(/\d+/);
  const carId = carIdMatch ? carIdMatch[0] : car.id.split('-')[0] || car.id.substring(0, 4);

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
    <div className={styles.carDetails}>
      <div className={styles.leftSection}>
        <div className={styles.carImageSection}>
          <Image
            src={car.img || '/placeholder-car.jpg'}
            alt={`${car.make} ${car.model}`}
            fill
            className={styles.carImage}
            sizes="(max-width: 1024px) 100vw, 50vw"
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

      <div className={styles.rightSection}>
        <div className={styles.carHeader}>
          <div className={styles.carTitleRow}>
            <h1 className={styles.carTitle}>
              {car.make} {car.model}, {car.year}
            </h1>
            <span className={styles.carId}>Id: {carId}</span>
          </div>
        </div>

        <div className={styles.carLocation}>
          <LocationPinIcon className={styles.locationIcon} />
          <span>{city}, {country}</span>
        </div>

        <div className={styles.carMileage}>
          Mileage: {formatMileage(car.mileage)} km
        </div>

        <div className={styles.carPrice}>
          {typeof car.rentalPrice === 'string' && car.rentalPrice.startsWith('$') 
            ? car.rentalPrice 
            : `$${car.rentalPrice}`}
        </div>

        <div className={styles.description}>
          <p>{car.description}</p>
        </div>

        {rentalConditions.length > 0 && (
          <div className={styles.rentalConditions}>
            <h2 className={styles.sectionTitle}>Rental Conditions:</h2>
            <ul className={styles.conditionsList}>
              {rentalConditions.map((condition, index) => (
                <li key={index}>
                  <CheckIcon className={styles.checkIcon} />
                  {condition}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className={styles.carSpecifications}>
          <h2 className={styles.sectionTitle}>Car Specifications:</h2>
          <div className={styles.specsGrid}>
            <div className={styles.specItem}>
              <CalendarIcon className={styles.specIcon} />
              <span>Year: {car.year}</span>
            </div>
            <div className={styles.specItem}>
              <CarIcon className={styles.specIcon} />
              <span>Type: {car.type}</span>
            </div>
            <div className={styles.specItem}>
              <FuelIcon className={styles.specIcon} />
              <span>Fuel Consumption: {car.fuelConsumption}</span>
            </div>
            <div className={styles.specItem}>
              <GearIcon className={styles.specIcon} />
              <span>Engine Size: {car.engineSize}</span>
            </div>
          </div>
        </div>

        {allFeatures.length > 0 && (
          <div className={styles.accessoriesSection}>
            <h2 className={styles.sectionTitle}>
              Accessories and functionalities:
            </h2>
            <ul className={styles.featuresList}>
              {allFeatures.map((feature, index) => (
                <li key={index}>
                  <CheckIcon className={styles.checkIcon} />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
