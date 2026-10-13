
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

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

import {
  Exercise,
  ExerciseDocument,
} from '../exercises/schemas/exercise.schema';

import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';

@Injectable()
export class WorkoutsService {
  constructor(
    @InjectModel(Workout.name)
    private readonly workoutModel: Model<WorkoutDocument>,

    @InjectModel(WorkoutExercise.name)
    private readonly workoutExerciseModel: Model<WorkoutExerciseDocument>,

    @InjectModel(Exercise.name)
    private readonly exerciseModel: Model<ExerciseDocument>,
  ) {}

  // Create workout
  async create(userId: string, dto: CreateWorkoutDto) {
    const workout = new this.workoutModel({
      userId,
      date: dto.date ? new Date(dto.date) : new Date(),
      notes: dto.notes ?? '',
    });

    return workout.save();
  }

  // Get all workouts of logged-in user
  async findAll(userId: string) {
    return this.workoutModel
      .find({ userId })
      .sort({ date: -1 });
  }

  // Get one workout belonging to logged-in user
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

  // Update workout date, notes, or status
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

    if (dto.status !== undefined) {
      updates.status = dto.status;
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

  // Delete workout and its selected exercises
  async remove(userId: string, workoutId: string) {
    await this.findOne(userId, workoutId);

    await this.workoutExerciseModel.deleteMany({ workoutId });

    await this.workoutModel.deleteOne({
      workoutId,
      userId,
    });

    return {
      message: 'Workout deleted successfully',
    };
  }

  // Add exercise to a workout
  async addExercise(
    userId: string,
    workoutId: string,
    exerciseId: string,
  ) {
    // Check that workout belongs to this user
    await this.findOne(userId, workoutId);

    // Check that exercise exists and is active
    const exercise = await this.exerciseModel.findOne({
      exerciseId,
      isActive: true,
    });

    if (!exercise) {
      throw new NotFoundException('Active exercise not found');
    }

    // Prevent duplicate exercises
    const existing = await this.workoutExerciseModel.findOne({
      workoutId,
      exerciseId,
    });

    if (existing) {
      throw new ConflictException(
        'Exercise already added to this workout',
      );
    }

    // Calculate the next order number
    const lastExercise = await this.workoutExerciseModel
      .findOne({ workoutId })
      .sort({ order: -1 });

    const nextOrder = lastExercise
      ? lastExercise.order + 1
      : 1;

    // Save the selected exercise
    try {
      const workoutExercise = new this.workoutExerciseModel({
        workoutId,
        exerciseId,
        order: nextOrder,
      });

      return await workoutExercise.save();
    } catch (error: any) {
      if (error?.code === 11000) {
        throw new ConflictException(
          'Exercise already added to this workout',
        );
      }

      throw error;
    }
  }

  // Get selected exercises for a workout
  async getWorkoutExercises(
    userId: string,
    workoutId: string,
  ) {
    // Verify workout ownership
    await this.findOne(userId, workoutId);

    const items = await this.workoutExerciseModel
      .find({ workoutId })
      .sort({ order: 1 })
      .lean();

    const exerciseIds = items.map(
      (item) => item.exerciseId,
    );

    // Include exercises even if later deactivated
    const exercises = await this.exerciseModel
      .find({ exerciseId: { $in: exerciseIds } })
      .lean();

    const exerciseMap = new Map<
      string,
      (typeof exercises)[number]
    >(
      exercises.map((exercise) => [
        exercise.exerciseId,
        exercise,
      ]),
    );

    return items.map((item) => ({
      ...item,
      exercise: exerciseMap.get(item.exerciseId) ?? null,
    }));
  }

  // Remove an exercise from a workout
  async removeExercise(
    userId: string,
    workoutId: string,
    exerciseId: string,
  ) {
    // Verify workout ownership
    await this.findOne(userId, workoutId);

    const result = await this.workoutExerciseModel.deleteOne({
      workoutId,
      exerciseId,
    });

    if (result.deletedCount === 0) {
      throw new NotFoundException(
        'Exercise not found in this workout',
      );
    }

    return {
      message: 'Exercise removed from workout successfully',
    };
  }
}
