import { IsEmail, IsOptional, IsString, MaxLength, MinLength, Matches } from 'class-validator';

export class UpdateMyProfileDto {
  @IsOptional()
  @IsString({ message: 'El nombre debe ser texto' })
  @Matches(/^[a-zA-ZáéíóúñüÁÉÍÓÚÑÜ\s]+$/, {
    message: 'El nombre solo puede contener letras y espacios',
  })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'El nombre no puede exceder 50 caracteres' })
  nombre?: string;

  @IsOptional()
  @IsEmail({}, { message: 'El formato del correo no es válido' })
  @MaxLength(100, { message: 'El correo no puede exceder 100 caracteres' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'El teléfono debe ser texto' })
  @Matches(/^[0-9\s\+\-\(\)]+$/, {
    message: 'El teléfono solo puede contener números, espacios y caracteres válidos (+, -, paréntesis)',
  })
  @MinLength(7, { message: 'El teléfono debe tener al menos 7 dígitos' })
  @MaxLength(15, { message: 'El teléfono no puede exceder 15 caracteres' })
  telefono?: string;
}
