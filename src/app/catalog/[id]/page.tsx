'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useCarsStore } from '@/store/carsStore';
import CarDetails from '@/components/CarDetails/CarDetails';
import styles from './page.module.css';

export default function CarDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const { getCarById } = useCarsStore();
  const [car, setCar] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCar = async () => {
      setIsLoading(true);
      const carData = await getCarById(id);
      setCar(carData);
      setIsLoading(false);
    };

    if (id) {
      loadCar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (isLoading) {
    return (
      <main className={styles.carDetailsPage}>
        <div className="container">
          <div className="loader" />
        </div>
      </main>
    );
  }

  if (!car) {
    return (
      <main className={styles.carDetailsPage}>
        <div className="container">
          <div className={styles.notFound}>
            <h2>Автомобіль не знайдено</h2>
            <p>Спробуйте вибрати інший автомобіль з каталогу.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.carDetailsPage}>
      <div className="container">
        <h1 className={styles.pageTitle}>Details</h1>
        <CarDetails car={car} />
      </div>
    </main>
  );
}

