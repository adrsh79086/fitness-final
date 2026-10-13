
import type { Exercise } from '../../types/exercise.types';

interface ExerciseSelectorProps {
  exercises: Exercise[];
  selectedIds: string[];
  saving: boolean;
  onSelect: (exerciseId: string) => void;
  onAdd: () => void;
}

function ExerciseSelector({
  exercises,
  selectedIds,
  saving,
  onSelect,
  onAdd,
}: ExerciseSelectorProps) {
  return (
    <div className="exercise-form">
      <h2>Add Exercise</h2>

      <label htmlFor="exercise-select">
        Select Exercise
      </label>

      <select
        id="exercise-select"
        defaultValue=""
        onChange={(event) => onSelect(event.target.value)}
      >
        <option value="">Choose an exercise</option>

        {exercises.map((exercise) => (
          <option
            key={exercise.exerciseId}
            value={exercise.exerciseId}
            disabled={selectedIds.includes(exercise.exerciseId)}
          >
            {exercise.name} — {exercise.muscleGroup}
          </option>
        ))}
      </select>

      <button
        type="button"
        className="primary-button"
        onClick={onAdd}
        disabled={saving}
      >
        {saving ? 'Adding...' : 'Add Exercise'}
      </button>
    </div>
  );
}

export default ExerciseSelector;
