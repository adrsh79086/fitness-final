
interface WorkoutActionsProps {
  status: 'planned' | 'in-progress' | 'completed';
  hasExercises: boolean;
  editing: boolean;
  onStartWorkout: () => void;
  onToggleEdit: () => void;
  onBack: () => void;
}

function WorkoutActions({
  status,
  hasExercises,
  editing,
  onStartWorkout,
  onToggleEdit,
  onBack,
}: WorkoutActionsProps) {
  const isCompleted = status === 'completed';

  return (
    <>
      {!isCompleted && (
        <div className="workout-actions">
          {hasExercises && (
            <button
              type="button"
              className="primary-button"
              onClick={onStartWorkout}
            >
              {status === 'in-progress'
                ? 'Continue Workout'
                : 'Start Workout'}
            </button>
          )}

          <button
            type="button"
            className="secondary-button"
            onClick={onToggleEdit}
          >
            {editing ? 'Done Editing' : 'Edit Exercises'}
          </button>
        </div>
      )}

      <button
        type="button"
        className="secondary-button"
        onClick={onBack}
      >
        Back to Workouts
      </button>
    </>
  );
}

export default WorkoutActions;
