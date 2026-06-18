import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { RecommendationsService } from '../service/recommendations.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard'; 

@Controller('recommendations')
export class RecommendationsController {
  constructor(private readonly recommendationsService: RecommendationsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getIntelligentRecommendations(@Req() req: any) {
    const userId = req.user.userId;
    return this.recommendationsService.generateRecommendations(userId);
  }
}
