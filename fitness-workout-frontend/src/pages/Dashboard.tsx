
import { useEffect, useState } from 'react';
import { getWorkouts } from '../services/workoutService';
import { getExercises } from '../services/exerciseService';
import type { Workout } from '../types/workout.types';

function Dashboard() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [totalExercises, setTotalExercises] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [workoutData, exerciseData] = await Promise.all([
          getWorkouts(),
          getExercises(),
        ]);

        setWorkouts(workoutData);
        setTotalExercises(exerciseData.length);
      } catch {
        setError('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const totalWorkouts = workouts.length;

  const completedWorkouts = workouts.filter(
    (workout) => workout.status === 'completed'
  ).length;

  const plannedWorkouts = workouts.filter(
    (workout) => workout.status === 'planned'
  ).length;

  return (
    <div className="dashboard">
      <h1>Fitness Dashboard</h1>
      <p>Welcome to your Fitness Logger!</p>

      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Workouts</h3>
          <h2>{totalWorkouts}</h2>
        </div>

        <div className="stat-card">
          <h3>Completed Workouts</h3>
          <h2>{completedWorkouts}</h2>
        </div>

        <div className="stat-card">
          <h3>Planned Workouts</h3>
          <h2>{plannedWorkouts}</h2>
        </div>

        <div className="stat-card">
          <h3>Total Exercises</h3>
          <h2>{totalExercises}</h2>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;