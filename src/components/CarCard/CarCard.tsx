'use client';

import { useCarsStore } from '@/store/carsStore';
import Link from 'next/link';
import Image from 'next/image';
import { Car } from '@/types';
import { formatMileage } from '@/services/api';
import { HeartIcon } from '@/components/Icons/Icons';
import styles from './CarCard.module.css';

interface CarCardProps {
  car: Car;
}

export default function CarCard({ car }: CarCardProps) {
  const { favorites, addToFavorites, removeFromFavorites } = useCarsStore();
  const isFavorite = favorites.includes(car.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isFavorite) {
      removeFromFavorites(car.id);
    } else {
      addToFavorites(car.id);
    }
  };

  return (
    <article className={styles.carCard}>
      <div className={styles.imageContainer}>
        <Image
          src={car.img || '/placeholder-car.jpg'}
          alt={`${car.make} ${car.model}`}
          fill
          className={styles.carImage}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <button
          onClick={handleFavoriteClick}
          className={`${styles.favoriteButton} ${isFavorite ? styles.favoriteActive : ''}`}
          aria-label={isFavorite ? 'Видалити з обраних' : 'Додати до обраних'}
        >
          <HeartIcon filled={isFavorite} />
        </button>
      </div>
      
      <div className={styles.carInfo}>
        <div className={styles.carHeader}>
          <h3 className={styles.carTitle}>
            {car.make} {car.model}, {car.year}
          </h3>
          <p className={styles.carPrice}>{car.rentalPrice}</p>
        </div>
        
        <div className={styles.carDetails}>
          <span className={styles.carDetail}>
            {car.address.split(',')[1]?.trim() || car.address.split(',')[0]?.trim()}
          </span>
          <span className={styles.separator}>|</span>
          <span className={styles.carDetail}>
            {car.address.split(',')[2]?.trim() || 'Ukraine'}
          </span>
          <span className={styles.separator}>|</span>
          <span className={styles.carDetail}>
            {car.rentalCompany}
          </span>
          <span className={styles.separator}>|</span>
          <span className={styles.carDetail}>
            {car.type}
          </span>
          <span className={styles.separator}>|</span>
          <span className={styles.carDetail}>
            {formatMileage(car.mileage)} km
          </span>
        </div>
      </div>
      
      <Link href={`/catalog/${car.id}`} className={styles.readMoreButton}>
        Read more
      </Link>
    </article>
  );
}

