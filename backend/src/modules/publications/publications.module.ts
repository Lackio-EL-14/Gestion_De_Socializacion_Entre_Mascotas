import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Publication } from './entities/publications.entity';
import { PublicationsService } from './service/publications.service';
import { PublicationsController } from './controller/publications.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Publication])],
  controllers: [PublicationsController],
  providers: [PublicationsService],
})
export class PublicationsModule {}