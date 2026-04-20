import { IsNotEmpty, IsString, IsNumber, IsIn } from 'class-validator';

export class CreateReportDto {

  @IsNotEmpty()
  @IsString()
  motivo: string;

  @IsNotEmpty()
  @IsString()
  comentario: string;

  @IsNotEmpty()
  @IsNumber()
  id_usuario_reportado: number;
}
