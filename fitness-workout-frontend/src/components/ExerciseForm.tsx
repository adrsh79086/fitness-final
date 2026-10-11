
import type { FormEvent } from 'react';
import type { ExerciseInput } from '../services/exerciseService';

interface ExerciseFormProps {
  form: ExerciseInput;
  setForm: (form: ExerciseInput) => void;
  editingId: string | null;
  saving: boolean;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

function ExerciseForm({
  form,
  setForm,
  editingId,
  saving,
  onSubmit,
}: ExerciseFormProps) {
  return (
    <form className="exercise-form" onSubmit={onSubmit}>
      <h2>{editingId ? 'Edit Exercise' : 'Add Exercise'}</h2>

      <label>Exercise Name</label>
      <input
        value={form.name}
        onChange={(e) =>
          setForm({ ...form, name: e.target.value })
        }
        placeholder="e.g. Bench Press"
        required
      />

      <label>Muscle Group</label>
      <input
        value={form.muscleGroup}
        onChange={(e) =>
          setForm({ ...form, muscleGroup: e.target.value })
        }
        placeholder="e.g. Chest"
        required
      />

      <label>Equipment</label>
      <input
        value={form.equipment}
        onChange={(e) =>
          setForm({ ...form, equipment: e.target.value })
        }
        placeholder="e.g. Barbell"
        required
      />

      <button
        className="primary-button"
        type="submit"
        disabled={saving}
      >
        {saving
          ? 'Saving...'
          : editingId
            ? 'Update Exercise'
            : 'Save Exercise'}
      </button>
    </form>
  );
}

export default ExerciseForm;
