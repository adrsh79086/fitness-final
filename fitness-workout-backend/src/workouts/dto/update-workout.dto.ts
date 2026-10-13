
import { PartialType } from '@nestjs/mapped-types';
import { IsIn, IsOptional } from 'class-validator';
import { CreateWorkoutDto } from './create-workout.dto';

export class UpdateWorkoutDto extends PartialType(CreateWorkoutDto) {
  @IsOptional()
  @IsIn(['planned', 'in-progress', 'completed'])
  status?: string;
}
