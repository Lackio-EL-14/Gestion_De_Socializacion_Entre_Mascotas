import { IsString, IsInt, IsOptional, Min, Max } from 'class-validator';

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
  @IsInt({ message: 'La edad debe ser un numero entero' })
  @Min(1, { message: 'La edad minima permitida es 1' })
  @Max(30, { message: 'La edad maxima permitida es 30' })
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
