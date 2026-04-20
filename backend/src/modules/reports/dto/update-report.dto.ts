import { IsOptional, IsIn } from 'class-validator';

export class UpdateReportDto {

  @IsOptional()
  @IsIn(['pendiente', 'en_proceso', 'resuelto'])
  estado?: string;
}
