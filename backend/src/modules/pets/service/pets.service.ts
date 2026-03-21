import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Pet } from '../entities/pet.entity';
import { CreatePetDto } from '../dto/create-pet.dto';

import { UpdatePetDto } from '../dto/update-pet.dto';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class PetsService {

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
      throw new BadRequestException(
        'Has alcanzado el límite máximo de 20 mascotas'
      );
    }

    const pet = this.petsRepository.create(createPetDto);

    return await this.petsRepository.save(pet);
  }

  async findByUser(id_usuario: number): Promise<Pet[]> {

    return this.petsRepository.find({
      where: { id_usuario }
    });
  }

  async findAll() {
    return this.petsRepository.find();
  }

  async update(id: number, updatePetDto: UpdatePetDto) {
    await this.petsRepository.update(id, updatePetDto);
    return this.petsRepository.findOne({
      where: { id_mascota: id }
    });
  }

  async remove(id: number) {
    const pet = await this.petsRepository.findOne({
      where: { id_mascota: id }
    });

    if (!pet) {
      return { message: 'Mascota no encontrada' };
    }

    await this.petsRepository.remove(pet);

    return { message: 'Mascota eliminada correctamente' };
  }
  async findMyPets(userId: number): Promise<Pet[]> {
    return await this.petsRepository.find({
      where: { id_usuario: userId },
    });
  }
}
