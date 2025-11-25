'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Header.module.css';

export default function Header() {
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.headerContent}>
          <Link href="/" className={styles.logo}>
            RentalCar
          </Link>
          <nav className={styles.nav}>
            <Link
              href="/"
              className={`${styles.navLink} ${pathname === '/' ? styles.active : ''}`}
            >
              Home
            </Link>
            <Link
              href="/catalog"
              className={`${styles.navLink} ${pathname === '/catalog' ? styles.active : ''}`}
            >
              Catalog
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

