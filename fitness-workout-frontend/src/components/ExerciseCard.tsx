
import type { Exercise } from '../types/exercise.types';

interface ExerciseCardProps {
  exercise: Exercise;
  isAdmin: boolean;
  onEdit: (exercise: Exercise) => void;
  onDelete: (exerciseId: string) => void;
}

function ExerciseCard({
  exercise,
  isAdmin,
  onEdit,
  onDelete,
}: ExerciseCardProps) {
  return (
    <div className="exercise-card">
      <h3>{exercise.name}</h3>

      <p>
        <strong>Muscle Group:</strong> {exercise.muscleGroup}
      </p>

      <p>
        <strong>Equipment:</strong> {exercise.equipment}
      </p>

      {isAdmin && (
        <div className="exercise-actions">
          <button
            className="edit-button"
            onClick={() => onEdit(exercise)}
          >
            Edit
          </button>

          <button
            className="delete-button"
            onClick={() => onDelete(exercise.exerciseId)}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default ExerciseCard;
