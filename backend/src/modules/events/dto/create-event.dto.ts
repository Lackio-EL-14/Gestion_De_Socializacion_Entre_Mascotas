import { IsString, IsNotEmpty, IsInt, IsDateString, IsNumber, IsOptional } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsDateString()
  fecha_hora: string; 

  @IsString()
  @IsNotEmpty()
  direccion: string;

  @IsNumber()
  @IsOptional() 
  latitud?: number;

  @IsNumber()
  @IsOptional()
  longitud?: number;

  @IsString()
  @IsNotEmpty()
  tipo_actividad: string;

  @IsInt()
  capacidad_maxima: number;

  @IsInt()
  id_usuario_creador: number; 
}
