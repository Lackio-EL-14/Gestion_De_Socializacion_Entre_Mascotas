import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

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
  @IsNumber()
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
  @IsString()
  id_usuario: number;
}