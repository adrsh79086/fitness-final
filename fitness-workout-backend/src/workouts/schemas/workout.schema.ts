import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type WorkoutDocument = HydratedDocument<Workout>;

@Schema({ timestamps: true })
export class Workout {
  @Prop({
    default: () => uuidv4(),
    unique: true,
  })
  workoutId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ default: () => new Date() })
  date: Date;

  @Prop({ default: '' })
  notes: string;

  @Prop({
    required: true,
    enum: ['planned', 'in-progress', 'completed'],
    default: 'planned',
  })
  status: string;
}

export const WorkoutSchema = SchemaFactory.createForClass(Workout);