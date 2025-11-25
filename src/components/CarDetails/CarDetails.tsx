'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useCarsStore } from '@/store/carsStore';
import { Car } from '@/types';
import { formatMileage, submitRental } from '@/services/api';
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
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill={isFavorite ? '#3470ff' : 'none'}
              stroke={isFavorite ? '#3470ff' : 'currentColor'}
              strokeWidth="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
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
              <input
                type="date"
                id="bookingDate"
                name="bookingDate"
                value={formData.bookingDate}
                onChange={handleInputChange}
                className={styles.formInput}
              />
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
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={styles.locationIcon}
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
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
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                    className={styles.checkIcon}
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
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
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={styles.specIcon}
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>Year: {car.year}</span>
            </div>
            <div className={styles.specItem}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={styles.specIcon}
              >
                <path d="M5 18H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2" />
                <path d="M19 18h2a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-2" />
                <rect x="7" y="14" width="10" height="6" rx="1" />
              </svg>
              <span>Type: {car.type}</span>
            </div>
            <div className={styles.specItem}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={styles.specIcon}
              >
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <span>Fuel Consumption: {car.fuelConsumption}</span>
            </div>
            <div className={styles.specItem}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={styles.specIcon}
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
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
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                    className={styles.checkIcon}
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
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
