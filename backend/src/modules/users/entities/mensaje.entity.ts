import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Match } from '../../matches/entities/match.entity';
import { Usuario } from './usuario.entity';

@Entity('MENSAJE')
export class Mensaje {
  @PrimaryGeneratedColumn()
  id_mensaje: number;

  @ManyToOne(() => Match)
  @JoinColumn({ name: 'id_match' })
  match: Match;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_usuario_remitente' })
  usuario_remitente: Usuario;

  @Column({ type: 'text' })
  contenido: string;

  @CreateDateColumn()
  fecha_envio: Date;

  @Column({ type: 'boolean', default: false })
  fue_leido: boolean;
}
