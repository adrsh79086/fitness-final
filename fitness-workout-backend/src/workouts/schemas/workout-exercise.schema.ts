import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type WorkoutExerciseDocument =
  HydratedDocument<WorkoutExercise>;

@Schema({ timestamps: true })
export class WorkoutExercise {
  @Prop({
    default: () => uuidv4(),
    unique: true,
  })
  workoutExerciseId: string;

  @Prop({ required: true })
  workoutId: string;

  @Prop({ required: true })
  exerciseId: string;

  @Prop({ required: true, min: 1 })
  order: number;
}

export const WorkoutExerciseSchema =
  SchemaFactory.createForClass(WorkoutExercise);

// Same exercise cannot be added twice to one workout.
WorkoutExerciseSchema.index(
  { workoutId: 1, exerciseId: 1 },
  { unique: true },
);