import { Controller, Post, Body } from '@nestjs/common';
import { UsuariosService } from '../service/usuarios.service';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { LoginUsuarioDto } from '../dto/login-usuario.dto';
import { SolicitarRecuperacionDto } from '../dto/solicitar-recuperacion.dto';
import { RestablecerPasswordDto } from '../dto/restablecer-password.dto';

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
   
  @Post('recuperar-password')
  async solicitarRecuperacion(@Body() solicitarRecuperacionDto: SolicitarRecuperacionDto) {
    return this.usuariosService.solicitarRecuperacion(solicitarRecuperacionDto);
  }

  @Post('restablecer-password')
  async restablecerPassword(@Body() restablecerPasswordDto: RestablecerPasswordDto) {
    return this.usuariosService.restablecerPassword(restablecerPasswordDto);
  }
}

