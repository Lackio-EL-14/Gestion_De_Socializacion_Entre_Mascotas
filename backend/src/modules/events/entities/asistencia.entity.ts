import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Evento } from './events.entity';
import { Usuario } from '../../users/entities/usuario.entity';

@Entity('ASISTENCIA_EVENTO')
export class AsistenciaEvento {
  @PrimaryGeneratedColumn()
  id_asistencia: number;

  @ManyToOne(() => Evento)
  @JoinColumn({ name: 'id_evento' })
  evento: Evento;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @Column({ type: 'enum', enum: ['PENDIENTE', 'CONFIRMADO', 'CANCELADO'], default: 'PENDIENTE' })
  estado_asistencia: string;

  @CreateDateColumn()
  fecha_registro: Date;
}
