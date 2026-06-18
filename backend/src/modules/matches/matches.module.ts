import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from './entities/match.entity';
import { Interaccion } from '../users/entities/interaccion.entity';
import { MatchesController } from './controller/matches.controller';
import { MatchesService } from './service/matches.service';
import { MessagesModule } from '../messages/messages.module';
import { Pet } from '../pets/entities/pet.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Match, Interaccion, Pet]),
    MessagesModule
  ],
  controllers: [MatchesController],
  providers: [MatchesService],
  exports: [MatchesService]
})
export class MatchesModule {}
