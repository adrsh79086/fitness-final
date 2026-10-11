
import { useState } from 'react';
import type { Exercise } from '../types/exercise.types';
import ExerciseCard from './ExerciseCard';

interface ExerciseListProps {
  exercises: Exercise[];
  isAdmin: boolean;
  onEdit: (exercise: Exercise) => void;
  onDelete: (exerciseId: string) => void;
}

function ExerciseList({
  exercises,
  isAdmin,
  onEdit,
  onDelete,
}: ExerciseListProps) {
  const [search, setSearch] = useState('');

  const filteredExercises = exercises.filter((exercise) =>
    exercise.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <input
        className="exercise-search"
        type="text"
        placeholder="Search exercises by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <p>Total Exercises: {exercises.length}</p>

      {filteredExercises.length === 0 ? (
        <p className="page-message">No exercises found.</p>
      ) : (
        <div className="exercise-grid">
          {filteredExercises.map((exercise) => (
            <ExerciseCard
              key={exercise.exerciseId}
              exercise={exercise}
              isAdmin={isAdmin}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default ExerciseList;