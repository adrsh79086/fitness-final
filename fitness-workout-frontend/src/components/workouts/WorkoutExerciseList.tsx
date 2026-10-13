import type { WorkoutExercise } from '../../types/workoutExercise.types';

interface WorkoutExerciseListProps {
  exercises: WorkoutExercise[];
  editing: boolean;
  onRemove: (exerciseId: string) => void;
}

function WorkoutExerciseList({
  exercises,
  editing,
  onRemove,
}: WorkoutExerciseListProps) {
  if (exercises.length === 0) {
    return (
      <p className="page-message">
        No exercises added yet.
      </p>
    );
  }

  return (
    <div className="exercise-grid">
      {exercises.map((item) => (
        <div
          className="exercise-card"
          key={item.workoutExerciseId}
        >
          <h3>
            {item.exercise?.name || 'Exercise unavailable'}
          </h3>

          <p>
            <strong>Muscle Group:</strong>{' '}
            {item.exercise?.muscleGroup || 'N/A'}
          </p>

          <p>
            <strong>Equipment:</strong>{' '}
            {item.exercise?.equipment || 'N/A'}
          </p>

          {editing && (
            <button
              type="button"
              className="delete-button"
              onClick={() => onRemove(item.exerciseId)}
            >
              Remove
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default WorkoutExerciseList;
