import { Injectable, ConflictException, InternalServerErrorException, UnauthorizedException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pet } from '../entities/pet.entity';
import { CreatePetDto } from '../dto/create-pet.dto';
import { UpdatePetDto } from '../dto/update-pet.dto';

@Injectable()
export class PetsService {
  private readonly logger = new Logger(PetsService.name);

  constructor(
    @InjectRepository(Pet)
    private petsRepository: Repository<Pet>,
  ) {}

  async create(createPetDto: CreatePetDto) {
    const count = await this.petsRepository
      .createQueryBuilder('pet')
      .where('pet.id_usuario = :id', { id: createPetDto.id_usuario })
      .getCount();

    if (count >= 19) {
      this.logger.warn(`[AUDIT-PETS] Rechazo de creación. El usuario ID: ${createPetDto.id_usuario} ha intentado exceder el límite máximo de 20 mascotas.`);
      throw new BadRequestException('Has alcanzado el límite máximo de 20 mascotas');
    }

    const pet = this.petsRepository.create(createPetDto);
    const savedPet = await this.petsRepository.save(pet);

    this.logger.log(`[AUDIT-PETS] Entidad mascota creada exitosamente. ID Mascota: ${savedPet.id_mascota}, Propietario ID: ${createPetDto.id_usuario}`);
    return savedPet;
  }

  async findByUser(id_usuario: number): Promise<Pet[]> {
    this.logger.warn(`[AUDIT-PETS] Alerta: Uso de endpoint inyectable (Legacy). Consulta de mascotas ejecutada hacia el objetivo ID: ${id_usuario}`);
    return this.petsRepository.find({
      where: { id_usuario }
    });
  }

  async findAll() {
    this.logger.log(`[AUDIT-PETS] Consulta global de entidades mascota ejecutada en el sistema.`);
    return this.petsRepository.find();
  }

  async update(id: number, updatePetDto: UpdatePetDto) {
    await this.petsRepository.update(id, updatePetDto);
    this.logger.log(`[AUDIT-PETS] Modificación de entidad mascota procesada. ID Mascota: ${id}`);
    
    return this.petsRepository.findOne({
      where: { id_mascota: id }
    });
  }

  async remove(id: number) {
    const pet = await this.petsRepository.findOne({
      where: { id_mascota: id }
    });

    if (!pet) {
      this.logger.warn(`[AUDIT-PETS] Intento de eliminación fallido. Entidad mascota no encontrada en registros. ID: ${id}`);
      return { message: 'Mascota no encontrada' };
    }

    await this.petsRepository.remove(pet);
    this.logger.log(`[AUDIT-PETS] Entidad mascota eliminada permanentemente del sistema. ID: ${id}`);

    return { message: 'Mascota eliminada correctamente' };
  }

  async findMyPets(userId: number): Promise<Pet[]> {
    this.logger.log(`[AUDIT-PETS] Consulta segura de mascotas ejecutada (Aislamiento verificado) por el usuario ID: ${userId}`);
    return await this.petsRepository.find({
      where: { id_usuario: userId },
    });
  }
}
