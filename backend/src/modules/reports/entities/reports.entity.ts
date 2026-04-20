import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('REPORTE')
export class Report {

  @PrimaryGeneratedColumn({ name: 'id_reporte' })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  motivo: string;

  @Column({ type: 'text' })
  comentario: string;

  @Column({ 
    type: 'enum', 
    enum: ['pendiente', 'en_proceso', 'resuelto'] 
  })
  estado: string;

  @Column({ type: 'datetime' })
  fecha_reporte: Date;

  @Column({ type: 'datetime', nullable: true })
  fecha_resolucion: Date;

  @Column()
  id_usuario_reportante: number;

  @Column()
  id_usuario_reportado: number;

  @Column({ nullable: true })
  id_admin_resolutor: number;
}
