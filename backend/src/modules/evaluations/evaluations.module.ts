import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Evaluation } from './entities/evaluations.entity';
import { AsistenciaEvento } from '../events/entities/asistencia.entity';
import { EvaluationsController } from './controller/evaluations.controller';
import { EvaluationsService } from './service/evaluations.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Evaluation, AsistenciaEvento])
  ],
  controllers: [EvaluationsController],
  providers: [EvaluationsService],
  exports: [EvaluationsService],
})
export class EvaluationsModule {}
