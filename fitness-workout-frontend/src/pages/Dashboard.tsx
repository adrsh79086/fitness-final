import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

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

  // Show the latest 5 workouts first
  const recentWorkouts = [...workouts]
    .sort(
      (a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    .slice(0, 5);

  const formatStatus = (status: Workout['status']) => {
    if (status === 'in-progress') return 'In Progress';
    if (status === 'completed') return 'Completed';
    return 'Planned';
  };

  return (
    <div className="dashboard">
      <h1>Fitness Dashboard</h1>
      <p>Welcome to your Fitness Logger!</p>

      {/* Dashboard Statistics */}
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

      {/* Recent Workout History */}
      <section className="recent-workouts">
        <h2>Recent Workout History</h2>
        <p>Your latest 5 workouts</p>

        {recentWorkouts.length === 0 ? (
          <p>No workouts found. Create your first workout!</p>
        ) : (
          <div className="recent-workout-list">
            {recentWorkouts.map((workout) => (
              <div
                className="recent-workout-card"
                key={workout.workoutId}
              >
                <div>
                  <h3>
                    {workout.notes.trim() || 'Workout Session'}
                  </h3>

                  <p>
                    Date:{' '}
                    {new Date(workout.date).toLocaleDateString()}
                  </p>

                  <p>
                    Status: {formatStatus(workout.status)}
                  </p>
                </div>

                <Link to={`/workouts/${workout.workoutId}`}>
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}

        <Link to="/workouts">View All Workouts</Link>
      </section>
    </div>
  );
}

export default Dashboard;
