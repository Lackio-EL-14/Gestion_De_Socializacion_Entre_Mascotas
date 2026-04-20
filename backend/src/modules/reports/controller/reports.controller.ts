import { Controller, Get, Post, Body, Patch, Param, ParseIntPipe } from '@nestjs/common';
import { ReportsService } from '../service/reports.service';
import { CreateReportDto } from '../dto/create-report.dto';
import { UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { UpdateReportDto } from '../dto/update-report.dto';

@Controller('reports')
export class ReportsController {

  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  findAll() {
    return this.reportsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createReportDto: CreateReportDto, @Req() req: any) {
    const userId = req.user.userId; // viene del JWT
    return this.reportsService.create(createReportDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReportDto: UpdateReportDto,
    @Req() req: any
  ) {
    const adminId = req.user.userId;
    return this.reportsService.update(id, updateReportDto, adminId);
  }
}
