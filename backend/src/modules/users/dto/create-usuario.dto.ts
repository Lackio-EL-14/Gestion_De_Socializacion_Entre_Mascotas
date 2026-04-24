import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class CreateUsuarioDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser texto' })
  @Matches(/^[a-zA-ZáéíóúñüÁÉÍÓÚÑÜ\s]+$/, {
    message: 'El nombre solo puede contener letras y espacios'
  })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'El nombre no puede exceder 50 caracteres' })
  nombre: string;

  @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
  @IsEmail({}, { message: 'El formato del correo no es válido' })
  @MaxLength(100, { message: 'El correo no puede exceder 100 caracteres' })
  email: string;

  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @IsString({ message: 'La contraseña debe ser texto' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @MaxLength(100, { message: 'La contraseña no puede exceder 100 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
    message: 'La contraseña debe contener mayúsculas, minúsculas, números y caracteres especiales (@$!%*?&)'
  })
  contrasena_hash: string;

  @IsNotEmpty({ message: 'El teléfono es obligatorio' })
  @IsString({ message: 'El teléfono debe ser texto' })
  @Matches(/^[0-9\s\+\-\(\)]+$/, {
    message: 'El teléfono solo puede contener números, espacios y caracteres válidos (+, -, paréntesis)'
  })
  @MinLength(7, { message: 'El teléfono debe tener al menos 7 dígitos' })
  @MaxLength(15, { message: 'El teléfono no puede exceder 15 caracteres' })
  telefono: string;
}
