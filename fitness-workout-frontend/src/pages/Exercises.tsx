
import { useEffect, useState } from 'react';
import {
  createExercise,
  deleteExercise,
  getExercises,
  updateExercise,
  type ExerciseInput,
} from '../services/exerciseService';
import type { Exercise } from '../types/exercise.types';

import ExerciseForm from '../components/ExerciseForm';
import ExerciseList from '../components/ExerciseList';

const emptyForm: ExerciseInput = {
  name: '',
  muscleGroup: '',
  equipment: '',
};

function Exercises() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [form, setForm] = useState<ExerciseInput>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const user = localStorage.getItem('user');
  const isAdmin = user
    ? JSON.parse(user).role === 'admin'
    : false;

  const fetchExercises = async () => {
    try {
      setError('');
      const data = await getExercises();
      setExercises(data);
    } catch {
      setError('Failed to load exercises.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');

    try {
      if (editingId) {
        await updateExercise(editingId, form);
        setMessage('Exercise updated successfully!');
      } else {
        await createExercise(form);
        setMessage('Exercise added successfully!');
      }

      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
      await fetchExercises();
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Operation failed.'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (exercise: Exercise) => {
    setForm({
      name: exercise.name,
      muscleGroup: exercise.muscleGroup,
      equipment: exercise.equipment,
    });

    setEditingId(exercise.exerciseId);
    setShowForm(true);
    setError('');
    setMessage('');
  };

  const handleDelete = async (exerciseId: string) => {
    if (!window.confirm('Delete this exercise?')) return;

    setError('');
    setMessage('');

    try {
      await deleteExercise(exerciseId);
      setMessage('Exercise deleted successfully!');
      await fetchExercises();
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Failed to delete exercise.'
      );
    }
  };

  if (loading) {
    return <p className="page-message">Loading exercises...</p>;
  }

  return (
    <div className="exercises-page">
      <div className="exercises-header">
        <div>
          <h1>Exercises</h1>
          <p>Explore available exercises.</p>
        </div>

        {isAdmin && (
          <button
            className="primary-button"
            onClick={() => {
              setForm(emptyForm);
              setEditingId(null);
              setShowForm(!showForm);
              setError('');
              setMessage('');
            }}
          >
            {showForm ? 'Cancel' : '+ Add Exercise'}
          </button>
        )}
      </div>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      {showForm && isAdmin && (
        <ExerciseForm
          form={form}
          setForm={setForm}
          editingId={editingId}
          saving={saving}
          onSubmit={handleSubmit}
        />
      )}

      <ExerciseList
        exercises={exercises}
        isAdmin={isAdmin}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default Exercises;
