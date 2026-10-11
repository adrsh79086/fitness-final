import { useEffect, useState } from 'react';
import WorkoutForm from '../components/workouts/WorkoutForm';
import { createWorkout, getWorkouts } from '../services/workoutService';
import type { Workout, CreateWorkoutInput } from '../types/workout.types';

function Workouts() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchWorkouts = async () => {
    try {
      setError('');
      const data = await getWorkouts();
      setWorkouts(data);
    } catch {
      setError('Failed to load workouts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const handleCreateWorkout = async (data: CreateWorkoutInput) => {
    await createWorkout(data);
    setMessage('Workout created successfully!');
    setShowForm(false);
    await fetchWorkouts();
  };

  return (
    <div className="exercises-page">
      <div className="exercises-header">
        <div>
          <h1>My Workouts</h1>
          <p>Create and manage your workouts.</p>
        </div>

        <button
          className="primary-button"
          onClick={() => {
            setShowForm(!showForm);
            setMessage('');
          }}
        >
          {showForm ? 'Cancel' : '+ Create Workout'}
        </button>
      </div>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      {showForm && (
        <WorkoutForm onSubmit={handleCreateWorkout} />
      )}

      {loading ? (
        <p className="page-message">Loading workouts...</p>
      ) : workouts.length === 0 ? (
        <p className="page-message">No workouts yet. Create your first workout!</p>
      ) : (
        <div className="exercise-grid">
          {workouts.map((workout) => (
            <div className="exercise-card" key={workout.workoutId}>
              <h3>Workout</h3>
              <p>
                <strong>Date:</strong>{' '}
                {new Date(workout.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Notes:</strong> {workout.notes || 'No notes'}
              </p>
              <p>
                <strong>Status:</strong> {workout.status}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Workouts;
