
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  getWorkoutExercises,
  updateWorkoutStatus,
} from '../services/workoutService';

import {
  getWorkoutSets,
  saveWorkoutSet,
  updateWorkoutSet,
} from '../services/workoutSetService';

import type { WorkoutExercise } from '../types/workoutExercise.types';

import type {
  WorkoutSet,
  WorkoutSetInput,
} from '../services/workoutSetService';

function WorkoutSession() {
  const { workoutId } = useParams<{ workoutId: string }>();
  const navigate = useNavigate();

  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
  const [sets, setSets] = useState<Record<string, WorkoutSet[]>>({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState('');
  const [finishing, setFinishing] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadData = async () => {
      if (!workoutId) {
        setError('Workout ID is missing.');
        setLoading(false);
        return;
      }

      try {
        const [exerciseData, savedSets] = await Promise.all([
          getWorkoutExercises(workoutId),
          getWorkoutSets(workoutId),
        ]);

        setExercises(exerciseData);

        const groupedSets: Record<string, WorkoutSet[]> = {};

        exerciseData.forEach((exercise) => {
          groupedSets[exercise.exerciseId] = [];
        });

        savedSets.forEach((set) => {
          if (!groupedSets[set.exerciseId]) {
            groupedSets[set.exerciseId] = [];
          }

          groupedSets[set.exerciseId].push(set);
        });

        exerciseData.forEach((exercise) => {
          if (groupedSets[exercise.exerciseId].length === 0) {
            groupedSets[exercise.exerciseId] = [
              {
                workoutSetId: '',
                workoutId,
                exerciseId: exercise.exerciseId,
                setNumber: 1,
                reps: 10,
                weight: 0,
                completed: false,
              },
            ];
          }

          groupedSets[exercise.exerciseId].sort(
            (a, b) => a.setNumber - b.setNumber,
          );
        });

        setSets(groupedSets);
      } catch {
        setError('Failed to load session. Check your login and API.');
      } finally {
        setLoading(false);
      }
    };

    void loadData();
  }, [workoutId]);

  const handleSetChange = (
    exerciseId: string,
    setNumber: number,
    field: 'reps' | 'weight' | 'completed',
    value: number | boolean,
  ) => {
    setSets((previous) => ({
      ...previous,
      [exerciseId]: previous[exerciseId].map((set) =>
        set.setNumber === setNumber
          ? { ...set, [field]: value }
          : set,
      ),
    }));
  };

  const handleAddSet = (exerciseId: string) => {
    setSets((previous) => {
      const exerciseSets = previous[exerciseId] ?? [];

      return {
        ...previous,
        [exerciseId]: [
          ...exerciseSets,
          {
            workoutSetId: '',
            workoutId: workoutId ?? '',
            exerciseId,
            setNumber:
              exerciseSets.reduce(
                (max, set) => Math.max(max, set.setNumber),
                0,
              ) + 1,
            reps: 10,
            weight: 0,
            completed: false,
          },
        ],
      };
    });
  };

  const handleSaveSet = async (
    exerciseId: string,
    set: WorkoutSet,
  ) => {
    if (!workoutId) return;

    if (!Number.isInteger(set.reps) || set.reps < 1) {
      setError('Reps must be at least 1.');
      return;
    }

    if (!Number.isFinite(set.weight) || set.weight < 0) {
      setError('Weight cannot be negative.');
      return;
    }

    try {
      setSavingId(`${exerciseId}-${set.setNumber}`);
      setError('');
      setMessage('');

      const payload: WorkoutSetInput = {
        workoutId,
        exerciseId,
        setNumber: set.setNumber,
        reps: set.reps,
        weight: set.weight,
        completed: set.completed,
      };

      const savedSet = set.workoutSetId
        ? await updateWorkoutSet(set.workoutSetId, payload)
        : await saveWorkoutSet(payload);

      setSets((previous) => ({
        ...previous,
        [exerciseId]: previous[exerciseId].map((item) =>
          item.setNumber === set.setNumber ? savedSet : item,
        ),
      }));

      setMessage(`Set ${set.setNumber} saved successfully.`);
    } catch {
      setError('Failed to save set. Check your token and backend.');
    } finally {
      setSavingId('');
    }
  };

  const handleFinishWorkout = async () => {
    if (!workoutId || finishing) return;

    const allSets = Object.values(sets).flat();

    if (allSets.length === 0) {
      setError('There are no sets to finish.');
      return;
    }

    if (savingId) {
      setError('Please wait until the current set is saved.');
      return;
    }

    if (allSets.some((set) => !set.workoutSetId)) {
      setError('Please save every set before finishing.');
      return;
    }

    if (allSets.some((set) => !set.completed)) {
      setError('Please mark every set as Done and save it.');
      return;
    }

    try {
      setFinishing(true);
      setError('');
      setMessage('');

      await updateWorkoutStatus(workoutId, 'completed');

      setMessage('Workout completed successfully!');

      navigate(`/workouts/${workoutId}`, {
        state: { workoutCompleted: true },
      });
    } catch {
      setError('Failed to complete workout. Please try again.');
    } finally {
      setFinishing(false);
    }
  };

  if (loading) {
    return (
      <p className="page-message">
        Loading workout session...
      </p>
    );
  }

  return (
    <div className="exercises-page">
      <div className="exercises-header">
        <div>
          <h1>Workout Session</h1>
          <p>Track your sets, reps and weight.</p>
        </div>

        <button
          type="button"
          className="secondary-button"
          onClick={() => navigate(`/workouts/${workoutId}`)}
        >
          Back to Details
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}

      {exercises.length === 0 ? (
        <p className="page-message">
          No exercises found in this workout.
        </p>
      ) : (
        <>
          {exercises.map((exercise) => (
            <div
              className="exercise-card"
              key={exercise.workoutExerciseId}
            >
              <h2>
                {exercise.exercise?.name ?? 'Exercise unavailable'}
              </h2>

              <p>
                <strong>Muscle Group:</strong>{' '}
                {exercise.exercise?.muscleGroup ?? 'N/A'}
              </p>

              <div className="workout-preview">
                <strong>Sets</strong>

                {(sets[exercise.exerciseId] ?? []).map((set) => {
                  const currentSavingId =
                    `${exercise.exerciseId}-${set.setNumber}`;

                  return (
                    <div
                      className="workout-set-row"
                      key={set.setNumber}
                    >
                      <span>Set {set.setNumber}</span>

                      <label>
                        Reps
                        <input
                          type="number"
                          min="1"
                          value={set.reps}
                          onChange={(event) =>
                            handleSetChange(
                              exercise.exerciseId,
                              set.setNumber,
                              'reps',
                              Number(event.target.value),
                            )
                          }
                        />
                      </label>

                      <label>
                        Weight (kg)
                        <input
                          type="number"
                          min="0"
                          step="0.5"
                          value={set.weight}
                          onChange={(event) =>
                            handleSetChange(
                              exercise.exerciseId,
                              set.setNumber,
                              'weight',
                              Number(event.target.value),
                            )
                          }
                        />
                      </label>

                      <label>
                        <input
                          type="checkbox"
                          checked={set.completed}
                          onChange={(event) =>
                            handleSetChange(
                              exercise.exerciseId,
                              set.setNumber,
                              'completed',
                              event.target.checked,
                            )
                          }
                        />
                        Done
                      </label>

                      <button
                        type="button"
                        className="primary-button"
                        disabled={Boolean(savingId) || finishing}
                        onClick={() =>
                          void handleSaveSet(exercise.exerciseId, set)
                        }
                      >
                        {savingId === currentSavingId
                          ? 'Saving...'
                          : set.workoutSetId
                            ? 'Update Set'
                            : 'Save Set'}
                      </button>
                    </div>
                  );
                })}

                <button
                  type="button"
                  className="secondary-button"
                  disabled={finishing}
                  onClick={() => handleAddSet(exercise.exerciseId)}
                >
                  + Add Set
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            className="primary-button"
            disabled={finishing || Boolean(savingId)}
            onClick={() => void handleFinishWorkout()}
          >
            {finishing ? 'Finishing...' : 'Finish Workout'}
          </button>
        </>
      )}
    </div>
  );
}

export default WorkoutSession;
