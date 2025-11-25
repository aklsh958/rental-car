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
    phone: '',
    message: '',
  });

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
        phone: formData.phone,
        message: formData.message,
      });

      setShowNotification(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
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

  return (
    <div className={styles.carDetails}>
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

      <div className={styles.carInfoSection}>
        <h1 className={styles.carTitle}>
          {car.make} {car.model}, {car.year}
        </h1>

        <div className={styles.carSpecs}>
          <div className={styles.specItem}>
            <span className={styles.specLabel}>Місто:</span>
            <span className={styles.specValue}>
              {car.address.split(',')[1]?.trim() || car.address.split(',')[0]?.trim()}
            </span>
          </div>
          <div className={styles.specItem}>
            <span className={styles.specLabel}>Країна:</span>
            <span className={styles.specValue}>
              {car.address.split(',')[2]?.trim() || car.rentalCompany}
            </span>
          </div>
          <div className={styles.specItem}>
            <span className={styles.specLabel}>Тип:</span>
            <span className={styles.specValue}>{car.type}</span>
          </div>
          <div className={styles.specItem}>
            <span className={styles.specLabel}>Модель:</span>
            <span className={styles.specValue}>{car.model}</span>
          </div>
          <div className={styles.specItem}>
            <span className={styles.specLabel}>Пробіг:</span>
            <span className={styles.specValue}>
              {formatMileage(car.mileage)} km
            </span>
          </div>
          <div className={styles.specItem}>
            <span className={styles.specLabel}>Витрата палива:</span>
            <span className={styles.specValue}>{car.fuelConsumption}</span>
          </div>
          <div className={styles.specItem}>
            <span className={styles.specLabel}>Об&apos;єм двигуна:</span>
            <span className={styles.specValue}>{car.engineSize}</span>
          </div>
          <div className={styles.specItem}>
            <span className={styles.specLabel}>Ціна:</span>
            <span className={styles.specValue}>{car.rentalPrice}</span>
          </div>
        </div>

        <div className={styles.description}>
          <h2 className={styles.sectionTitle}>Опис</h2>
          <p>{car.description}</p>
        </div>

        {car.accessories && car.accessories.length > 0 && (
          <div className={styles.accessories}>
            <h2 className={styles.sectionTitle}>Аксесуари:</h2>
            <ul className={styles.accessoriesList}>
              {car.accessories.map((accessory, index) => (
                <li key={index}>{accessory}</li>
              ))}
            </ul>
          </div>
        )}

        {car.functionalities && car.functionalities.length > 0 && (
          <div className={styles.functionalities}>
            <h2 className={styles.sectionTitle}>Функції:</h2>
            <ul className={styles.functionalitiesList}>
              {car.functionalities.map((functionality, index) => (
                <li key={index}>{functionality}</li>
              ))}
            </ul>
          </div>
        )}

        {car.rentalConditions && (
          <div className={styles.rentalConditions}>
            <h2 className={styles.sectionTitle}>Умови оренди:</h2>
            <p className={styles.conditionsText}>{car.rentalConditions}</p>
          </div>
        )}
      </div>

      <div className={styles.rentalFormSection}>
        <h2 className={styles.formTitle}>Оренда автомобіля</h2>
        <form onSubmit={handleSubmit} className={styles.rentalForm}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.formLabel}>
              Ім&apos;я *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className={styles.formInput}
              placeholder="Введіть ваше ім'я"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.formLabel}>
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className={styles.formInput}
              placeholder="Введіть ваш email"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="phone" className={styles.formLabel}>
              Телефон *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className={styles.formInput}
              placeholder="Введіть ваш телефон"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="message" className={styles.formLabel}>
              Повідомлення
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={4}
              className={styles.formTextarea}
              placeholder="Додаткові побажання (необов'язково)"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={styles.submitButton}
          >
            {isSubmitting ? 'Відправка...' : 'Орендувати'}
          </button>
        </form>

        {showNotification && (
          <div className={styles.notification}>
            <p>✅ Оренду успішно оформлено! Ми зв&apos;яжемося з вами найближчим часом.</p>
          </div>
        )}
      </div>
    </div>
  );
}

