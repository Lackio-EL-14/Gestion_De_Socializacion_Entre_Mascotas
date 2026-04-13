import { IsInt, IsString, IsIn } from 'class-validator';

export class CreateInteractionDto {
  @IsInt()
  id_mascota_origen: number;

  @IsInt()
  id_mascota_destino: number;

  @IsString()
  @IsIn(['LIKE', 'REJECT'])
  tipo_accion: string;
}
