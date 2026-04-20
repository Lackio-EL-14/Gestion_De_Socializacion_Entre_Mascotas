import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './entities/reports.entity';
import { ReportsService } from './service/reports.service';
import { ReportsController } from './controller/reports.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Report])],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
