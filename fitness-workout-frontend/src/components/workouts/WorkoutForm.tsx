import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';

import type { CreateWorkoutInput } from '../../types/workout.types';
import type { Exercise } from '../../types/exercise.types';

import { getExercises } from '../../services/exerciseService';

interface WorkoutFormProps {
  onSubmit: (
    data: CreateWorkoutInput,
    exerciseIds: string[]
  ) => Promise<void>;
}

function WorkoutForm({ onSubmit }: WorkoutFormProps) {
  const [date, setDate] = useState(() => {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    return today.toISOString().split('T')[0];
  });

  const [notes, setNotes] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loadingExercises, setLoadingExercises] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadExercises = async () => {
      try {
        const data = await getExercises();
        setExercises(data.filter((exercise) => exercise.isActive));
      } catch {
        setError('Exercises load nahi hui. Please try again.');
      } finally {
        setLoadingExercises(false);
      }
    };

    loadExercises();
  }, []);

  const toggleExercise = (exerciseId: string) => {
    setSelectedIds((previous) =>
      previous.includes(exerciseId)
        ? previous.filter((id) => id !== exerciseId)
        : [...previous, exerciseId]
    );
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (selectedIds.length === 0) {
      setError('Kam se kam ek exercise select karo.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      await onSubmit({ date, notes }, selectedIds);
      setNotes('');
      setSelectedIds([]);
    } catch {
      setError('Workout create nahi hua. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="exercise-form" onSubmit={handleSubmit}>
      <h2>Create Workout</h2>

      <label>Workout Date</label>
      <input
        type="date"
        value={date}
        min={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />

      <label>Notes</label>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="e.g. Chest and triceps workout"
        rows={3}
      />

      <h3>Select Exercises</h3>

      {loadingExercises ? (
        <p>Loading exercises...</p>
      ) : exercises.length === 0 ? (
        <p>No active exercises available. Ask Admin to add exercises.</p>
      ) : (
        <div className="workout-exercise-options">
          {exercises.map((exercise) => (
            <label
              key={exercise.exerciseId}
              className="workout-exercise-option"
            >
              <input
                type="checkbox"
                checked={selectedIds.includes(exercise.exerciseId)}
                onChange={() => toggleExercise(exercise.exerciseId)}
              />

              <span>
                <strong>{exercise.name}</strong>
                <small>
                  {exercise.muscleGroup} · {exercise.equipment}
                </small>
              </span>
            </label>
          ))}
        </div>
      )}

      <p>Selected exercises: {selectedIds.length}</p>

      {error && <p className="error-message">{error}</p>}

      <button
        className="primary-button"
        type="submit"
        disabled={saving || loadingExercises || exercises.length === 0}
      >
        {saving ? 'Creating Workout...' : 'Create Workout'}
      </button>
    </form>
  );
}

export default WorkoutForm;
