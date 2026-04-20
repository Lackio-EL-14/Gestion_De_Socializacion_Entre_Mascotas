import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  Logger
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class UploadService {
    private readonly logger = new Logger(UploadService.name);
    constructor(private configService: ConfigService) {}

    async uploadImage(file: Express.Multer.File) {

        const supabase = createClient(
            this.configService.get<string>('SUPABASE_URL')!,
            this.configService.get<string>('SUPABASE_KEY')!
        );

        const bucket = this.configService.get<string>('SUPABASE_BUCKET');

        const fileName = `${uuid()}-${file.originalname}`;

        const { error } = await supabase.storage
            .from(bucket!)
            .upload(fileName, file.buffer, {
            contentType: file.mimetype,
            });

        if (error) {
            throw new InternalServerErrorException('Error al subir imagen');
        }

        const { data } = supabase.storage
            .from(bucket!)
            .getPublicUrl(fileName);

        return {
            url: data.publicUrl
        };
    }
}
