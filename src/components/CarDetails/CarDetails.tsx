'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useCarsStore } from '@/store/carsStore';
import { Car } from '@/types';
import { formatMileage, submitRental } from '@/services/api';
import { HeartIcon, LocationPinIcon, CheckIcon, CalendarIcon, CarIcon, FuelIcon, GearIcon } from '@/components/Icons/Icons';
import styles from './CarDetails.module.css';

interface CarDetailsProps {
  car: Car;
}

export default function CarDetails({ car }: CarDetailsProps) {
  const { favorites, addToFavorites, removeFromFavorites } = useCarsStore();
  const isFavorite = favorites.includes(car.id);
  const [showNotification, setShowNotification] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bookingDate: '',
    comment: '',
  });

  // Parse rental conditions - API returns array or string
  const rentalConditions = Array.isArray(car.rentalConditions)
    ? car.rentalConditions
    : typeof car.rentalConditions === 'string'
    ? car.rentalConditions.split('\n').filter((line) => line.trim())
    : [];

  // Combine accessories and functionalities
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await submitRental({
        carId: car.id,
        name: formData.name,
        email: formData.email,
        phone: '', // Not in form but required by API
        message: formData.comment,
      });

      setShowNotification(true);
      setFormData({
        name: '',
        email: '',
        bookingDate: '',
        comment: '',
      });

      setTimeout(() => {
        setShowNotification(false);
      }, 5000);
    } catch (error) {
      console.error('Error submitting rental:', error);
      alert('Помилка при відправці форми. Спробуйте ще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Extract city and country from address
  const addressParts = car.address.split(',');
  const city = addressParts[1]?.trim() || addressParts[0]?.trim() || '';
  const country = addressParts[2]?.trim() || 'Ukraine';

  // Extract ID from car (might be in different format)
  const carId = car.id.split('-')[0] || car.id.substring(0, 4);

  return (
    <div className={styles.carDetails}>
      {/* Left Section - Image and Form */}
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
            aria-label={isFavorite ? 'Видалити з обраних' : 'Додати до обраних'}
          >
            <HeartIcon filled={isFavorite} />
          </button>
        </div>

        <div className={styles.rentalFormSection}>
          <h2 className={styles.formTitle}>Book your car now</h2>
          <p className={styles.formSubtitle}>
            Stay connected! We are always ready to help you.
          </p>
          <form onSubmit={handleSubmit} className={styles.rentalForm}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.formLabel}>
                Name*
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className={styles.formInput}
                placeholder="Name*"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.formLabel}>
                Email*
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className={styles.formInput}
                placeholder="Email*"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="bookingDate" className={styles.formLabel}>
                Booking date
              </label>
              <div className={styles.dateInputWrapper}>
                <CalendarIcon className={styles.dateIcon} />
                <input
                  type="date"
                  id="bookingDate"
                  name="bookingDate"
                  value={formData.bookingDate}
                  onChange={handleInputChange}
                  className={styles.formInput}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="comment" className={styles.formLabel}>
                Comment
              </label>
              <textarea
                id="comment"
                name="comment"
                value={formData.comment}
                onChange={handleInputChange}
                rows={4}
                className={styles.formTextarea}
                placeholder="Comment"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={styles.submitButton}
            >
              {isSubmitting ? 'Sending...' : 'Send'}
            </button>
          </form>

          {showNotification && (
            <div className={styles.notification}>
              <p>✅ Booking successful! We will contact you soon.</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Section - Car Info */}
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

        <div className={styles.carPrice}>{car.rentalPrice}</div>

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
