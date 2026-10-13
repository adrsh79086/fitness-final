# Fitness Workout Logger 💪

A full-stack fitness application to manage exercises, create workout plans, track workout sets, and monitor workout progress through a dashboard.

## Features

- **Authentication:** User registration and login using JWT.
- **Role-Based Access:** Admin and user roles.
- **Exercise Management:** Create, view, update, and deactivate exercises.
- **Workout Management:** Create, view, update, and delete workouts.
- **Workout Tracking:** Track exercises, sets, reps, weight, and completion status.
- **Workout History:** View recent workouts and their status.
- **Dashboard:** View total workouts, completed workouts, planned workouts, and total exercises.
- **API Integration:** Connect the React frontend with the NestJS backend.

## Tech Stack

**Frontend**
- React
- TypeScript
- Vite
- React Router
- Axios
- CSS

**Backend**
- NestJS
- TypeScript
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt
- class-validator

## Project Structure

```text
fitness-workout-logger/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── types/
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── exercises/
│   │   ├── workouts/
│   │   ├── workout-sets/
│   │   ├── app.module.ts
│   │   └── main.ts
│   └── package.json
│
└── README.md
```

## Prerequisites

Make sure you have installed:

- Node.js and npm
- MongoDB or a MongoDB Atlas account
- Git

## Installation

### 1. Clone the repository

```bash
git clone YOUR_REPOSITORY_URL
cd fitness-workout-logger
```

### 2. Setup the Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Start the backend:

```bash
npm run start:dev
```

Backend runs at:

`http://localhost:3000`

### 3. Setup the Frontend

Open another terminal:

```bash
cd frontend
npm install
```

Create a `.env` file inside the frontend folder:

```env
VITE_API_URL=http://localhost:3000
```

Start the frontend:

```bash
npm run dev
```

Open the local URL shown in the terminal, usually:

`http://localhost:5173`

## Main API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a user |
| POST | `/auth/login` | Login |
| GET | `/exercises` | Get active exercises |
| POST | `/exercises` | Create an exercise |
| PATCH | `/exercises/:exerciseId` | Update an exercise |
| DELETE | `/exercises/:exerciseId` | Deactivate an exercise |
| GET | `/workouts` | Get workouts |
| POST | `/workouts` | Create a workout |
| GET | `/workouts/:workoutId` | Get workout details |
| PATCH | `/workouts/:workoutId` | Update a workout |
| DELETE | `/workouts/:workoutId` | Delete a workout |
| POST | `/workout-sets` | Save a workout set |
| GET | `/workout-sets/:workoutId` | Get workout sets |
| PATCH | `/workout-sets/:workoutSetId` | Update a workout set |
| DELETE | `/workout-sets/:workoutSetId` | Delete a workout set |

Protected endpoints require a valid JWT access token in the `Authorization` header:

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

## Environment Variables

| Variable | Purpose |
|---|---|
| `PORT` | Backend server port |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used for JWT signing |
| `VITE_API_URL` | Backend API URL used by frontend |

Never commit your `.env` files or real credentials to GitHub.

## Future Improvements

- Workout analytics and progress charts
- Personal records and fitness goals
- Improved automated testing
- Deployment with a production database

## Author

**Adarsh Kumar**


