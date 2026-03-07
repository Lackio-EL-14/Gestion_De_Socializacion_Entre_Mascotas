import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('PUBLICACION')
export class Publicacion {
  @PrimaryGeneratedColumn()
  id_publicacion: number;

  @Column({ type: 'int' })
  id_usuario: number;

  @Column({ type: 'text', nullable: true })
  contenido_texto: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  imagen_url: string;

  @CreateDateColumn()
  fecha_publicacion: Date;

  // Nuestro fix aplicado aquí
  @Column({ type: 'enum', enum: ['pendiente', 'aprobada', 'rechazada'], default: 'pendiente' })
  estado: string;
}
