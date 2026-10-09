import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type ExerciseDocument = HydratedDocument<Exercise>;

@Schema({ timestamps: true })
export class Exercise {
  @Prop({
    default: () => uuidv4(),
    unique: true,
  })
  exerciseId: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  muscleGroup: string;

  @Prop({ required: true, trim: true })
  equipment: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const ExerciseSchema =
  SchemaFactory.createForClass(Exercise);