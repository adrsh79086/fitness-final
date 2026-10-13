import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { WorkoutsController } from './workouts.controller';
import { WorkoutsService } from './workouts.service';

import {
  Workout,
  WorkoutSchema,
} from './schemas/workout.schema';

import {
  WorkoutExercise,
  WorkoutExerciseSchema,
} from './schemas/workout-exercise.schema';

import {
  Exercise,
  ExerciseSchema,
} from '../exercises/schemas/exercise.schema';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Workout.name, schema: WorkoutSchema },
      {
        name: WorkoutExercise.name,
        schema: WorkoutExerciseSchema,
      },
      {
        name: Exercise.name,
        schema: ExerciseSchema,
      },
    ]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
    }),
  ],
  controllers: [WorkoutsController],
  providers: [WorkoutsService, JwtAuthGuard, RolesGuard],
  exports: [WorkoutsService],
})
export class WorkoutsModule {}
