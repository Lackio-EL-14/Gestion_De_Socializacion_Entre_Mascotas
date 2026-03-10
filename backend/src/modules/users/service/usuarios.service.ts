import { Injectable, ConflictException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { LoginUsuarioDto } from '../dto/login-usuario.dto';
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

    // CA3: Verificar si el correo ya está registrado
    const usuarioExistente = await this.usuarioRepository.findOne({ where: { email } });
    if (usuarioExistente) {
      throw new ConflictException('El correo electrónico ya está en uso');
    }

    try {
      // Seguridad: Encriptacion de las contrasena antes de guardarlas en la DB 
      const salt = await bcrypt.genSalt(10);
      const contrasenaHash = await bcrypt.hash(contrasena_hash, salt);

      // CA1: Crear la instancia del nuevo usuario
      const nuevoUsuario = this.usuarioRepository.create({
        nombre,
        email,
        contrasena_hash: contrasenaHash,
        telefono,
        // HACK TEMPORAL Y MUY NECESARIO LA VERDAD: Como aplazamos lo de los roles, forzamos el rol 1 (Dueño) 
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
    const { email, contrasena_hash } = loginUsuarioDto;

    const usuario = await this.usuarioRepository.findOne({ where: { email } });

    // CA2: Si el usuario no existe, lanzamos error genérico
    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // CA3 (Parte 1): Verificar si la cuenta está bloqueada
    if (!usuario.esta_activo) {
      throw new UnauthorizedException('Cuenta bloqueada. Contacte al administrador.');
    }

    const contrasenaValida = await bcrypt.compare(contrasena_hash, usuario.contrasena_hash);

    // CA2 y CA3 (Parte 2): Si la contraseña es incorrecta 5 veces bloquemos la cuenta 
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

    // CA1: Generar el Payload (los datos que irán dentro del Pase VIP)
    const payload = { email: usuario.email, sub: usuario.id_usuario };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

}
