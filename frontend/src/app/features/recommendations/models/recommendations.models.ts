export type RecommendationType =
  | 'FALLBACK_ALEATORIO'
  | 'PERSONALIZADA_INTELIGENTE'
  | string;

export interface RecommendationEvent {
  id_evento: number;
  nombre: string;
  descripcion: string;
  fecha_hora: string;
  direccion: string;
  tipo_actividad: string;
  estado_evento: 'ACTIVO' | 'FINALIZADO' | 'CANCELADO' | string;
}

export interface RecommendationPet {
  id_mascota: number;
  nombre: string;
  raza: string;
  tamano: string;
  edad: number;
  genero: string;
  estado_salud: string;
  perfil_imagen_url?: string | null;
}

export interface RecommendationStats {
  actividades_favoritas: string[];
  total_asistencias_previas: number;
  total_matches_previos: number;
}

export interface RecommendationsResponse {
  tipo_recomendacion: RecommendationType;
  eventos: RecommendationEvent[];
  mascotas: RecommendationPet[];
  mensaje?: string;
  estadisticas_base?: RecommendationStats;
}
