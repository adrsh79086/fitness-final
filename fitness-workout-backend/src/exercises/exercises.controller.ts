import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

import { ExercisesService } from './exercises.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';

@Controller('exercises')
export class ExercisesController {
  constructor(
    private readonly exercisesService: ExercisesService,
  ) {}

  // Admin only: Create
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  create(@Body() createExerciseDto: CreateExerciseDto) {
    return this.exercisesService.create(createExerciseDto);
  }

  // Public: Get all active exercises
  @Get()
  findAll() {
    return this.exercisesService.findAll();
  }

  // Public: Get exercise by UUID
  @Get(':exerciseId')
  findOne(@Param('exerciseId') exerciseId: string) {
    return this.exercisesService.findOne(exerciseId);
  }

  // Admin only: Update
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':exerciseId')
  update(
    @Param('exerciseId') exerciseId: string,
    @Body() updateExerciseDto: UpdateExerciseDto,
  ) {
    return this.exercisesService.update(
      exerciseId,
      updateExerciseDto,
    );
  }

  // Admin only: Deactivate
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':exerciseId')
  remove(@Param('exerciseId') exerciseId: string) {
    return this.exercisesService.remove(exerciseId);
  }
}