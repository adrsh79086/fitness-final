import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  WorkoutSet,
  WorkoutSetDocument,
} from './schemas/workout-set.schema';

@Injectable()
export class WorkoutSetsService {
  constructor(
    @InjectModel(WorkoutSet.name)
    private readonly workoutSetModel: Model<WorkoutSetDocument>,
  ) {}

  async create(data: Partial<WorkoutSet>) {
    const workoutSet = new this.workoutSetModel(data);

    return workoutSet.save();
  }

  async findByWorkout(workoutId: string) {
    return this.workoutSetModel
      .find({ workoutId })
      .sort({ exerciseId: 1, setNumber: 1 })
      .exec();
  }

  async update(
    workoutSetId: string,
    data: Partial<WorkoutSet>,
  ) {
    const updatedSet = await this.workoutSetModel.findOneAndUpdate(
      { workoutSetId },
      { $set: data },
      { new: true, runValidators: true },
    ).exec();

    if (!updatedSet) {
      throw new NotFoundException('Workout set not found');
    }

    return updatedSet;
  }

  async remove(workoutSetId: string) {
    const deletedSet = await this.workoutSetModel
      .findOneAndDelete({ workoutSetId })
      .exec();

    if (!deletedSet) {
      throw new NotFoundException('Workout set not found');
    }

    return { message: 'Workout set deleted successfully' };
  }
}
