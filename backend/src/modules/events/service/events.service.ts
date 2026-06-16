import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Evento } from '../entities/events.entity';
import { CreateEventDto } from '../dto/create-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Evento)
    private readonly eventoRepository: Repository<Evento>,
  ) {}

  async createEvent(dto: CreateEventDto) {
    const nuevoEvento = this.eventoRepository.create({
      nombre: dto.nombre,
      descripcion: dto.descripcion,
      fecha_hora: dto.fecha_hora,
      direccion: dto.direccion,
      latitud: dto.latitud,
      longitud: dto.longitud,
      tipo_actividad: dto.tipo_actividad,
      capacidad_maxima: dto.capacidad_maxima,
      creador: { id_usuario: dto.id_usuario_creador }, 
    });

    return await this.eventoRepository.save(nuevoEvento);
  }

  async getActiveEvents() {
    return await this.eventoRepository.find({
      where: { estado_evento: 'ACTIVO' },
      order: { fecha_hora: 'ASC' }, 
      relations: ['creador'], 
    });
  }
}
