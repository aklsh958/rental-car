import styles from './Header.module.css';
import Link from 'next/link';
import NavLink from '../NavLink/NavLink';
import Image from 'next/image';

const Header = () => {
  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Catalog', href: '/catalog' },
  ];

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <Link href="/" aria-label="Home" className={styles.logoLink}>
          <Image src="/Logo.svg" alt="RentalCar Logo" width={104} height={16} priority />
        </Link>
        <nav aria-label="Main Navigation">
          <ul className={styles.navigation}>
            {navItems.map((item) => (
              <NavLink key={item.name} href={item.href} label={item.name} />
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;

