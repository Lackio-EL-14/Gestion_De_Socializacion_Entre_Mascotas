import { Injectable, ForbiddenException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Evaluation } from '../entities/evaluations.entity';
import { AsistenciaEvento } from '../../events/entities/asistencia.entity';
import { CreateEvaluationDto } from '../dto/create-evaluation.dto';

@Injectable()
export class EvaluationsService {
  constructor(
    @InjectRepository(Evaluation)
    private readonly evaluationRepository: Repository<Evaluation>,
    @InjectRepository(AsistenciaEvento)
    private readonly asistenciaRepository: Repository<AsistenciaEvento>,
  ) {}

  async createEvaluation(dto: CreateEvaluationDto) {
    const asistencia = await this.asistenciaRepository.findOne({
      where: { 
        evento: { id_evento: dto.id_evento }, 
        usuario: { id_usuario: dto.id_usuario_evaluador },
        estado_asistencia: 'CONFIRMADO' 
      }
    });

    if (!asistencia) {
      throw new ForbiddenException('Solo los asistentes confirmados pueden calificar este evento.');
    }

    const evaluacionPrevia = await this.evaluationRepository.findOne({
      where: {
        evento: { id_evento: dto.id_evento },
        evaluador: { id_usuario: dto.id_usuario_evaluador }
      }
    });

    if (evaluacionPrevia) {
      throw new ConflictException('Ya has enviado una evaluación para este evento.');
    }

    const nuevaEvaluacion = this.evaluationRepository.create({
      evento: { id_evento: dto.id_evento },
      evaluador: { id_usuario: dto.id_usuario_evaluador },
      puntuacion_organizacion: dto.puntuacion_organizacion,
      puntuacion_mascotas: dto.puntuacion_mascotas,
      comentario: dto.comentario
    });

    return await this.evaluationRepository.save(nuevaEvaluacion);
  }
}
