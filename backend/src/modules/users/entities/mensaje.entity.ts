import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('MENSAJE')
export class Mensaje {
  @PrimaryGeneratedColumn()
  id_mensaje: number;

  @Column({ type: 'int' })
  id_match: number;

  @Column({ type: 'int' })
  id_usuario_remitente: number;

  @Column({ type: 'text' })
  contenido: string;

  @CreateDateColumn()
  fecha_envio: Date;

  @Column({ type: 'boolean', default: false })
  fue_leido: boolean;
}
