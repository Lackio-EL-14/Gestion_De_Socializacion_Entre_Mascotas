import {Controller, Post, Body, Get, Param, Patch, Delete, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { PetsService } from '../service/pets.service';
import { CreatePetDto } from '../dto/create-pet.dto';
import { UpdatePetDto } from '../dto/update-pet.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Post()
  create(@Body() createPetDto: CreatePetDto) {
    return this.petsService.create(createPetDto);
  }
  /* Luis Esto no sirve borralo este era el problema
  @Get('user/:id')
  findByUser(@Param('id', ParseIntPipe) id: number) {
    return this.petsService.findByUser(id);
  }

  @Get()
  findAll() {
    return this.petsService.findAll();
  }
  */

  @UseGuards(JwtAuthGuard) 
  @Get('my-pets')
  findMyPets(@Req() req: any) {
    const userId = req.user.userId;
    return this.petsService.findMyPets(userId);
  }


  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePetDto: UpdatePetDto,
  ) {
    return this.petsService.update(id, updatePetDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.petsService.remove(id);
  }

  @Get('random/:userId')
  findRandom(@Param('userId', ParseIntPipe) userId: number) {
    return this.petsService.findRandomExcludingUser(userId);
  }

  @Get('feed/:id')
  async getFeed(@Param('id') idMascota: number) {
    return this.petsService.getFeed(idMascota);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:id')
  findByUser(@Param('id', ParseIntPipe) id: number) {
    console.log(`[AUDIT-PETS] Usuario consultando mascotas del usuario ${id}`);
    return this.petsService.findByUser(id);
  }
}
