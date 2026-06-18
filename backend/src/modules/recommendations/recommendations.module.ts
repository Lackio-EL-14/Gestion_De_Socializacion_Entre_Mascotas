import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecommendationsController } from './controller/recommendations.controller';
import { RecommendationsService } from './service/recommendations.service';
import { Evento } from '../events/entities/events.entity';
import { AsistenciaEvento } from '../events/entities/asistencia.entity';
import { Pet } from '../pets/entities/pet.entity';
import { Match } from '../matches/entities/match.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Evento, AsistenciaEvento, Pet, Match])
  ],
  controllers: [RecommendationsController],
  providers: [RecommendationsService],
})
export class RecommendationsModule {}
