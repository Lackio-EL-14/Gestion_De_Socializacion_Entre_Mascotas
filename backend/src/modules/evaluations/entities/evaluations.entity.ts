import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Evento } from '../../events/entities/events.entity';
import { Usuario } from '../../users/entities/usuario.entity';

@Entity('EVALUACION_EVENTO')
export class Evaluation {
  @PrimaryGeneratedColumn()
  id_evaluacion: number;

  @ManyToOne(() => Evento)
  @JoinColumn({ name: 'id_evento' })
  evento: Evento;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_usuario_evaluador' })
  evaluador: Usuario;

  @Column({ type: 'tinyint' })
  puntuacion_organizacion: number;

  @Column({ type: 'tinyint' })
  puntuacion_mascotas: number;

  @Column({ type: 'text', nullable: true })
  comentario: string;

  @CreateDateColumn()
  fecha_evaluacion: Date;
}
