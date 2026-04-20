import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from '../entities/reports.entity';
import { CreateReportDto } from '../dto/create-report.dto';
import { UpdateReportDto } from '../dto/update-report.dto';

@Injectable()
export class ReportsService {

  private readonly logger = new Logger(ReportsService.name);

  constructor(
    @InjectRepository(Report)
    private reportesRepository: Repository<Report>,
  ) {}

  async findAll(): Promise<Report[]> {
    
    this.logger.log(`[AUDIT-REPORTS] Consulta global de reportes ejecutada en el sistema.`);

    const reportes = await this.reportesRepository.find();

    this.logger.log(`[AUDIT-REPORTS] Total de reportes obtenidos: ${reportes.length}`);

    return reportes;
  }


  async create(createReportDto: CreateReportDto, userId: number) {

    this.logger.log(`[AUDIT-REPORTS] Usuario autenticado ID: ${userId} intenta crear reporte`);

    if (userId === createReportDto.id_usuario_reportado) {
      this.logger.warn(`[AUDIT-REPORTS] Intento inválido: usuario intentando reportarse a sí mismo. ID: ${userId}`);
      
      throw new BadRequestException('No puedes reportarte a ti mismo');
    }

    const report = this.reportesRepository.create({
      ...createReportDto,
      id_usuario_reportante: userId, // 🔥 ahora viene del JWT
      fecha_reporte: new Date(),
      estado: 'pendiente', // 🔥 forzado
    });

    const savedReport = await this.reportesRepository.save(report);

    this.logger.log(
      `[AUDIT-REPORTS] Reporte creado. ID: ${savedReport.id}, Reportante: ${userId}`
    );

    return savedReport;
  }

  async update(id: number, updateReportDto: UpdateReportDto, adminId: number) {

    this.logger.log(`[AUDIT-REPORTS] Admin ID: ${adminId} intenta actualizar reporte ID: ${id}`);

    const report = await this.reportesRepository.findOne({
      where: { id: id }
    });

    if (!report) {
      this.logger.warn(`[AUDIT-REPORTS] Reporte no encontrado. ID: ${id}`);
      throw new NotFoundException('Reporte no encontrado');
    }

    if (updateReportDto.estado === 'resuelto') {
      report.fecha_resolucion = new Date();
      report.id_admin_resolutor = adminId; // ✅ corregido
    }

    if (updateReportDto.estado) {
      report.estado = updateReportDto.estado;
    }

    const updatedReport = await this.reportesRepository.save(report);

    this.logger.log(`[AUDIT-REPORTS] Reporte actualizado. ID: ${id}, Estado: ${updatedReport.estado}`);

    return updatedReport;
  }
}
