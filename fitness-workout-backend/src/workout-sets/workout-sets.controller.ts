
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { WorkoutSetsService } from './workout-sets.service';
import { CreateWorkoutSetDto } from './dto/create-workout-set.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('workout-sets')
@UseGuards(JwtAuthGuard)
export class WorkoutSetsController {
  constructor(
    private readonly workoutSetsService: WorkoutSetsService,
  ) {}

  @Post()
  create(@Body() data: CreateWorkoutSetDto) {
    return this.workoutSetsService.create(data);
  }

  @Get(':workoutId')
  findByWorkout(@Param('workoutId') workoutId: string) {
    return this.workoutSetsService.findByWorkout(workoutId);
  }

  @Patch(':workoutSetId')
  update(
    @Param('workoutSetId') workoutSetId: string,
    @Body() data: Partial<CreateWorkoutSetDto>,
  ) {
    return this.workoutSetsService.update(workoutSetId, data);
  }

  @Delete(':workoutSetId')
  remove(@Param('workoutSetId') workoutSetId: string) {
    return this.workoutSetsService.remove(workoutSetId);
  }
}