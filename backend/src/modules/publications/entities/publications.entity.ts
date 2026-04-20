import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

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
}