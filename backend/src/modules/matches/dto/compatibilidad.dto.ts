import { IsNumber } from 'class-validator';

export class CompatibilidadDto {

  @IsNumber()
  mascota1: number;

  @IsNumber()
  mascota2: number;

}