import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from '../service/upload.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('upload')
export class UploadController {

  constructor(private readonly uploadService: UploadService) {}

  @UseGuards(JwtAuthGuard) // 🔒 opcional pero recomendado
  @Post()
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: 2 * 1024 * 1024 } // 2MB
  }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.uploadImage(file);
  }
}
