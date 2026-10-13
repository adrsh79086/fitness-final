
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import WorkoutForm from '../components/workouts/WorkoutForm';
import WorkoutCard from '../components/workouts/WorkoutCard';

import {
  createWorkout,
  getWorkouts,
  getWorkoutExercises,
  addExerciseToWorkout,
  deleteWorkout,
} from '../services/workoutService';

import type {
  Workout,
  CreateWorkoutInput,
} from '../types/workout.types';

import type { WorkoutExercise } from '../types/workoutExercise.types';

function Workouts() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  const [workoutExercises, setWorkoutExercises] =
    useState<Record<string, WorkoutExercise[]>>({});

  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  const fetchWorkouts = async () => {
    try {
      setError('');

      const data = await getWorkouts();
      setWorkouts(data);

      const exerciseResults = await Promise.all(
        data.map(async (workout) => {
          const exercises = await getWorkoutExercises(
            workout.workoutId,
          );

          return [workout.workoutId, exercises] as const;
        }),
      );

      setWorkoutExercises(
        Object.fromEntries(exerciseResults),
      );
    } catch {
      setError('Failed to load workouts or their exercises.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch workouts when the page is opened or revisited
  useEffect(() => {
    void fetchWorkouts();
  }, [location.key]);

  const handleCreateWorkout = async (
    data: CreateWorkoutInput,
    exerciseIds: string[],
  ) => {
    try {
      setSaving(true);
      setError('');
      setMessage('');

      const workout = await createWorkout(data);

      await Promise.all(
        exerciseIds.map((exerciseId) =>
          addExerciseToWorkout(workout.workoutId, exerciseId),
        ),
      );

      setMessage('Workout created successfully!');
      setShowForm(false);

      await fetchWorkouts();
    } catch {
      setError(
        'Workout create hua ya exercises save nahi hui. Please check again.',
      );

      throw new Error('Failed to create workout');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (workoutId: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this workout? This cannot be undone.',
    );

    if (!confirmed) return;

    try {
      setDeletingId(workoutId);
      setError('');
      setMessage('');

      await deleteWorkout(workoutId);

      setWorkouts((previous) =>
        previous.filter(
          (workout) => workout.workoutId !== workoutId,
        ),
      );

      setWorkoutExercises((previous) => {
        const updated = { ...previous };
        delete updated[workoutId];
        return updated;
      });

      setMessage('Workout deleted successfully!');
    } catch {
      setError('Failed to delete workout.');
    } finally {
      setDeletingId('');
    }
  };

  return (
    <div className="exercises-page">
      <div className="exercises-header">
        <div>
          <h1>My Workouts</h1>
          <p>Create and manage your workouts.</p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={() => {
            setShowForm((previous) => !previous);
            setError('');
            setMessage('');
          }}
        >
          {showForm ? 'Cancel' : '+ Create Workout'}
        </button>
      </div>

      {message && (
        <p className="success-message">{message}</p>
      )}

      {error && (
        <p className="error-message">{error}</p>
      )}

      {showForm && (
        <WorkoutForm onSubmit={handleCreateWorkout} />
      )}

      {loading ? (
        <p className="page-message">
          Loading workouts...
        </p>
      ) : workouts.length === 0 ? (
        <p className="page-message">
          No workouts yet. Create your first workout!
        </p>
      ) : (
        <div className="exercise-grid">
          {workouts.map((workout) => (
            <WorkoutCard
              key={workout.workoutId}
              workout={workout}
              exercises={
                workoutExercises[workout.workoutId] ?? []
              }
              deleting={deletingId === workout.workoutId}
              onViewDetails={() =>
                navigate(`/workouts/${workout.workoutId}`)
              }
              onStartWorkout={() =>
                navigate(
                  `/workouts/${workout.workoutId}/session`,
                )
              }
              onDelete={() =>
                void handleDelete(workout.workoutId)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Workouts;
