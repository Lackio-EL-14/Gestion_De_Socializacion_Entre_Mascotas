import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Evento } from './entities/events.entity';
import { AsistenciaEvento } from './entities/asistencia.entity';
import { EventsController } from './controller/events.controller';
import { EventsService } from './service/events.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Evento, AsistenciaEvento])
  ],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService] 
})
export class EventsModule {}
