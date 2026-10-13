import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type WorkoutSetDocument = WorkoutSet & Document;

@Schema({ timestamps: true })
export class WorkoutSet {
  @Prop({
    default: () => uuidv4(),
    unique: true,
  })
  workoutSetId: string;

  @Prop({ required: true })
  workoutId: string;

  @Prop({ required: true })
  exerciseId: string;

  @Prop({ required: true, min: 1 })
  setNumber: number;

  @Prop({ required: true, min: 1 })
  reps: number;

  @Prop({ required: true, min: 0 })
  weight: number;

  @Prop({ default: false })
  completed: boolean;
}

export const WorkoutSetSchema =
  SchemaFactory.createForClass(WorkoutSet);
