import { IsString, IsInt, IsOptional } from 'class-validator';

export class UpdatePetDto {

  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  raza?: string;

  @IsOptional()
  @IsString()
  tamano?: string;

  @IsOptional()
  @IsInt()
  edad?: number;

  @IsOptional()
  @IsString()
  genero?: string;

  @IsOptional()
  @IsString()
  estado_salud?: string;

  @IsOptional()
  @IsString()
  vacuna_imagen_url?: string;

  @IsOptional()
  @IsInt()
  id_usuario?: number;

}