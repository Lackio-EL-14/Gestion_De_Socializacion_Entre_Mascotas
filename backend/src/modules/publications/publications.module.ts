import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Publication } from './entities/publications.entity';
import { PublicationsService } from './service/publications.service';
import { PublicationsController } from './controller/publications.controller';
import { Usuario } from '../users/entities/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Publication, Usuario])],
  controllers: [PublicationsController],
  providers: [PublicationsService],
})
export class PublicationsModule {}