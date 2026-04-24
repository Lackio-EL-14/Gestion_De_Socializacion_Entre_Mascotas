import { Controller, Post, Body, UnauthorizedException, Get, Req, UseGuards, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { UsuariosService } from '../service/usuarios.service';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { LoginUsuarioDto } from '../dto/login-usuario.dto';
import { SolicitarRecuperacionDto } from '../dto/solicitar-recuperacion.dto';
import { RestablecerPasswordDto } from '../dto/restablecer-password.dto';
import { UpdateMyProfileDto } from '../dto/update-my-profile.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post('registro')
  async registrarUsuario(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.create(createUsuarioDto);
  }

  @Post('login')
  async loginUsuario(@Body() loginUsuarioDto: LoginUsuarioDto) {
    return this.usuariosService.login(loginUsuarioDto);
  }

 @Post('admin/login')
async loginAdmin(@Body() loginUsuarioDto: LoginUsuarioDto) {
  const dataLogin = await this.usuariosService.login(loginUsuarioDto);

  const idRol = dataLogin.rol?.id_rol;
      
  if (idRol !== 2) { 
    throw new UnauthorizedException('Acceso denegado: Esta área es exclusiva para administradores');
  }

  return dataLogin;
}

  @Post('recuperar-password')
  async solicitarRecuperacion(@Body() solicitarRecuperacionDto: SolicitarRecuperacionDto) {
    return this.usuariosService.solicitarRecuperacion(solicitarRecuperacionDto);
  }

  @Post('restablecer-password')
  async restablecerPassword(@Body() restablecerPasswordDto: RestablecerPasswordDto) {
    return this.usuariosService.restablecerPassword(restablecerPasswordDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMyProfile(@Req() req: any) {
    const userId = req.user.userId;
    return this.usuariosService.findMyProfile(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateMyProfile(@Req() req: any, @Body() updateMyProfileDto: UpdateMyProfileDto) {
    const userId = req.user.userId;
    return this.usuariosService.updateMyProfile(userId, updateMyProfileDto);
  }

  @Get()
  async findAll() {
    return this.usuariosService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findPublicProfile(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.findPublicProfile(id);
  }
}
