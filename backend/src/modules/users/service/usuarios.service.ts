import { Injectable, ConflictException, InternalServerErrorException, UnauthorizedException, BadRequestException, Logger, NotFoundException } from '@nestjs/common';
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
  private readonly logger = new Logger(UsuariosService.name);

  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    private jwtService: JwtService,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Partial<Usuario>> {
    const { nombre, email, contrasena_hash, telefono } = createUsuarioDto;

    const usuarioExistente = await this.usuarioRepository.findOne({ where: { email } });
    if (usuarioExistente) {
      this.logger.warn(`[AUDIT-REGISTRO] Posible recolección de información. Intento de registro con correo ya existente: ${email}`);
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
      
      this.logger.log(`[AUDIT-REGISTRO] Creación de identidad exitosa. ID de usuario asignado: ${usuarioGuardado.id_usuario}`);
      return usuarioSinContrasena;

    } catch (error) {
      this.logger.error(`[ERROR-PERSISTENCIA] Fallo crítico al insertar nuevo usuario: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Ocurrió un error al guardar el usuario');
    }
  }

  async login(loginUsuarioDto: LoginUsuarioDto) {
    const { email, contrasena } = loginUsuarioDto;

    const usuario = await this.usuarioRepository.findOne({ where: { email } });

    if (!usuario) {
      this.logger.warn(`[AUDIT-AUTH] Intento de acceso fallido. Objetivo no encontrado en registros: ${email}`);
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (!usuario.esta_activo) {
      this.logger.warn(`[AUDIT-AUTH] Acceso denegado. Intento de inicio de sesión en cuenta inactiva o bloqueada. ID: ${usuario.id_usuario}`);
      throw new UnauthorizedException('Cuenta bloqueada. Contacte al administrador.');
    }

    const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena_hash);

    if (!contrasenaValida) {
      usuario.cantidad_strikes += 1;
      
      if (usuario.cantidad_strikes >= 5) {
        usuario.esta_activo = false;
        this.logger.warn(`[AUDIT-SEC] Mitigación activada. Cuenta bloqueada temporalmente por posible intrusión de fuerza bruta. ID: ${usuario.id_usuario}`);
      } else {
        this.logger.warn(`[AUDIT-AUTH] Validación de credenciales fallida (Strike ${usuario.cantidad_strikes}/5). Objetivo ID: ${usuario.id_usuario}`);
      }
      
      await this.usuarioRepository.save(usuario); 
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (usuario.cantidad_strikes > 0) {
      usuario.cantidad_strikes = 0;
      await this.usuarioRepository.save(usuario);
    }

    const payload = { email: usuario.email, sub: usuario.id_usuario };
    
    this.logger.log(`[AUDIT-AUTH] Autenticación completada satisfactoriamente. Sesión iniciada para ID: ${usuario.id_usuario}`);
    
    return {
      access_token: this.jwtService.sign(payload),
      id_usuario: usuario.id_usuario,
      nombre: usuario.nombre,
      email: usuario.email
    };
  }

  // =====================================================================
  // EL NUEVO MÉTODO ESTÁ EXACTAMENTE AQUÍ, SEPARADO DE LOS DEMÁS
  // =====================================================================
  async findByEmail(email: string) {
    return this.usuarioRepository.findOne({ 
      where: { email },
      relations: ['rol'] 
    });
  }
  // =====================================================================

  async solicitarRecuperacion(solicitarRecuperacionDto: SolicitarRecuperacionDto) {
    const { email } = solicitarRecuperacionDto;
    const usuario = await this.usuarioRepository.findOne({ where: { email } });

    if (!usuario) {
      this.logger.warn(`[AUDIT-RECOVERY] Intento de recuperación de credenciales para correo inexistente: ${email}`);
      return { message: 'Si el correo existe, se ha enviado un enlace de recuperación.' };
    }

    const payload = { sub: usuario.id_usuario, email: usuario.email };
    const tokenRecuperacion = this.jwtService.sign(payload, { 
      secret: 'secreto-recuperacion-dogchat', 
      expiresIn: '15m' 
    });

    const linkSimulado = `http://localhost:3000/restablecer?token=${tokenRecuperacion}`;
    
    this.logger.log(`[AUDIT-RECOVERY] Token de recuperación temporal generado exitosamente para ID: ${usuario.id_usuario}`);
    this.logger.debug(`SIMULACIÓN DE CORREO SMTP -> DESTINO: ${email} | ENLACE: ${linkSimulado}`);

    return { 
      message: 'Si el correo existe, se ha enviado un enlace de recuperación.',
      dev_token: tokenRecuperacion
    };
  }

  async restablecerPassword(restablecerPasswordDto: RestablecerPasswordDto) {
    const { token, nueva_contrasena } = restablecerPasswordDto;

    try {
      const payload = this.jwtService.verify(token, { secret: 'secreto-recuperacion-dogchat' });
      
      const usuario = await this.usuarioRepository.findOne({ where: { id_usuario: payload.sub } });
      if (!usuario) {
        this.logger.error(`[AUDIT-SEC] Anomalía detectada. Token criptográfico válido pero identidad inexistente. ID asociado: ${payload.sub}`);
        throw new BadRequestException('Usuario no encontrado');
      }

      const salt = await bcrypt.genSalt(10);
      usuario.contrasena_hash = await bcrypt.hash(nueva_contrasena, salt);

      await this.usuarioRepository.save(usuario);

      this.logger.log(`[AUDIT-RECOVERY] Restablecimiento de credenciales aplicado correctamente para ID: ${usuario.id_usuario}`);

      return { message: 'Contraseña actualizada correctamente. Ya puedes iniciar sesión.' };
    } catch (error) {
      this.logger.warn(`[AUDIT-SEC] Rechazo de token de recuperación. Firma inválida, manipulada o expirada.`);
      throw new BadRequestException('El token es inválido o ha expirado');
    }
  }

  async findMyProfile(userId: number) {
    this.logger?.log?.(
      `[AUDIT-USERS] Consulta de perfil propio por usuario ID: ${userId}`
    );

    const usuario = await this.usuarioRepository
      .createQueryBuilder('usuario')
      .select([
        'usuario.id_usuario',
        'usuario.nombre',
        'usuario.email',
        'usuario.telefono',
        'usuario.foto_perfil_url',
        'usuario.fecha_registro',
      ])
      .where('usuario.id_usuario = :id', { id: userId })
      .getOne();

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return usuario;
  }
}
