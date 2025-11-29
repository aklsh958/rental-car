'use client';

import {
  ErrorMessage,
  Field,
  Form,
  Formik,
  FormikHelpers,
  FormikProps,
  type FieldProps,
} from 'formik';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { submitRental } from '@/services/api';
import { ChevronUpIcon } from '@/components/Icons/Icons';
import styles from './RentalForm.module.css';

interface FormData {
  name: string;
  email: string;
  startDate: string;
  endDate: string;
  comment: string;
}

const emptyFormData: FormData = {
  name: '',
  email: '',
  startDate: '',
  endDate: '',
  comment: '',
};

const validationRules = Yup.object({
  name: Yup.string()
    .min(2, 'Enter at least 2 characters')
    .max(60, 'Too long')
    .required('Name is required'),
  email: Yup.string()
    .email('Enter a valid email')
    .required('Email is required'),
  startDate: Yup.string(),
  endDate: Yup.string(),
  comment: Yup.string().max(500, 'Maximum 500 characters'),
});

const weekDayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function createDateWithMonthOffset(baseDate: Date, monthsToAdd: number): Date {
  const result = new Date(baseDate);
  result.setMonth(result.getMonth() + monthsToAdd);
  return result;
}

function generateCalendarDays(monthDate: Date): Date[] {
  const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const firstDayOfWeek = (monthStart.getDay() + 6) % 7;
  const calendarStart = new Date(monthStart);
  calendarStart.setDate(calendarStart.getDate() - firstDayOfWeek);

  const days: Date[] = [];
  for (let i = 0; i < 35; i++) {
    const day = new Date(calendarStart);
    day.setDate(calendarStart.getDate() + i);
    days.push(day);
  }
  return days;
}

function datesAreEqual(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

interface Props {
  carId: string;
  storageKey: string;
}

const RentalForm = ({ carId, storageKey }: Props) => {
  const [formData, setFormData] = useState<FormData>(emptyFormData);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let isMounted = true;
    const pendingTimers: ReturnType<typeof setTimeout>[] = [];

    const queueUpdate = (updateFn: () => void) => {
      const timerId = setTimeout(() => {
        if (isMounted) {
          updateFn();
        }
      }, 0);
      pendingTimers.push(timerId);
    };

    const storedData = window.localStorage.getItem(storageKey);
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData) as FormData;
        queueUpdate(() => {
          setFormData({ ...emptyFormData, ...parsed });
        });
      } catch (err) {
        console.warn('Failed to load saved form data', err);
      }
    }

    queueUpdate(() => setIsInitialized(true));

    return () => {
      isMounted = false;
      pendingTimers.forEach(clearTimeout);
    };
  }, [storageKey]);

  const onSubmit = useCallback(
    async (data: FormData, formHelpers: FormikHelpers<FormData>) => {
      try {
        await submitRental({
          carId,
          name: data.name,
          email: data.email,
          phone: '',
          message: data.comment,
        });

        await new Promise((resolve) => setTimeout(resolve, 800));

        formHelpers.resetForm({ values: emptyFormData });
        formHelpers.setSubmitting(false);

        if (typeof window !== 'undefined') {
          window.localStorage.removeItem(storageKey);
        }

        toast.success(
          'Your booking has been successfully submitted! We will contact you soon.'
        );
      } catch (err) {
        console.error('Failed to submit rental request:', err);
        toast.error('Error submitting form. Please try again.');
      }
    },
    [carId, storageKey]
  );

  if (!isInitialized) {
    return <div className={styles.formSkeleton} aria-hidden="true" />;
  }

  return (
    <div className={styles.formCard}>
      <div className={styles.formHeader}>
        <h2 className={styles.formTitle}>Book your car now</h2>
        <p className={styles.formSubtitle}>
          Stay connected! We are always ready to help you.
        </p>
      </div>
      <Formik
        initialValues={formData}
        enableReinitialize
        validationSchema={validationRules}
        onSubmit={onSubmit}
        validateOnBlur
        validateOnChange
      >
        {(formikProps) => (
          <FormFields storageKey={storageKey} {...formikProps} />
        )}
      </Formik>
    </div>
  );
};

interface FormFieldsProps extends FormikProps<FormData> {
  storageKey: string;
}

const FormFields = ({
  storageKey,
  values,
  errors,
  touched,
  isSubmitting,
  isValid,
  dirty,
  setFieldValue,
}: FormFieldsProps) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarContainerRef = useRef<HTMLDivElement | null>(null);
  const dateInputRef = useRef<HTMLInputElement | null>(null);
  const [currentYear, setCurrentYear] = useState(() => new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(() => new Date().getMonth());
  const [selectionMode, setSelectionMode] = useState<'start' | 'end'>('start');

  const displayedMonth = useMemo(
    () => new Date(currentYear, currentMonth, 1),
    [currentYear, currentMonth]
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(storageKey, JSON.stringify(values));
  }, [storageKey, values]);

  useEffect(() => {
    const selectedDate = values.startDate || values.endDate;
    if (!selectedDate) return;
    const dateObj = new Date(selectedDate);
    const timeoutId = setTimeout(() => {
      setCurrentYear(dateObj.getFullYear());
      setCurrentMonth(dateObj.getMonth());
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [values.startDate, values.endDate]);

  useEffect(() => {
    if (!showCalendar) return;

    const handleOutsideClick = (event: MouseEvent) => {
      const clickedElement = event.target as Node;
      const isOutsideCalendar = calendarContainerRef.current &&
        !calendarContainerRef.current.contains(clickedElement);
      const isOutsideInput = dateInputRef.current &&
        !dateInputRef.current.contains(clickedElement);

      if (isOutsideCalendar && isOutsideInput) {
        setShowCalendar(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [showCalendar]);

  const daysInCalendar = useMemo(
    () => generateCalendarDays(displayedMonth),
    [displayedMonth]
  );

  const getDisplayedDateRange = (): string => {
    if (values.startDate && values.endDate) {
      const start = new Date(values.startDate);
      const end = new Date(values.endDate);
      return `${start.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })} - ${end.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })}`;
    }
    if (values.startDate) {
      const start = new Date(values.startDate);
      return `From ${start.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })}`;
    }
    return '';
  };

  const checkIfDateIsPast = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate < today;
  };

  const checkIfDateInRange = (date: Date): boolean => {
    if (!values.startDate || !values.endDate) return false;
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    const start = new Date(values.startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(values.endDate);
    end.setHours(0, 0, 0, 0);
    return checkDate >= start && checkDate <= end;
  };

  const onDateClick = (clickedDate: Date) => {
    if (checkIfDateIsPast(clickedDate)) {
      return;
    }

    const dateString = clickedDate.toISOString();
    const clickedStart = values.startDate && datesAreEqual(new Date(values.startDate), clickedDate);
    const clickedEnd = values.endDate && datesAreEqual(new Date(values.endDate), clickedDate);

    if (clickedStart) {
      setFieldValue('startDate', '');
      setFieldValue('endDate', '');
      setSelectionMode('start');
      return;
    }

    if (clickedEnd) {
      setFieldValue('endDate', '');
      setSelectionMode('end');
      return;
    }

    if (selectionMode === 'start' || !values.startDate) {
      if (values.endDate && clickedDate > new Date(values.endDate)) {
        setFieldValue('endDate', '');
      }
      setFieldValue('startDate', dateString);
      setSelectionMode('end');
    } else {
      if (values.startDate && clickedDate < new Date(values.startDate)) {
        setFieldValue('startDate', dateString);
        setFieldValue('endDate', '');
        setSelectionMode('end');
      } else if (dateString === values.startDate) {
        setFieldValue('startDate', '');
        setFieldValue('endDate', '');
        setSelectionMode('start');
      } else {
        setFieldValue('endDate', dateString);
        if (values.startDate) {
          setShowCalendar(false);
        }
      }
    }
  };

  const adjustYear = (newYear: number) => {
    const now = new Date();
    const minYear = now.getFullYear();
    const maxYear = minYear + 9;
    const clamped = Math.max(minYear, Math.min(maxYear, newYear));
    setCurrentYear(clamped);
  };

  const adjustMonth = (newMonth: number) => {
    const clamped = Math.max(0, Math.min(11, newMonth));
    setCurrentMonth(clamped);
  };

  const now = new Date();
  const yearOptions = Array.from({ length: 10 }, (_, i) => now.getFullYear() + i);

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      const prevYear = currentYear - 1;
      if (prevYear >= now.getFullYear()) {
        setCurrentYear(prevYear);
        setCurrentMonth(11);
      }
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      const nextYear = currentYear + 1;
      if (nextYear <= now.getFullYear() + 9) {
        setCurrentYear(nextYear);
        setCurrentMonth(0);
      }
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const openCalendar = () => {
    setShowCalendar((prev) => !prev);
    if (!values.startDate) {
      setSelectionMode('start');
    } else if (!values.endDate) {
      setSelectionMode('end');
    }
  };

  return (
    <Form className={styles.form}>
      <FormInput
        name="name"
        placeholder="Name*"
        type="text"
        disabled={isSubmitting}
        hasError={Boolean(errors.name && touched.name)}
      />
      <ErrorMessage component="span" name="name" className={styles.errorText} />

      <FormInput
        name="email"
        placeholder="Email*"
        type="email"
        disabled={isSubmitting}
        hasError={Boolean(errors.email && touched.email)}
      />
      <ErrorMessage
        component="span"
        name="email"
        className={styles.errorText}
      />

      <div className={styles.fieldWrapper}>
        <Field name="startDate">
          {({ field }: FieldProps) => (
            <input
              {...field}
              ref={dateInputRef}
              readOnly
              value={getDisplayedDateRange()}
              onClick={openCalendar}
              onFocus={() => {
                setShowCalendar(true);
                if (!values.startDate) {
                  setSelectionMode('start');
                } else if (!values.endDate) {
                  setSelectionMode('end');
                }
              }}
              className={`${styles.inputBase} ${
                (errors.startDate && touched.startDate) ||
                (errors.endDate && touched.endDate)
                  ? styles.inputError
                  : ''
              }`}
              placeholder="Booking date range"
            />
          )}
        </Field>
        {showCalendar && (
          <div className={styles.calendarPopover} ref={calendarContainerRef}>
            <div className={styles.calendarHeader}>
              <div className={styles.calendarDateSelectors}>
                <button
                  type="button"
                  onClick={goToPreviousMonth}
                  disabled={currentYear === now.getFullYear() && currentMonth === 0}
                  className={styles.navButton}
                  aria-label="Previous month"
                >
                  <ChevronUpIcon className={`${styles.navIcon} ${styles.navIconLeft}`} />
                </button>
                <select
                  value={currentMonth}
                  onChange={(e) => adjustMonth(Number(e.target.value))}
                  className={styles.monthSelector}
                  aria-label="Select month"
                >
                  {monthNames.map((month, index) => (
                    <option key={month} value={index}>
                      {month}
                    </option>
                  ))}
                </select>
                <div className={styles.yearSelector}>
                  <input
                    type="text"
                    value={currentYear}
                    readOnly
                    className={styles.yearInput}
                    aria-label="Selected year"
                  />
                  <div className={styles.yearButtons}>
                    <button
                      type="button"
                      onClick={() => {
                        const nextYear = currentYear + 1;
                        if (nextYear <= now.getFullYear() + 9) {
                          adjustYear(nextYear);
                        }
                      }}
                      disabled={currentYear >= now.getFullYear() + 9}
                      className={styles.yearButton}
                      aria-label="Increase year"
                    >
                      <ChevronUpIcon className={styles.yearButtonIcon} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const prevYear = currentYear - 1;
                        if (prevYear >= now.getFullYear()) {
                          adjustYear(prevYear);
                        }
                      }}
                      disabled={currentYear <= now.getFullYear()}
                      className={styles.yearButton}
                      aria-label="Decrease year"
                    >
                      <ChevronUpIcon className={`${styles.yearButtonIcon} ${styles.yearButtonIconDown}`} />
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={goToNextMonth}
                  disabled={currentYear === now.getFullYear() + 9 && currentMonth === 11}
                  className={styles.navButton}
                  aria-label="Next month"
                >
                  <ChevronUpIcon className={`${styles.navIcon} ${styles.navIconRight}`} />
                </button>
              </div>
            </div>
            <div className={styles.weekdays}>
              {weekDayNames.map((day) => (
                <span key={day}>{day.toUpperCase()}</span>
              ))}
            </div>
            <div className={styles.calendarGrid}>
              {daysInCalendar.map((day) => {
                const isOtherMonth = day.getMonth() !== displayedMonth.getMonth();
                const isStart = values.startDate && datesAreEqual(new Date(values.startDate), day);
                const isEnd = values.endDate && datesAreEqual(new Date(values.endDate), day);
                const isBetween = checkIfDateInRange(day) && !isStart && !isEnd;
                const isCurrentDay = datesAreEqual(new Date(), day);
                const isDisabled = checkIfDateIsPast(day);

                return (
                  <button
                    key={day.toISOString()}
                    type="button"
                    disabled={isDisabled}
                    className={`${styles.calendarDay} ${isOtherMonth ? styles.dayMuted : ''} ${
                      isStart ? styles.dayStart : ''
                    } ${isEnd ? styles.dayEnd : ''} ${
                      isBetween ? styles.dayInRange : ''
                    } ${isCurrentDay ? styles.dayToday : ''} ${isDisabled ? styles.dayDisabled : ''}`}
                    onClick={() => onDateClick(day)}
                  >
                    {day.getDate()}
                  </button>
                );
              })}
            </div>
            <div className={styles.calendarHint}>
              {!values.startDate
                ? 'Select start date'
                : !values.endDate
                ? 'Select end date'
                : 'Click dates to change selection'}
            </div>
          </div>
        )}
      </div>
      {(errors.startDate && touched.startDate) ||
      (errors.endDate && touched.endDate) ? (
        <span className={styles.errorText}>
          {errors.startDate || errors.endDate}
        </span>
      ) : null}

      <FormInput
        name="comment"
        placeholder="Comment"
        as="textarea"
        rows={4}
        disabled={isSubmitting}
        hasError={Boolean(errors.comment && touched.comment)}
      />
      <ErrorMessage
        component="span"
        name="comment"
        className={styles.errorText}
      />
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
};

interface FormInputProps {
  name: keyof FormData;
  placeholder: string;
  type?: string;
  as?: 'input' | 'textarea';
  rows?: number;
  disabled?: boolean;
  hasError?: boolean;
}

const FormInput = ({
  name,
  placeholder,
  type = 'text',
  as = 'input',
  rows,
  disabled,
  hasError,
}: FormInputProps) => (
  <div className={styles.fieldWrapper}>
    <Field
      as={as}
      type={type}
      name={name}
      rows={rows}
      disabled={disabled}
      placeholder={placeholder}
      className={`${styles.inputBase} ${hasError ? styles.inputError : ''} ${
        as === 'textarea' ? styles.textarea : ''
      }`}
    />
  </div>
);

export default RentalForm;
