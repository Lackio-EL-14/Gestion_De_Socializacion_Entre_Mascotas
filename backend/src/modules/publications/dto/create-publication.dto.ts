import { IsString, IsOptional, IsUrl } from 'class-validator';

export class CreatePublicationDto {
  @IsString()
  contenido_texto: string;

  @IsOptional()
  @IsUrl()
  imagen_url?: string;
}