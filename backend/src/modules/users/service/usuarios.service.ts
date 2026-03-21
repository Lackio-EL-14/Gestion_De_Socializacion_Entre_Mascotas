import { Injectable, ConflictException, InternalServerErrorException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { LoginUsuarioDto } from '../dto/login-usuario.dto';
import { SolicitarRecuperacionDto } from '../dto/solicitar-recuperacion.dto';
import { RestablecerPasswordDto } from '../dto/restablecer-password.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    private jwtService: JwtService,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Partial<Usuario>> {
    const { nombre, email, contrasena_hash, telefono } = createUsuarioDto;

    const usuarioExistente = await this.usuarioRepository.findOne({ where: { email } });
    if (usuarioExistente) {
      throw new ConflictException('El correo electrónico ya está en uso');
    }

    try {
      const salt = await bcrypt.genSalt(10);
      const contrasenaHash = await bcrypt.hash(contrasena_hash, salt);

      const nuevoUsuario = this.usuarioRepository.create({
        nombre,
        email,
        contrasena_hash: contrasenaHash,
        telefono,
        rol: { id_rol: 1 } 
      });

      const usuarioGuardado = await this.usuarioRepository.save(nuevoUsuario);

      const { contrasena_hash: _, ...usuarioSinContrasena } = usuarioGuardado;
      
      return usuarioSinContrasena;

    } catch (error) {
      console.error(' ERROR REAL DE LA BASE DE DATOS:', error);
      throw new InternalServerErrorException('Ocurrió un error al guardar el usuario');
    }
  }

  async login(loginUsuarioDto: LoginUsuarioDto) {
    const { email, contrasena } = loginUsuarioDto;

    const usuario = await this.usuarioRepository.findOne({ where: { email } });

    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (!usuario.esta_activo) {
      throw new UnauthorizedException('Cuenta bloqueada. Contacte al administrador.');
    }

    const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena_hash);

    if (!contrasenaValida) {
      usuario.cantidad_strikes += 1;
      
      if (usuario.cantidad_strikes >= 5) {  //5 chances para iniciar sesion
        usuario.esta_activo = false;
      }
      
      await this.usuarioRepository.save(usuario); 
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (usuario.cantidad_strikes > 0) {
      usuario.cantidad_strikes = 0;
      await this.usuarioRepository.save(usuario);
    }

    const payload = { email: usuario.email, sub: usuario.id_usuario };
    return {
      access_token: this.jwtService.sign(payload),
      id_usuario: usuario.id_usuario,
      nombre: usuario.nombre
    };
  }

  async solicitarRecuperacion(solicitarRecuperacionDto: SolicitarRecuperacionDto) {
    const { email } = solicitarRecuperacionDto;
    const usuario = await this.usuarioRepository.findOne({ where: { email } });

    if (!usuario) {
      return { message: 'Si el correo existe, se ha enviado un enlace de recuperación.' };
    }

    const payload = { sub: usuario.id_usuario, email: usuario.email };
    const tokenRecuperacion = this.jwtService.sign(payload, { 
      secret: 'secreto-recuperacion-dogchat', 
      expiresIn: '15m' 
    });

    const linkSimulado = `http://localhost:3000/restablecer?token=${tokenRecuperacion}`;
    console.log('=============================================');
    console.log(`📧 ENVIANDO CORREO A: ${email}`);
    console.log(`🔗 LINK DE RECUPERACIÓN: ${linkSimulado}`);
    console.log('=============================================');

    return { message: 'Si el correo existe, se ha enviado un enlace de recuperación.',
      dev_token: tokenRecuperacion
    };
  }

  async restablecerPassword(restablecerPasswordDto: RestablecerPasswordDto) {
    const { token, nueva_contrasena } = restablecerPasswordDto;

    try {
      const payload = this.jwtService.verify(token, { secret: 'secreto-recuperacion-dogchat' });
      
      const usuario = await this.usuarioRepository.findOne({ where: { id_usuario: payload.sub } });
      if (!usuario) {
        throw new BadRequestException('Usuario no encontrado');
      }

      const salt = await bcrypt.genSalt(10);
      usuario.contrasena_hash = await bcrypt.hash(nueva_contrasena, salt);

      await this.usuarioRepository.save(usuario);

      return { message: 'Contraseña actualizada correctamente. Ya puedes iniciar sesión.' };
    } catch (error) {
      throw new BadRequestException('El token es inválido o ha expirado');
    }
  }
}
