import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pet } from './entities/pet.entity';
import { PetsService } from './service/pets.service';
import { PetsController } from './controller/pets.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Pet]), AuthModule],
  controllers: [PetsController],
  providers: [PetsService],
})
export class PetsModule {}
