import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Evento } from '../entities/events.entity';
import { AsistenciaEvento } from '../entities/asistencia.entity';
import { CreateEventDto } from '../dto/create-event.dto';
import { CreateAssistanceDto } from '../dto/events-assistance.dto';
import { MoreThanOrEqual } from 'typeorm';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Evento)
    private readonly eventoRepository: Repository<Evento>,
    @InjectRepository(AsistenciaEvento)
    private readonly asistenciaRepository: Repository<AsistenciaEvento>,
    private readonly dataSource: DataSource
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

  async confirmarAsistencia(dto: CreateAssistanceDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const evento = await queryRunner.manager.findOne(Evento, {
        where: { id_evento: dto.id_evento },
        lock: { mode: 'pessimistic_write' },
      });

      if (!evento) {
        throw new NotFoundException('El evento no existe.');
      }

      if (evento.estado_evento !== 'ACTIVO') {
        throw new BadRequestException('El evento ya no está activo.');
      }

      const asistenciaPrevia = await queryRunner.manager.findOne(AsistenciaEvento, {
        where: { 
          evento: { id_evento: dto.id_evento }, 
          usuario: { id_usuario: dto.id_usuario } 
        },
      });

      if (asistenciaPrevia) {
        throw new ConflictException('Ya estás registrado en este evento.');
      }

      if (evento.asistentes_actuales >= evento.capacidad_maxima) {
        throw new BadRequestException('El evento ha alcanzado su capacidad máxima (Aforo lleno).');
      }

      const nuevaAsistencia = queryRunner.manager.create(AsistenciaEvento, {
        evento: { id_evento: dto.id_evento },
        usuario: { id_usuario: dto.id_usuario },
        estado_asistencia: 'CONFIRMADO' 
      });
      await queryRunner.manager.save(nuevaAsistencia);

      evento.asistentes_actuales += 1;
      await queryRunner.manager.save(evento);

      await queryRunner.commitTransaction();

      return {
        message: 'Asistencia confirmada con éxito',
        evento: evento.nombre,
        cupos_restantes: evento.capacidad_maxima - evento.asistentes_actuales
      };

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async cancelarAsistencia(idEvento: number, idUsuario: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const asistencia = await queryRunner.manager.findOne(AsistenciaEvento, {
        where: { evento: { id_evento: idEvento }, usuario: { id_usuario: idUsuario } },
        relations: ['evento']
      });

      if (!asistencia || asistencia.estado_asistencia === 'CANCELADO') {
        throw new BadRequestException('No estás registrado en este evento o ya cancelaste tu participación.');
      }

      const evento = await queryRunner.manager.findOne(Evento, {
        where: { id_evento: idEvento },
        lock: { mode: 'pessimistic_write' }
      });

      if (!evento) {
        throw new NotFoundException('El evento ya no existe.');
      }

      asistencia.estado_asistencia = 'CANCELADO';
      await queryRunner.manager.save(asistencia);

      evento.asistentes_actuales -= 1;
      await queryRunner.manager.save(evento);

      await queryRunner.commitTransaction();
      return { 
        message: 'Participación cancelada exitosamente. Se ha liberado tu cupo.',
        cupos_restantes: evento.capacidad_maxima - evento.asistentes_actuales
      };

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async obtenerParticipantes(idEvento: number) {
    const evento = await this.eventoRepository.findOne({ where: { id_evento: idEvento } });
    if (!evento) throw new NotFoundException('El evento no existe.');

    const asistentes = await this.asistenciaRepository.find({
      where: { evento: { id_evento: idEvento }, estado_asistencia: 'CONFIRMADO' },
      relations: ['usuario'],
    });

    return asistentes.map(a => ({
      id_asistencia: a.id_asistencia,
      fecha_registro: a.fecha_registro,
      usuario: {
        id_usuario: a.usuario.id_usuario,
        nombres: a.usuario.nombre,
      }
    }));
  }

  async getEventsForMap() {

    const eventos = await this.eventoRepository.find({
      where: {
        estado_evento: 'ACTIVO',
        fecha_hora: MoreThanOrEqual(new Date())
      }
    });

    if (!eventos.length) {
      return [];
    }

    return eventos.map(evento => ({
      id_evento: evento.id_evento,
      nombre: evento.nombre,
      tipo_actividad: evento.tipo_actividad,
      latitud: Number(evento.latitud),
      longitud: Number(evento.longitud)
    }));
  }

}
