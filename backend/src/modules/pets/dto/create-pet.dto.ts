import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class CreatePetDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsString()
  raza: string;

  @IsNotEmpty()
  @IsString()
  tamano: string;

  @IsNotEmpty()
  @IsInt()
  edad: number;

  @IsNotEmpty()
  @IsString()
  genero: string;

  @IsNotEmpty()
  @IsString()
  estado_salud: string;

  @IsString()
  vacuna_imagen_url: string;

  @IsNotEmpty()
  @IsInt()
  id_usuario: number;
}
