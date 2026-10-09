import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  Exercise,
  ExerciseDocument,
} from './schemas/exercise.schema';

import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';

@Injectable()
export class ExercisesService {
  constructor(
    @InjectModel(Exercise.name)
    private exerciseModel: Model<ExerciseDocument>,
  ) {}

  // Create Exercise
  async create(createExerciseDto: CreateExerciseDto) {
    const exercise = new this.exerciseModel(
      createExerciseDto,
    );

    return await exercise.save();
  }

  // Get All Active Exercises
  async findAll() {
    return await this.exerciseModel.find({
      isActive: true,
    });
  }

  // Get Exercise By UUID
  async findOne(exerciseId: string) {
    const exercise = await this.exerciseModel.findOne({
      exerciseId: exerciseId,
    });

    if (!exercise) {
      throw new NotFoundException('Exercise not found');
    }

    return exercise;
  }
  // Update Exercise
async update(
  exerciseId: string,
  updateExerciseDto: UpdateExerciseDto,
) {
  const exercise = await this.exerciseModel.findOneAndUpdate(
    { exerciseId },
    { $set: updateExerciseDto },
    {
      returnDocument: 'after',
      runValidators: true,
    },
  );

  if (!exercise) {
    throw new NotFoundException('Exercise not found');
  }

  return exercise;
}

// Delete Exercise (soft delete)
async remove(exerciseId: string) {
  const exercise = await this.exerciseModel.findOneAndUpdate(
    { exerciseId },
    { $set: { isActive: false } },
    { new: true },
  );

  if (!exercise) {
    throw new NotFoundException('Exercise not found');
  }

  return {
    message: 'Exercise deactivated successfully',
    exercise,
  };
}
}