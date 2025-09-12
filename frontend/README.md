# Clinic Frontend

A React TypeScript frontend application for a clinic management system, showcasing modern web development practices and integration with a Spring Boot backend.

## Features

- **Authentication**: User login and registration
- **Role-based Access**: Different dashboards for Admin, Employee, and Patient roles
- **Appointment Management**: Book appointments with available doctors
- **Responsive Design**: Tailwind CSS for modern, mobile-friendly UI
- **Type Safety**: Full TypeScript implementation

## Tech Stack

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API communication
- **Context API** for state management

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Backend server running on `http://localhost:3000`

### Installation

```bash
# Install dependencies
npm install

# Start development server (will likely run on port 3001 due to backend on 3000)
npm start
```

### Backend Integration

This frontend is designed to work with the clinic backend API. Ensure your backend is running with the following endpoints:

- `POST /auth/login` - User authentication
- `POST /auth/register` - User registration
- `GET /api/calendar/available-slots` - Get available appointment slots
- `POST /appointments/schedule` - Schedule appointments

## Project Structure

```
src/
├── components/          # React components
│   ├── Login.tsx       # Login form
│   ├── Register.tsx    # Registration form
│   ├── Dashboard.tsx   # Role-based dashboards
│   ├── Layout.tsx      # Navigation and layout
│   └── AppointmentBooking.tsx # Appointment booking
├── context/            # React Context providers
├── services/           # API service functions
├── types/             # TypeScript type definitions
└── App.tsx            # Main application component
```

## User Roles

- **Admin**: View system statistics and manage operations
- **Employee**: View schedule and appointments
- **Patient**: Book appointments and view medical history

## Key Features Demonstrated

1. **Modern React Patterns**: Functional components, hooks, context API
2. **TypeScript Integration**: Type-safe development with interfaces
3. **Authentication Flow**: JWT token-based authentication
4. **Responsive Design**: Mobile-first approach with Tailwind CSS
5. **API Integration**: Axios interceptors and error handling
6. **Protected Routes**: Role-based access control

## Available Scripts

### `npm start`
Runs the app in development mode. Open [http://localhost:3001](http://localhost:3001) to view it.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run build`
Builds the app for production to the `build` folder.
