import { Controller, Post, Body } from '@nestjs/common';
import { EvaluationsService } from '../service/evaluations.service';
import { CreateEvaluationDto } from '../dto/create-evaluation.dto';

@Controller('evaluations')
export class EvaluationsController {
  constructor(private readonly evaluationsService: EvaluationsService) {}

  @Post()
  async createEvaluation(@Body() dto: CreateEvaluationDto) {
    return this.evaluationsService.createEvaluation(dto);
  }
}
