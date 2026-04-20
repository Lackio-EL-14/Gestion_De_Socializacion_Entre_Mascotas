import { IsEnum } from 'class-validator';

export enum EstadoPublicacion {
  APROBADA = 'aprobada',
  RECHAZADA = 'rechazada',
}

export class ModeratePublicationDto {
  @IsEnum(EstadoPublicacion, {
    message: 'estado debe ser: aprobada o rechazada'
  })
  estado: EstadoPublicacion;
}
