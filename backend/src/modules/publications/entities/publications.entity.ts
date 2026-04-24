import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Usuario } from '../../users/entities/usuario.entity';

@Entity('PUBLICACION')
export class Publication {
  @PrimaryGeneratedColumn()
  id_publicacion: number;

  @Column({ type: 'text' })
  contenido_texto: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  imagen_url: string;

  @CreateDateColumn()
  fecha_publicacion: Date;

  @Column({
    type: 'enum',
    enum: ['pendiente', 'aprobada', 'rechazada'],
    default: 'pendiente'
  })
  estado: string;

  @Column()
  id_usuario: number;

  // RELACIÓN
  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;
}
