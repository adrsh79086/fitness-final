
import {
  IsDateString,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateWorkoutDto {
  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
