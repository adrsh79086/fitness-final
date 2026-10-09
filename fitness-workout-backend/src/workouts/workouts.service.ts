
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  Workout,
  WorkoutDocument,
} from './schemas/workout.schema';

import {
  WorkoutExercise,
  WorkoutExerciseDocument,
} from './schemas/workout-exercise.schema';

import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';

@Injectable()
export class WorkoutsService {
  constructor(
    @InjectModel(Workout.name)
    private readonly workoutModel: Model<WorkoutDocument>,

    @InjectModel(WorkoutExercise.name)
    private readonly workoutExerciseModel: Model<WorkoutExerciseDocument>,
  ) {}

  async create(userId: string, dto: CreateWorkoutDto) {
    const workout = new this.workoutModel({
      userId,
      date: dto.date ? new Date(dto.date) : new Date(),
      notes: dto.notes ?? '',
    });

    return workout.save();
  }

  async findAll(userId: string) {
    return this.workoutModel
      .find({ userId })
      .sort({ date: -1 });
  }

  async findOne(userId: string, workoutId: string) {
    const workout = await this.workoutModel.findOne({
      userId,
      workoutId,
    });

    if (!workout) {
      throw new NotFoundException('Workout not found');
    }

    return workout;
  }

  async update(
    userId: string,
    workoutId: string,
    dto: UpdateWorkoutDto,
  ) {
    const updates: Record<string, unknown> = {};

    if (dto.date !== undefined) {
      updates.date = new Date(dto.date);
    }

    if (dto.notes !== undefined) {
      updates.notes = dto.notes;
    }

    const workout = await this.workoutModel.findOneAndUpdate(
      { userId, workoutId },
      { $set: updates },
      { returnDocument: 'after', runValidators: true },
    );

    if (!workout) {
      throw new NotFoundException('Workout not found');
    }

    return workout;
  }

  async remove(userId: string, workoutId: string) {
    const workout = await this.workoutModel.findOne({
      userId,
      workoutId,
    });

    if (!workout) {
      throw new NotFoundException('Workout not found');
    }

    await this.workoutExerciseModel.deleteMany({ workoutId });
    await this.workoutModel.deleteOne({ workoutId, userId });

    return { message: 'Workout deleted successfully' };
  }
}
