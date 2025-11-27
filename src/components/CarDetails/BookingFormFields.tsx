'use client';

import { useEffect } from 'react';
import { Form, Field, ErrorMessage, FormikProps } from 'formik';
import { CalendarIcon } from '@/components/Icons/Icons';
import styles from './CarDetails.module.css';

type BookingFormValues = {
  name: string;
  email: string;
  bookingDate: string;
  comment: string;
};

interface BookingFormFieldsProps extends FormikProps<BookingFormValues> {
  storageKey: string;
}

export default function BookingFormFields({
  values,
  errors,
  touched,
  isSubmitting,
  isValid,
  dirty,
  storageKey,
}: BookingFormFieldsProps) {
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
}

