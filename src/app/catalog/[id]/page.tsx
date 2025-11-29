'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useCarsStore } from '@/store/carsStore';
import CarDetails from '@/components/CarDetails/CarDetails';
import carDetailsStyles from '@/components/CarDetails/CarDetails.module.css';

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
  }, [id]);

  if (isLoading) {
    return (
      <section className={carDetailsStyles.carDetails}>
        <div className="container">
          <div className={carDetailsStyles.loaderContainer}>
            <div className="loader" />
          </div>
        </div>
      </section>
    );
  }

  if (!car) {
    return (
      <section className={carDetailsStyles.carDetails}>
        <div className="container">
          <div className={carDetailsStyles.errorContainer}>
            <p>Failed to load car details. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return <CarDetails car={car} />;
}

