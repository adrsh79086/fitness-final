
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import type { Exercise } from '../types/exercise.types';
import type { WorkoutExercise } from '../types/workoutExercise.types';
import type { Workout } from '../types/workout.types';

import { getExercises } from '../services/exerciseService';
import {
  addExerciseToWorkout,
  getWorkout,
  getWorkoutExercises,
  removeExerciseFromWorkout,
} from '../services/workoutService';

import WorkoutExerciseList from '../components/workouts/WorkoutExerciseList';
import ExerciseSelector from '../components/workouts/ExerciseSelector';
import WorkoutActions from '../components/workouts/WorkoutActions';

function WorkoutDetails() {
  const { workoutId } = useParams<{ workoutId: string }>();
  const navigate = useNavigate();

  const [workout, setWorkout] = useState<Workout | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<
    WorkoutExercise[]
  >([]);
  const [selectedId, setSelectedId] = useState('');
  const [showEditExercises, setShowEditExercises] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadData = async () => {
    if (!workoutId) {
      setError('Workout ID is missing.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');

      const [workoutData, exerciseData, workoutExerciseData] =
        await Promise.all([
          getWorkout(workoutId),
          getExercises(),
          getWorkoutExercises(workoutId),
        ]);

      setWorkout(workoutData);
      setExercises(exerciseData);
      setSelectedExercises(workoutExerciseData);
    } catch {
      setError('Failed to load workout details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, [workoutId]);

  const handleAddExercise = async () => {
    if (!workoutId || !selectedId) {
      setError('Please select an exercise.');
      return;
    }

    try {
      setSaving(true);
      setError('');
      setMessage('');

      await addExerciseToWorkout(workoutId, selectedId);

      setSelectedId('');
      setMessage('Exercise added successfully.');

      await loadData();
    } catch {
      setError('Failed to add exercise.');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveExercise = async (exerciseId: string) => {
    if (!workoutId) return;

    const confirmed = window.confirm(
      'Are you sure you want to remove this exercise?',
    );

    if (!confirmed) return;

    try {
      setError('');
      setMessage('');

      await removeExerciseFromWorkout(workoutId, exerciseId);

      setMessage('Exercise removed successfully.');

      await loadData();
    } catch {
      setError('Failed to remove exercise.');
    }
  };

  if (loading) {
    return (
      <p className="page-message">
        Loading workout details...
      </p>
    );
  }

  if (!workout) {
    return (
      <div className="page-container">
        {error && <p className="error-message">{error}</p>}

        <button
          type="button"
          className="secondary-button"
          onClick={() => navigate('/workouts')}
        >
          Back to Workouts
        </button>
      </div>
    );
  }

  const isCompleted = workout.status === 'completed';

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Workout Details</h1>

        <WorkoutActions
          status={workout.status}
          hasExercises={selectedExercises.length > 0}
          editing={showEditExercises}
          onStartWorkout={() =>
            navigate(`/workouts/${workoutId}/session`)
          }
          onToggleEdit={() => {
            setShowEditExercises((previous) => !previous);
            setError('');
            setMessage('');
          }}
          onBack={() => navigate('/workouts')}
        />
      </div>

      <p>
        <strong>Status:</strong>{' '}
        {isCompleted
          ? 'Completed'
          : workout.status === 'in-progress'
            ? 'In Progress'
            : 'Planned'}
      </p>

      {error && (
        <p className="error-message">{error}</p>
      )}

      {message && (
        <p className="success-message">{message}</p>
      )}

      {!isCompleted && showEditExercises && (
        <ExerciseSelector
          exercises={exercises}
          selectedIds={selectedExercises.map(
            (item) => item.exerciseId,
          )}
          saving={saving}
          onSelect={setSelectedId}
          onAdd={handleAddExercise}
        />
      )}

      <h2>Selected Exercises</h2>

      <WorkoutExerciseList
        exercises={selectedExercises}
        editing={!isCompleted && showEditExercises}
        onRemove={handleRemoveExercise}
      />
    </div>
  );
}

export default WorkoutDetails;
