'use client';

import Link from 'next/link';
import styles from './page.module.css';

export default function HomePage() {
  return (
    <main className={styles.homePage}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Знайдіть ідеальний автомобіль для оренди
          </h1>
          <p className={styles.heroSubtitle}>
            Надійні та доступні автомобілі для будь-якої подорожі
          </p>
          <Link href="/catalog" className={styles.ctaButton}>
            Переглянути каталог
          </Link>
        </div>
      </section>
    </main>
  );
}

