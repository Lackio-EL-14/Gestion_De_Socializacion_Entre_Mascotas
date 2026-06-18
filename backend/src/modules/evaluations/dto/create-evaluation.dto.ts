import { IsInt, IsString, IsNotEmpty, Min, Max, IsOptional } from 'class-validator';

export class CreateEvaluationDto {
  @IsInt()
  @IsNotEmpty()
  id_evento: number;

  @IsInt()
  @IsNotEmpty()
  id_usuario_evaluador: number;

  @IsInt()
  @Min(1, { message: 'La puntuación mínima es 1 estrella' })
  @Max(5, { message: 'La puntuación máxima es 5 estrellas' })
  puntuacion_organizacion: number;

  @IsInt()
  @Min(1)
  @Max(5)
  puntuacion_mascotas: number;

  @IsString()
  @IsOptional()
  comentario?: string;
}
