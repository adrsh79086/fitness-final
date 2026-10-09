
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { ExercisesController } from './exercises.controller';
import { ExercisesService } from './exercises.service';
import { Exercise, ExerciseSchema } from './schemas/exercise.schema';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
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
  controllers: [ExercisesController],
  providers: [
    ExercisesService,
    JwtAuthGuard,
    RolesGuard,
  ],
  exports: [ExercisesService],
})
export class ExercisesModule {}
