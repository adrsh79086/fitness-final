import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  WorkoutSet,
  WorkoutSetSchema,
} from './schemas/workout-set.schema';

import { WorkoutSetsController } from './workout-sets.controller';
import { WorkoutSetsService } from './workout-sets.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: WorkoutSet.name,
        schema: WorkoutSetSchema,
      },
    ]),
    AuthModule,
  ],
  controllers: [WorkoutSetsController],
  providers: [WorkoutSetsService],
  exports: [WorkoutSetsService],
})
export class WorkoutSetsModule {}
