import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Match } from '../entities/match.entity';
import { Interaccion } from '../../users/entities/interaccion.entity';
import { CreateInteractionDto } from '../dto/create-interaction.dto';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
    @InjectRepository(Interaccion)
    private interaccionRepository: Repository<Interaccion>,
    private dataSource: DataSource,
  ) {}

  async processInteraction(dto: CreateInteractionDto) {
    const { id_mascota_origen, id_mascota_destino, tipo_accion } = dto;

    const existing = await this.interaccionRepository.findOne({
      where: {
        mascota_origen: { id_mascota: id_mascota_origen },
        mascota_destino: { id_mascota: id_mascota_destino },
      },
    });

    if (existing) {
      throw new ConflictException('La interacción ya existe');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const nuevaInteraccion = queryRunner.manager.create(Interaccion, {
        mascota_origen: { id_mascota: id_mascota_origen },
        mascota_destino: { id_mascota: id_mascota_destino },
        tipo_interaccion: tipo_accion, 
      });
      await queryRunner.manager.save(nuevaInteraccion);

      let isMatch = false;

      if (tipo_accion === 'LIKE') {
        const reverseLike = await queryRunner.manager.findOne(Interaccion, {
          where: {
            mascota_origen: { id_mascota: id_mascota_destino },
            mascota_destino: { id_mascota: id_mascota_origen },
            tipo_interaccion: 'LIKE',
          },
        });

        if (reverseLike) {
          const nuevoMatch = queryRunner.manager.create(Match, {
            mascota_1: { id_mascota: id_mascota_origen },
            mascota_2: { id_mascota: id_mascota_destino },
          });
          await queryRunner.manager.save(nuevoMatch);
          isMatch = true;
        }
      }

      await queryRunner.commitTransaction();
      return { match: isMatch };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error procesando la interaccion');
    } finally {
      await queryRunner.release();
    }
  }
}
