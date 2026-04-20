import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Publication } from '../entities/publications.entity';
import { ModeratePublicationDto } from '../dto/publication.dto';

@Injectable()
export class PublicationsService {
  private readonly logger = new Logger(PublicationsService.name);

  constructor(
    @InjectRepository(Publication)
    private publicationRepository: Repository<Publication>,
  ) {}

  async moderatePublication(
    id: number,
    dto: ModeratePublicationDto,
    adminId: number
  ) {
    const publication = await this.publicationRepository.findOne({
      where: { id_publicacion: id },
    });

    if (!publication) {
      this.logger.warn(`[AUDIT-MODERATION] Publicación no encontrada. ID: ${id}`);
      throw new NotFoundException('Publicación no encontrada');
    }

    if (publication.estado !== 'pendiente') {
      this.logger.warn(`[AUDIT-MODERATION] Intento de moderación inválido. ID: ${id}`);
      throw new BadRequestException('La publicación ya fue moderada');
    }

    publication.estado = dto.estado;

    const savedPublication = await this.publicationRepository.save(publication);

    this.logger.log(
      `[AUDIT-MODERATION] Publicación ID: ${id} → ${dto.estado} por admin ${adminId}`
    );

    return {
      message: `Publicación ${dto.estado} correctamente`,
      publication: savedPublication,
    };
  }

  async findAll() {
    this.logger.log('[AUDIT-PUBLICATIONS] Consulta global de publicaciones ejecutada');

    return await this.publicationRepository.find({
        order: {
        fecha_publicacion: 'DESC', // más recientes primero
        },
    });
  }
}
