
import { IsUUID } from 'class-validator';

export class AddWorkoutExerciseDto {
  @IsUUID()
  exerciseId: string;
}