import type { Workout } from '../../types/workout.types';
import type { WorkoutExercise } from '../../types/workoutExercise.types';

interface WorkoutCardProps {
  workout: Workout;
  exercises: WorkoutExercise[];
  deleting: boolean;
  onViewDetails: () => void;
  onStartWorkout: () => void;
  onDelete: () => void;
}

function WorkoutCard({
  workout,
  exercises,
  deleting,
  onViewDetails,
  onStartWorkout,
  onDelete,
}: WorkoutCardProps) {
  const formattedStatus =
    workout.status === 'in-progress'
      ? 'In Progress'
      : workout.status === 'completed'
        ? 'Completed'
        : 'Planned';

  return (
    <div className="exercise-card">
      <h3>Workout</h3>

      <p>
        <strong>Date:</strong>{' '}
        {new Date(workout.date).toLocaleDateString()}
      </p>

      <p>
        <strong>Notes:</strong>{' '}
        {workout.notes || 'No notes'}
      </p>

      <p>
        <strong>Status:</strong> {formattedStatus}
      </p>

      <div className="workout-preview">
        <strong>Exercises ({exercises.length})</strong>

        {exercises.length === 0 ? (
          <p>No exercises added.</p>
        ) : (
          <ul>
            {exercises.map((item) => (
              <li key={item.workoutExerciseId}>
                {item.exercise?.name || 'Exercise unavailable'}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="workout-card-actions">
        <button
          type="button"
          className="primary-button"
          onClick={onViewDetails}
        >
          View Details
        </button>

        
{workout.status !== 'completed' && (
  <button
    type="button"
    className="start-workout-button"
    disabled={exercises.length === 0}
    onClick={onStartWorkout}
  >
    {workout.status === 'in-progress'
      ? 'Continue Workout'
      : 'Start Workout'}
  </button>
)}

        <button
          type="button"
          className="delete-button"
          disabled={deleting}
          onClick={onDelete}
        >
          {deleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
}

export default WorkoutCard;
