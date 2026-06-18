import { Controller, Post, Body } from '@nestjs/common';
import { MatchesService } from '../service/matches.service';
import { CreateInteractionDto } from '../dto/create-interaction.dto';
import { CompatibilidadDto } from '../dto/compatibilidad.dto';

@Controller('interactions')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Post()
  async createInteraction(@Body() createInteractionDto: CreateInteractionDto) {
    return this.matchesService.processInteraction(createInteractionDto);
  }
  
  @Post('compatibilidad')
  async calcularCompatibilidad(
    @Body() dto: CompatibilidadDto
  ) {
    return this.matchesService.calcularCompatibilidad(
      dto.mascota1,
      dto.mascota2,
    );
  }
}
