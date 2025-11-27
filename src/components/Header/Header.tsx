'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styles from './Header.module.css';

export default function Header() {
  const pathname = usePathname();
  const isHomeActive = pathname === '/';
  const isCatalogActive = pathname === '/catalog';

  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.headerContent}>
          <Link href="/" aria-label="Home" className={styles.logo}>
            <Image
              src="/Logo.svg"
              alt="Logo"
              width={104}
              height={16}
              loading="lazy"
            />
          </Link>
          <nav aria-label="Main Navigation" className={styles.nav}>
            <ul className={styles.navigation}>
              <li>
                <Link
                  href="/"
                  className={`${styles.navLink} ${isHomeActive ? styles.active : ''}`}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/catalog"
                  className={`${styles.navLink} ${isCatalogActive ? styles.active : ''}`}
                >
                  Catalog
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

