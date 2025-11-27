import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header/Header';
import ToasterComponent from '@/components/Toaster/Toaster';

export const metadata: Metadata = {
  title: 'RentalCar - Car Rental Service',
  description: 'Rent a car with RentalCar - the best car rental service',
  keywords: 'car rental, rent a car, vehicle rental',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <Header />
        {children}
        <ToasterComponent />
      </body>
    </html>
  );
}

