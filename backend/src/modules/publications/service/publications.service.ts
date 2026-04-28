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
import { CreatePublicationDto } from '../dto/create-publication.dto';
import { Usuario } from '../../users/entities/usuario.entity';

@Injectable()
export class PublicationsService {
  private readonly logger = new Logger(PublicationsService.name);

  constructor(
    @InjectRepository(Publication)
    private publicationRepository: Repository<Publication>,

    @InjectRepository(Usuario) // AQUÍ VA
    private usuarioRepository: Repository<Usuario>, // AQUÍ TAMBIÉN
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
  
  async findFeed() {
    this.logger.log('[AUDIT-FEED] Consulta de feed de publicaciones');

    const publications = await this.publicationRepository.find({
      where: {
        estado: 'aprobada',
      },
      relations: ['usuario'],
      order: {
        fecha_publicacion: 'DESC',
      },
    });

    return publications.map((pub) => ({
      id_publicacion: pub.id_publicacion,
      contenido_texto: pub.contenido_texto,
      imagen_url: pub.imagen_url,
      fecha_publicacion: pub.fecha_publicacion,

      autor: {
        id: pub.usuario.id_usuario,
        nombre: pub.usuario.nombre,
        foto: pub.usuario.foto_perfil_url,
      },
    }));
  }

  async createPublication(dto: CreatePublicationDto, user: any) {
    console.log(user);
    // 🔥 VALIDACIÓN SOLO CON JWT
    if (user.rol !== 3) {
      this.logger.warn(
        `[AUDIT-POST] Usuario ${user.userId} intentó crear publicación sin ser trabajador`
      );
      throw new BadRequestException('Solo trabajadores pueden crear publicaciones');
    }

    const nuevaPublicacion = this.publicationRepository.create({
      contenido_texto: dto.contenido_texto,
      imagen_url: dto.imagen_url || undefined,
      estado: 'pendiente',
      id_usuario: user.userId,
    });

    const saved = await this.publicationRepository.save(nuevaPublicacion);

    this.logger.log(
      `[AUDIT-POST] Publicación creada por usuario ${user.userId} en estado pendiente`
    );

    
    return saved;
  }
}
