'use client';

import Link from 'next/link';
import styles from './page.module.css';

export default function HomePage() {
  return (
    <main className={styles.homePage}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Find your perfect rental car
          </h1>
          <p className={styles.heroSubtitle}>
            Reliable and budget-friendly rentals for any journey
          </p>
          <Link href="/catalog" className={styles.ctaButton}>
            View Catalog
          </Link>
        </div>
      </section>
    </main>
  );
}

