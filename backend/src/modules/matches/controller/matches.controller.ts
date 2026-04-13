import { Controller, Post, Body } from '@nestjs/common';
import { MatchesService } from '../service/matches.service';
import { CreateInteractionDto } from '../dto/create-interaction.dto';

@Controller('interactions')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Post()
  async createInteraction(@Body() createInteractionDto: CreateInteractionDto) {
    return this.matchesService.processInteraction(createInteractionDto);
  }
   
   
}
