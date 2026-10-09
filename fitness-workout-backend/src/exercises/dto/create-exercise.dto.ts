import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateExerciseDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  muscleGroup: string;

  @IsString()
  @IsNotEmpty()
  equipment: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}