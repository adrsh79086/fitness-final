import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { WorkoutsService } from './workouts.service';

import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';
import { AddWorkoutExerciseDto } from './dto/add-workout-exercise.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('workouts')
@UseGuards(JwtAuthGuard)
export class WorkoutsController {
  constructor(
    private readonly workoutsService: WorkoutsService,
  ) {}

  @Post()
  create(
    @Req() req: any,
    @Body() dto: CreateWorkoutDto,
  ) {
    return this.workoutsService.create(
      req.user.sub,
      dto,
    );
  }

  @Get()
  findAll(@Req() req: any) {
    return this.workoutsService.findAll(req.user.sub);
  }

  @Get(':workoutId')
  findOne(
    @Req() req: any,
    @Param('workoutId') workoutId: string,
  ) {
    return this.workoutsService.findOne(
      req.user.sub,
      workoutId,
    );
  }

  @Patch(':workoutId')
  update(
    @Req() req: any,
    @Param('workoutId') workoutId: string,
    @Body() dto: UpdateWorkoutDto,
  ) {
    return this.workoutsService.update(
      req.user.sub,
      workoutId,
      dto,
    );
  }

  @Delete(':workoutId')
  remove(
    @Req() req: any,
    @Param('workoutId') workoutId: string,
  ) {
    return this.workoutsService.remove(
      req.user.sub,
      workoutId,
    );
  }

  // Add exercise to a workout
  @Post(':workoutId/exercises')
  addExercise(
    @Req() req: any,
    @Param('workoutId') workoutId: string,
    @Body() dto: AddWorkoutExerciseDto,
  ) {
    return this.workoutsService.addExercise(
      req.user.sub,
      workoutId,
      dto.exerciseId,
    );
  }

  // Get all exercises of a workout
  @Get(':workoutId/exercises')
  getWorkoutExercises(
    @Req() req: any,
    @Param('workoutId') workoutId: string,
  ) {
    return this.workoutsService.getWorkoutExercises(
      req.user.sub,
      workoutId,
    );
  }

  // Remove exercise from a workout
  @Delete(':workoutId/exercises/:exerciseId')
  removeExercise(
    @Req() req: any,
    @Param('workoutId') workoutId: string,
    @Param('exerciseId') exerciseId: string,
  ) {
    return this.workoutsService.removeExercise(
      req.user.sub,
      workoutId,
      exerciseId,
    );
  }
}
