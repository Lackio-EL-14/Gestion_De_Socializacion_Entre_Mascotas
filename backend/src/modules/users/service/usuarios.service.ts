import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
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
      console.error('💥 ERROR REAL DE LA BASE DE DATOS:', error);
      throw new InternalServerErrorException('Ocurrió un error al guardar el usuario');
    }
  }
}
