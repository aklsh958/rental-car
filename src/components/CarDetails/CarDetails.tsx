'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { useCarsStore } from '@/store/carsStore';
import { Car } from '@/types';
import { formatMileage, submitRental } from '@/services/api';
import { HeartIcon, LocationPinIcon, CheckIcon, CalendarIcon, CarIcon, FuelIcon, GearIcon } from '@/components/Icons/Icons';
import styles from './CarDetails.module.css';

interface CarDetailsProps {
  car: Car;
}

type BookingFormValues = {
  name: string;
  email: string;
  bookingDate: string;
  comment: string;
};

const DEFAULT_FORM_VALUES: BookingFormValues = {
  name: '',
  email: '',
  bookingDate: '',
  comment: '',
};

const bookingSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Enter at least 2 characters')
    .max(60, 'Too long')
    .required('Name is required'),
  email: Yup.string()
    .email('Enter a valid email')
    .required('Email is required'),
  bookingDate: Yup.string().required('Choose a booking date'),
  comment: Yup.string().max(500, 'Maximum 500 characters'),
});

export default function CarDetails({ car }: CarDetailsProps) {
  const { favorites, addToFavorites, removeFromFavorites } = useCarsStore();
  const isFavorite = favorites.includes(car.id);
  const [initialValues, setInitialValues] = useState<BookingFormValues>(DEFAULT_FORM_VALUES);
  const [isReady, setIsReady] = useState(false);

  const storageKey = `booking-form-${car.id}`;

  // Load form data from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const saved = window.localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as BookingFormValues;
        setInitialValues({
          ...DEFAULT_FORM_VALUES,
          ...parsed,
        });
      } catch (err) {
        console.warn('Failed to parse saved booking form', err);
      }
    }

    setIsReady(true);
  }, [storageKey]);

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

  const handleSubmit = useCallback(
    async (
      values: BookingFormValues,
      helpers: FormikHelpers<BookingFormValues>
    ) => {
      try {
        await submitRental({
          carId: car.id,
          name: values.name,
          email: values.email,
          phone: '', // Not in form but required by API
          message: values.comment,
        });

        helpers.resetForm({ values: DEFAULT_FORM_VALUES });
        helpers.setSubmitting(false);

        if (typeof window !== 'undefined') {
          window.localStorage.removeItem(storageKey);
        }

        toast.success('Your booking has been successfully submitted! We will contact you soon.');
      } catch (error) {
        console.error('Error submitting rental:', error);
        toast.error('Error submitting form. Please try again.');
      }
    },
    [car.id, storageKey]
  );

  // Extract city and country from address
  const addressParts = car.address.split(',');
  const city = addressParts[1]?.trim() || addressParts[0]?.trim() || '';
  const country = addressParts[2]?.trim() || 'Ukraine';

  // Extract ID from car (might be in different format)
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
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <HeartIcon filled={isFavorite} />
          </button>
        </div>

        <div className={styles.rentalFormSection}>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>Book your car now</h2>
            <p className={styles.formSubtitle}>
              Stay connected! We are always ready to help you.
            </p>
          </div>

          <Formik
            initialValues={initialValues}
            enableReinitialize
            validationSchema={bookingSchema}
            onSubmit={handleSubmit}
            validateOnBlur
            validateOnChange
          >
            {({ values, errors, touched, isSubmitting, isValid, dirty }) => {
              // Save form data to localStorage
              useEffect(() => {
                if (typeof window === 'undefined') return;
                window.localStorage.setItem(storageKey, JSON.stringify(values));
              }, [storageKey, values]);

              return (
                <Form className={styles.rentalForm}>
                  <div className={styles.formGroup}>
                    <Field
                      type="text"
                      name="name"
                      placeholder="Name*"
                      className={`${styles.formInput} ${
                        errors.name && touched.name ? styles.inputError : ''
                      }`}
                      disabled={isSubmitting}
                    />
                    <ErrorMessage component="span" name="name" className={styles.errorText} />
                  </div>

                  <div className={styles.formGroup}>
                    <Field
                      type="email"
                      name="email"
                      placeholder="Email*"
                      className={`${styles.formInput} ${
                        errors.email && touched.email ? styles.inputError : ''
                      }`}
                      disabled={isSubmitting}
                    />
                    <ErrorMessage component="span" name="email" className={styles.errorText} />
                  </div>

                  <div className={styles.formGroup}>
                    <div className={styles.dateInputWrapper}>
                      <CalendarIcon className={styles.dateIcon} />
                      <Field
                        type="date"
                        name="bookingDate"
                        className={`${styles.formInput} ${
                          errors.bookingDate && touched.bookingDate ? styles.inputError : ''
                        }`}
                        disabled={isSubmitting}
                      />
                    </div>
                    <ErrorMessage
                      component="span"
                      name="bookingDate"
                      className={styles.errorText}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <Field
                      as="textarea"
                      name="comment"
                      placeholder="Comment"
                      rows={4}
                      className={`${styles.formInput} ${styles.textarea} ${
                        errors.comment && touched.comment ? styles.inputError : ''
                      }`}
                      disabled={isSubmitting}
                    />
                    <ErrorMessage component="span" name="comment" className={styles.errorText} />
                  </div>

                  <div className={styles.btnWrapper}>
                    <button
                      type="submit"
                      className={styles.submitButton}
                      disabled={isSubmitting || !isValid || !dirty}
                    >
                      {isSubmitting ? 'Sending…' : 'Send'}
                    </button>
                  </div>
                </Form>
              );
            }}
          </Formik>
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
