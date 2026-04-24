import { IsOptional, IsString, IsEmail, IsUrl } from 'class-validator';

export class UpdateUserDto {
  
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsUrl()
  foto_perfil_url?: string;
}
