import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Evento } from '../../events/entities/events.entity';
import { AsistenciaEvento } from '../../events/entities/asistencia.entity';
import { Pet } from '../../pets/entities/pet.entity';
import { Match } from '../../matches/entities/match.entity';

@Injectable()
export class RecommendationsService {
  constructor(
    @InjectRepository(Evento)
    private readonly eventoRepository: Repository<Evento>,
    @InjectRepository(AsistenciaEvento)
    private readonly asistenciaRepository: Repository<AsistenciaEvento>,
    @InjectRepository(Pet) 
    private readonly petRepository: Repository<Pet>,
    @InjectRepository(Match) 
    private readonly matchRepository: Repository<Match>,
  ) {}

  async generateRecommendations(userId: number) {
    const historialAsistencias = await this.asistenciaRepository.find({
      where: { usuario: { id_usuario: userId }, estado_asistencia: 'CONFIRMADO' },
      relations: ['evento'],
    });

    const historialMatches = await this.matchRepository.find({ 
      where: [
        { mascota_1: { id_usuario: userId } },
        { mascota_2: { id_usuario: userId } }
      ],
      relations: ['mascota_1', 'mascota_2']
    });

    if (historialAsistencias.length === 0 && historialMatches.length === 0) {
      return this.getFallbackRecommendations();
    }

    return this.getPersonalizedRecommendations(historialAsistencias, historialMatches);
  }

  private async getFallbackRecommendations() {
    const eventosDestacados = await this.eventoRepository.find({
      where: { estado_evento: 'ACTIVO' },
      order: { fecha_hora: 'ASC' },
      take: 5,
    });

    const mascotasDestacadas = await this.petRepository.find({ 
      take: 5, 
      order: { fecha_registro: 'DESC' } 
    });

    return {
      tipo_recomendacion: 'FALLBACK_ALEATORIO',
      eventos: eventosDestacados,
      mascotas: mascotasDestacadas,
      mensaje: '¡Bienvenido! Explora estos eventos destacados para empezar a generar tus recomendaciones personalizadas.'
    };
  }

  private async getPersonalizedRecommendations(asistencias: AsistenciaEvento[], matches: Match[]) {
    const tiposDeActividadFavoritos = asistencias.map(a => a.evento.tipo_actividad);
    const tiposUnicos = [...new Set(tiposDeActividadFavoritos)]; 

    let eventosRecomendados: Evento[] = [];
    if (tiposUnicos.length > 0) {
        eventosRecomendados = await this.eventoRepository.find({
          where: { 
            estado_evento: 'ACTIVO',
            tipo_actividad: In(tiposUnicos) 
          },
          order: { fecha_hora: 'ASC' },
          take: 5,
        });
    }

    const mascotasSugeridas = await this.petRepository.find({
        take: 5,
        order: { fecha_registro: 'DESC' }
    }); 

    return {
      tipo_recomendacion: 'PERSONALIZADA_INTELIGENTE',
      eventos: eventosRecomendados,
      mascotas: mascotasSugeridas,
      estadisticas_base: {
        actividades_favoritas: tiposUnicos,
        total_asistencias_previas: asistencias.length,
        total_matches_previos: matches.length
      }
    };
  }
}
