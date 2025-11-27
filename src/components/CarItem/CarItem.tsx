'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Car } from '@/types';
import { useCarsStore } from '@/store/carsStore';
import { formatMileage } from '@/services/api';
import { HeartIcon } from '@/components/Icons/Icons';
import styles from './CarItem.module.css';

type Props = {
  item: Car;
};

const CarItem = ({ item }: Props) => {
  const { favorites, addToFavorites, removeFromFavorites } = useCarsStore();
  const isFavorite = favorites.includes(item.id);

  const handleFavoriteClick = () => {
    if (isFavorite) {
      removeFromFavorites(item.id);
    } else {
      addToFavorites(item.id);
    }
  };

  const addressParts = item.address?.split(', ') ?? item.address.split(',');
  const country = addressParts[addressParts.length - 1]?.trim() || 'Ukraine';
  const city = addressParts[1]?.trim() || addressParts[0]?.trim() || '';

  return (
    <li className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image
          src={item.img || '/placeholder-car.jpg'}
          alt={`${item.make} ${item.model}`}
          width={274}
          height={268}
          className={styles.carImage}
          style={{ objectFit: 'cover' }}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder-car.jpg';
          }}
        />
        <button
          type="button"
          aria-pressed={isFavorite}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          onClick={handleFavoriteClick}
          className={styles.favoriteButton}
        >
          <HeartIcon filled={isFavorite} />
        </button>
      </div>

      <div>
        <div className={styles.headerRow}>
          <p className={styles.heading}>
            {item.make} <span className={styles.model}>{item.model}</span>,{' '}
            {item.year}
          </p>
          <span className={styles.price}>
            {typeof item.rentalPrice === 'string' && item.rentalPrice.startsWith('$')
              ? item.rentalPrice
              : `$${item.rentalPrice}`}
          </span>
        </div>
        <ul className={styles.description}>
          <li>{city}</li>
          <li>{country}</li>
          <li>{item.rentalCompany}</li>
          <li>{item.type}</li>
          <li>{formatMileage(item.mileage)} km</li>
        </ul>
      </div>

      <Link href={`/catalog/${item.id}`} className={styles.readMore}>
        Read more
      </Link>
    </li>
  );
};

export default CarItem;

