import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateAssistanceDto {
  @IsInt()
  @IsNotEmpty()
  id_evento: number;

  @IsInt()
  @IsNotEmpty()
  id_usuario: number;
}
