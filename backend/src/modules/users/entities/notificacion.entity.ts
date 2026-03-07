import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('NOTIFICACION')
export class Notificacion {
  @PrimaryGeneratedColumn()
  id_notificacion: number;

  @Column({ type: 'int' })
  id_usuario_destino: number;

  @Column({ type: 'varchar', length: 100 })
  tipo: string;

  @Column({ type: 'text' })
  mensaje: string;

  @CreateDateColumn()
  fecha_creacion: Date;

  @Column({ type: 'boolean', default: false })
  fue_leida: boolean;
}
