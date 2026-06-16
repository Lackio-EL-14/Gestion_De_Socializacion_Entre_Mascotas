import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../../users/entities/usuario.entity';

@Entity('EVENTO')
export class Evento {
  @PrimaryGeneratedColumn()
  id_evento: number;

  @Column({ type: 'varchar', length: 150 })
  nombre: string; 

  @Column({ type: 'text' })
  descripcion: string; 

  @Column({ type: 'datetime' })
  fecha_hora: Date; 

  @Column({ type: 'varchar', length: 200 })
  direccion: string; 

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  latitud: number; 

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  longitud: number; 

  @Column({ type: 'varchar', length: 100 })
  tipo_actividad: string; 

  @Column({ type: 'int' })
  capacidad_maxima: number;

  @Column({ type: 'int', default: 0 })
  asistentes_actuales: number; 

  @Column({ type: 'enum', enum: ['ACTIVO', 'FINALIZADO', 'CANCELADO'], default: 'ACTIVO' })
  estado_evento: string; 

  @CreateDateColumn()
  fecha_creacion: Date;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_usuario_creador' })
  creador: Usuario;
}
