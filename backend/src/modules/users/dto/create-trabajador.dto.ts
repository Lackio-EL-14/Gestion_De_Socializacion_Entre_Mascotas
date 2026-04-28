import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class CreateTrabajadorDto {
  // --- Datos del Usuario ---
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString()
  nombre: string;

  @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
  @IsEmail({}, { message: 'El formato del correo no es válido' })
  email: string;

  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  contrasena_hash: string;

  @IsNotEmpty({ message: 'El teléfono es obligatorio' })
  @IsString()
  @MaxLength(15, { message: 'El teléfono es demasiado largo' })
  telefono: string;

  // --- Datos del Perfil Profesional ---
  @IsNotEmpty({ message: 'El nombre del negocio es obligatorio' })
  @IsString()
  nombre_servicio: string;

  @IsNotEmpty({ message: 'La descripción del negocio es obligatoria' })
  @IsString()
  descripcion: string;
}