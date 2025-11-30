# RentalCar - Car Rental Service

## Project Description

RentalCar is a car rental web application built with Next.js and TypeScript. The app provides users with a convenient interface for browsing a catalog of cars, filtering by various criteria, adding to favorites, and booking rentals.

## Main Features

- **Home Page** - banner with main call-to-action
- **Car Catalog** - view all available vehicles
- **Filtering** - search for cars by brand, price, and mileage
- **Favorites** - save favorite cars (persisted on page refresh)
- **Detailed Information** - full car description with all specifications
- **Rental Form** - book a car rental
- **Pagination** - load additional cards via "Load More" button

## Technologies

- **Next.js 14** - React framework with App Router
- **TypeScript** - code typing
- **Zustand** - global state management
- **Axios** - HTTP requests to API
- **CSS Modules** - component styling

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Project
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open your browser at [http://localhost:3000](http://localhost:3000)

## Usage

### Home Page
On the main page, click the "View Catalog" button to navigate to the car catalog.

### Catalog
- Use filters to search for cars by brand, price, and mileage
- Click the heart icon to add a car to favorites
- Click "Read more" to view detailed information about the car
- Use the "Load More" button to load additional cars

### Details Page
- View complete information about the car
- Fill out the rental form and submit your request
- A notification will appear after successful submission

## Project Structure

```
Project/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx            # Home page
│   │   ├── catalog/
│   │   │   ├── page.tsx        # Catalog page
│   │   │   └── [id]/
│   │   │       └── page.tsx    # Car details page
│   │   ├── layout.tsx          # Root layout
│   │   └── globals.css         # Global styles
│   ├── components/             # React components
│   │   ├── CarCard/           # Car card
│   │   ├── CarDetails/        # Car detailed information
│   │   └── Filters/           # Filters component
│   ├── store/                  # Zustand store
│   │   └── carsStore.ts        # Global app state
│   ├── services/               # API services
│   │   └── api.ts              # Axios configuration and requests
│   └── types/                  # TypeScript types
│       └── index.ts            # Data types
├── package.json
├── tsconfig.json
└── README.md
```

## API

The app uses a ready-made backend API:
- Base URL: `https://car-rental-api.goit.global`
- Documentation: https://car-rental-api.goit.global/api-docs/

### Main endpoints:
- `GET /api/cars` - get list of cars with filtering and pagination
- `GET /api/cars/:id` - get details of a specific car
- `POST /api/rentals` - submit rental form

## Implementation Features

- **Backend Filtering** - all filters are processed on the server
- **Backend Pagination** - loading additional pages via API
- **Favorites Persistence** - favorites list is saved in localStorage
- **Mileage Formatting** - displayed with spaces (5 000 km instead of 5000 km)
- **Loading Indicator** - loading indicator for asynchronous requests
- **Form Validation** - validation of required fields before submission
