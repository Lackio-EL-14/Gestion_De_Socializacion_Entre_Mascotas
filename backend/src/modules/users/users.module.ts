import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { Usuario } from './entities/usuario.entity';
import { Rol } from './entities/rol.entity';
import { Reporte } from './entities/reporte.entity';
import { Publicacion } from './entities/publicacion.entity';
import { PerfilProfesional } from './entities/perfil_profesional.entity';
import { Notificacion } from './entities/notificacion.entity';
import { Mensaje } from './entities/mensaje.entity';
import { Match } from './entities/match.entity';
import { Interaccion } from './entities/interaccion.entity';
import { Mascota } from './entities/mascota.entity';
import { UsuariosController } from './controller/usuarios.controller';
import { UsuariosService } from './service/usuarios.service';

@Module({
  imports: [TypeOrmModule.forFeature([
    Usuario, 
    Rol,
    Reporte,
    Publicacion,
    PerfilProfesional,
    Notificacion,
    Mensaje,
    Match,
    Interaccion,
    Mascota,
  ])], 
  controllers: [UsuariosController],
  providers: [UsuariosService],
})
export class UsersModule {}
