'use client';

import Link from 'next/link';
import styles from './page.module.css';

export default function HomePage() {
  return (
    <main className={styles.homePage}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>RentalCar</h1>
          <p className={styles.heroSubtitle}>
            Знайдіть ідеальний автомобіль для вашої подорожі
          </p>
          <p className={styles.heroDescription}>
            Широкий вибір автомобілів для оренди на будь-який смак та бюджет
          </p>
          <Link href="/catalog" className={styles.ctaButton}>
            View Catalog
          </Link>
        </div>
      </section>
    </main>
  );
}

