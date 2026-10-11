import { useState } from 'react';
import type { FormEvent } from 'react';
import type { CreateWorkoutInput } from '../../types/workout.types';

interface WorkoutFormProps {
  onSubmit: (data: CreateWorkoutInput) => Promise<void>;
}

function WorkoutForm({ onSubmit }: WorkoutFormProps) {
  const [date, setDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      await onSubmit({ date, notes });
      setNotes('');
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
        onChange={(e) => setDate(e.target.value)}
        required
      />

      <label>Notes</label>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="e.g. Chest and triceps workout"
        rows={4}
      />

      {error && <p className="error-message">{error}</p>}

      <button className="primary-button" type="submit" disabled={saving}>
        {saving ? 'Creating...' : 'Create Workout'}
      </button>
    </form>
  );
}

export default WorkoutForm;
