import {
  Controller,
  Patch,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
  Req,
  Post,
} from '@nestjs/common';
import { PublicationsService } from '../service/publications.service';
import { ModeratePublicationDto } from '../dto/publication.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { Get } from '@nestjs/common';
import { CreatePublicationDto } from '../dto/create-publication.dto';

@Controller('publications')
export class PublicationsController {
  constructor(private readonly publicationsService: PublicationsService) {}

  @UseGuards(JwtAuthGuard)
  @Patch(':id/moderate')
  moderatePublication(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ModeratePublicationDto,
    @Req() req: any
  ) {
    const adminId = req.user.userId;

    return this.publicationsService.moderatePublication(
      id,
      dto,
      adminId
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.publicationsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('feed')
  getFeed() {
    return this.publicationsService.findFeed();
  }

  @UseGuards(JwtAuthGuard)
  @Post('/posts')
  createPost(
    @Body() dto: CreatePublicationDto,
    @Req() req: any
  ) {
    return this.publicationsService.createPublication(dto, req.user);
  }
}
