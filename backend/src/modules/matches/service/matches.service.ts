import { Injectable, ConflictException, InternalServerErrorException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Match } from '../entities/match.entity';
import { Interaccion } from '../../users/entities/interaccion.entity';
import { CreateInteractionDto } from '../dto/create-interaction.dto';
import { MessagesGateway } from '../../messages/gateway/messages.gateway';
import { Pet } from '../../pets/entities/pet.entity';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
    @InjectRepository(Interaccion)
    private interaccionRepository: Repository<Interaccion>,
    private dataSource: DataSource,
    private readonly messagesGateway: MessagesGateway,
    @InjectRepository(Pet)
    private petRepository: Repository<Pet>,
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

    let matchGuardado: Match | null = null;

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
          matchGuardado = await queryRunner.manager.save(nuevoMatch);
          isMatch = true;
        }
      }

      await queryRunner.commitTransaction();
      if (matchGuardado) {
        this.messagesGateway.notifyMatchCreated(matchGuardado);
      }
      return { match: isMatch };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error procesando la interaccion');
    } finally {
      await queryRunner.release();
    }
  }

  async calcularCompatibilidad(
    mascota1Id: number,
    mascota2Id: number,
  ) {

    const mascota1 = await this.petRepository.findOne({
      where: { id_mascota: mascota1Id },
    });

    const mascota2 = await this.petRepository.findOne({
      where: { id_mascota: mascota2Id },
    });

    if (!mascota1) {
      throw new Error('Mascota 1 no encontrada');
    }

    if (!mascota2) {
      throw new Error('Mascota 2 no encontrada');
    }

    const camposObligatorios = [
      'raza',
      'tamano',
      'edad',
      'genero',
      'estado_salud',
    ];

    for (const campo of camposObligatorios) {

      if (
        mascota1[campo] === null ||
        mascota1[campo] === undefined
      ) {
        throw new Error(`Mascota 1 sin dato obligatorio: ${campo}`);
      }

      if (
        mascota2[campo] === null ||
        mascota2[campo] === undefined
      ) {
        throw new Error(`Mascota 2 sin dato obligatorio: ${campo}`);
      }
    }

    let puntaje = 0;

    const coincidencias = {
      raza: false,
      tamano: false,
      edad: false,
      genero: false,
      estado_salud: false
    };

    // RAZA (15)

    if (
      mascota1.raza.toLowerCase() ===
      mascota2.raza.toLowerCase()
    ) {
      puntaje += 15;
      coincidencias.raza = true;
    }

    // TAMAÑO (30)

    if (
      mascota1.tamano.toLowerCase() ===
      mascota2.tamano.toLowerCase()
    ) {

      puntaje += 30;
      coincidencias.tamano = true;

    } else {

      const cercanos = [
        ['pequeno', 'mediano'],
        ['mediano', 'grande']
      ];

      const compatible = cercanos.some(
        ([a, b]) =>
          (
            mascota1.tamano.toLowerCase() === a &&
            mascota2.tamano.toLowerCase() === b
          ) ||
          (
            mascota1.tamano.toLowerCase() === b &&
            mascota2.tamano.toLowerCase() === a
          )
      );

      if (compatible) {
        puntaje += 20;
      }
    }

    // EDAD (25)

    const diferenciaEdad =
      Math.abs(mascota1.edad - mascota2.edad);

    if (diferenciaEdad <= 2) {

      puntaje += 25;
      coincidencias.edad = true;

    } else if (diferenciaEdad <= 5) {

      puntaje += 15;

    } else {

      puntaje += 5;
    }

    // GENERO (10)

    puntaje += 10;

    if (
      mascota1.genero.toLowerCase() ===
      mascota2.genero.toLowerCase()
    ) {
      coincidencias.genero = true;
    }

    // SALUD (20)

    if (
      mascota1.estado_salud.toLowerCase() ===
      mascota2.estado_salud.toLowerCase()
    ) {

      puntaje += 20;
      coincidencias.estado_salud = true;

    } else {

      puntaje += 10;
    }

    return {
      compatibilidad: puntaje,
      coincidencias,
    };
  }
}
