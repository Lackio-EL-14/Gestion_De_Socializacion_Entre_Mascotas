import { IsNotEmpty, IsString, IsInt, Min, Max } from 'class-validator';

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
  @IsInt({ message: 'La edad debe ser un numero entero' })
  @Min(1, { message: 'La edad minima permitida es 1' })
  @Max(30, { message: 'La edad maxima permitida es 30' })
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
