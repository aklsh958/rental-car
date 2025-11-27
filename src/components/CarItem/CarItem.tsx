'use client';

import { useCarsStore } from '@/store/carsStore';
import Link from 'next/link';
import Image from 'next/image';
import { Car } from '@/types';
import { formatMileage } from '@/services/api';
import { HeartIcon } from '@/components/Icons/Icons';
import styles from './CarItem.module.css';

interface CarItemProps {
  item: Car;
}

export default function CarItem({ item }: CarItemProps) {
  const { favorites, addToFavorites, removeFromFavorites } = useCarsStore();
  const isFavorite = favorites.includes(item.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isFavorite) {
      removeFromFavorites(item.id);
    } else {
      addToFavorites(item.id);
    }
  };

  const addressParts = item.address.split(',');
  const city = addressParts[1]?.trim() || addressParts[0]?.trim();
  const country = addressParts[2]?.trim() || 'Ukraine';

  return (
    <li className={styles.carItem}>
      <div className={styles.imageWrapper}>
        <Image
          src={item.img || '/placeholder-car.jpg'}
          alt={`${item.make} ${item.model}`}
          fill
          className={styles.carImage}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        <button
          onClick={handleFavoriteClick}
          className={`${styles.favoriteBtn} ${isFavorite ? styles.favoriteBtnActive : ''}`}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <HeartIcon filled={isFavorite} />
        </button>
      </div>
      
      <div className={styles.content}>
        <div className={styles.titleRow}>
          <h3 className={styles.title}>
            {item.make} {item.model}, {item.year}
          </h3>
          <p className={styles.price}>{item.rentalPrice}</p>
        </div>
        
        <div className={styles.details}>
          <span className={styles.detail}>{city}</span>
          <span className={styles.separator}>|</span>
          <span className={styles.detail}>{country}</span>
          <span className={styles.separator}>|</span>
          <span className={styles.detail}>{item.rentalCompany}</span>
          <span className={styles.separator}>|</span>
          <span className={styles.detail}>{item.type}</span>
          <span className={styles.separator}>|</span>
          <span className={styles.detail}>{formatMileage(item.mileage)} km</span>
        </div>
      </div>
      
      <Link href={`/catalog/${item.id}`} className={styles.link}>
        Read more
      </Link>
    </li>
  );
}

