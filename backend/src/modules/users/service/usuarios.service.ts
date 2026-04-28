import { Injectable, ConflictException, InternalServerErrorException, UnauthorizedException, BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import { PerfilProfesional } from '../entities/perfil_profesional.entity';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { CreateTrabajadorDto } from '../dto/create-trabajador.dto';
import { LoginUsuarioDto } from '../dto/login-usuario.dto';
import { SolicitarRecuperacionDto } from '../dto/solicitar-recuperacion.dto';
import { RestablecerPasswordDto } from '../dto/restablecer-password.dto';
import { UpdateMyProfileDto } from '../dto/update-my-profile.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UsuariosService {
  private readonly logger = new Logger(UsuariosService.name);

  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    @InjectRepository(PerfilProfesional)
    private perfilProfesionalRepository: Repository<PerfilProfesional>,
    private dataSource: DataSource,
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

    } catch (error: unknown) {
      const mensaje = error instanceof Error ? error.message : 'Error desconocido';
      const stack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`[ERROR-PERSISTENCIA] Fallo crítico al insertar nuevo usuario: ${mensaje}`, stack);
      throw new InternalServerErrorException('Ocurrió un error al guardar el usuario');
    }
  }

  async createTrabajador(createTrabajadorDto: CreateTrabajadorDto) {
    const { nombre, email, contrasena_hash, telefono, nombre_servicio, descripcion } = createTrabajadorDto;

    const usuarioExistente = await this.usuarioRepository.findOne({ where: { email } });
    if (usuarioExistente) {
      this.logger.warn(`[AUDIT-REGISTRO-WORKER] Intento de registro con correo ya existente: ${email}`);
      throw new ConflictException('El correo electrónico ya está en uso');
    }

    // Usamos una transacción para asegurar que si falla el perfil, no se guarde el usuario a medias
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const salt = await bcrypt.genSalt(10);
      const contrasenaHash = await bcrypt.hash(contrasena_hash, salt);

      // 1. Crear la entidad Usuario
      const nuevoUsuario = queryRunner.manager.create(Usuario, {
        nombre,
        email,
        contrasena_hash: contrasenaHash,
        telefono,
        rol: { id_rol: 3 } // <-- ASUMIENDO QUE EL ROL TRABAJADOR ES EL 3
      });

      const usuarioGuardado = await queryRunner.manager.save(nuevoUsuario);

      // 2. Crear la entidad Perfil Profesional vinculada al usuario
      const nuevoPerfil = queryRunner.manager.create(PerfilProfesional, {
        usuario: usuarioGuardado,
        nombre_servicio,
        descripcion,
        datos_contacto: telefono // Reutilizamos el teléfono como contacto inicial
      });

      await queryRunner.manager.save(nuevoPerfil);

      // Si todo sale bien, confirmamos la transacción
      await queryRunner.commitTransaction();

      this.logger.log(`[AUDIT-REGISTRO-WORKER] Creación exitosa. Trabajador ID: ${usuarioGuardado.id_usuario}`);
      
      const { contrasena_hash: _, ...usuarioSinContrasena } = usuarioGuardado;
      return {
        ...usuarioSinContrasena,
        perfil_profesional: {
          nombre_servicio,
          descripcion
        }
      };

    } catch (error) {
      // Si algo falla, deshacemos los cambios en la BD
      await queryRunner.rollbackTransaction();
      this.logger.error(`[ERROR-PERSISTENCIA-WORKER] Fallo al crear trabajador: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Ocurrió un error al guardar la cuenta de negocio');
    } finally {
      await queryRunner.release();
    }
  }

  async login(loginUsuarioDto: LoginUsuarioDto) {
  const { email, contrasena } = loginUsuarioDto;

  // CAMBIO 1: Agregamos 'relations' para traer los datos del rol
  const usuario = await this.usuarioRepository.findOne({ 
    where: { email },
    relations: ['rol'] 
  });

  if (!usuario) {
    this.logger.warn(`[AUDIT-AUTH] Intento de acceso fallido: ${email}`);
    throw new UnauthorizedException('Credenciales inválidas');
  }

  // ... (aquí va tu lógica existente de validación de contraseña y strikes) ...

  const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena_hash);
  if (!contrasenaValida) {
     // ... tu lógica de strikes ...
     throw new UnauthorizedException('Credenciales inválidas');
  }

  // CAMBIO 2: Incluimos el rol en el payload del JWT (opcional pero recomendado)
  // Así tus Guards podrán verificar el rol sin ir a la base de datos
  const payload = { 
    email: usuario.email, 
    sub: usuario.id_usuario,
    rol: usuario.rol?.id_rol // O el nombre del rol
  };
  
  this.logger.log(`[AUDIT-AUTH] Sesión iniciada para ID: ${usuario.id_usuario} con Rol: ${usuario.rol?.id_rol}`);
  
  // CAMBIO 3: Retornamos el rol al frontend
  return {
    access_token: this.jwtService.sign(payload),
    id_usuario: usuario.id_usuario,
    nombre: usuario.nombre,
    email: usuario.email,
    rol: usuario.rol // Retorna el objeto rol completo o solo el ID/Nombre
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

  async updateMyProfile(userId: number, updateMyProfileDto: UpdateMyProfileDto) {
    const usuario = await this.usuarioRepository.findOne({
      where: { id_usuario: userId },
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (updateMyProfileDto.email && updateMyProfileDto.email !== usuario.email) {
      const emailEnUso = await this.usuarioRepository.findOne({
        where: { email: updateMyProfileDto.email },
      });

      if (emailEnUso && emailEnUso.id_usuario !== userId) {
        throw new ConflictException('El correo electrónico ya está en uso');
      }
    }

    if (typeof updateMyProfileDto.nombre === 'string') {
      usuario.nombre = updateMyProfileDto.nombre.trim();
    }

    if (typeof updateMyProfileDto.email === 'string') {
      usuario.email = updateMyProfileDto.email.trim();
    }

    if (typeof updateMyProfileDto.telefono === 'string') {
      usuario.telefono = updateMyProfileDto.telefono.trim();
    }

    await this.usuarioRepository.save(usuario);

    this.logger.log(`[AUDIT-USERS] Perfil actualizado por usuario ID: ${userId}`);

    return {
      id_usuario: usuario.id_usuario,
      nombre: usuario.nombre,
      email: usuario.email,
      telefono: usuario.telefono,
      foto_perfil_url: usuario.foto_perfil_url,
      fecha_registro: usuario.fecha_registro,
    };
  }
  
  async findAll() {
    this.logger.log(`[AUDIT-USERS] Consulta de lista general de usuarios`);

    return this.usuarioRepository.find({
      select: {
        id_usuario: true,
        nombre: true,
        email: true,
        telefono: true,
        foto_perfil_url: true,
        cantidad_strikes: true,
        fecha_registro: true,
        esta_activo: true,
      },
      relations: ['rol'] // Traemos el rol asociado para mayor contexto
    });
  }

  async findPublicProfile(id: number) {
    const usuario = await this.usuarioRepository.findOne({
      where: { id_usuario: id },
      select: [
        'id_usuario',
        'nombre',
        'email',
        'telefono',
        'foto_perfil_url',
        'fecha_registro'
      ]
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return usuario;
  }

  async updateProfile(userId: number, dto: UpdateUserDto) {
    const user = await this.usuarioRepository.findOne({
      where: { id_usuario: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Campos editables
    user.nombre = dto.nombre ?? user.nombre;
    user.email = dto.email ?? user.email;
    user.telefono = dto.telefono ?? user.telefono;

    if (dto.foto_perfil_url) {
      user.foto_perfil_url = dto.foto_perfil_url;
    }

    const updatedUser = await this.usuarioRepository.save(user);

    this.logger.log(`Usuario actualizado: ${userId}`);

    return updatedUser;
  }
}
