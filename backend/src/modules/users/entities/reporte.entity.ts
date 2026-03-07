import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('REPORTE')
export class Reporte {
  @PrimaryGeneratedColumn()
  id_reporte: number;

  @Column({ type: 'int' })
  id_usuario_reportante: number;

  @Column({ type: 'int' })
  id_usuario_reportado: number;

  @Column({ type: 'varchar', length: 255 })
  motivo: string;

  @Column({ type: 'text', nullable: true })
  comentario: string;

  // Nuestro fix aplicado aquí
  @Column({ type: 'enum', enum: ['pendiente', 'resuelto', 'ignorado'], default: 'pendiente' })
  estado: string;

  @CreateDateColumn()
  fecha_reporte: Date;

  @Column({ type: 'int', nullable: true })
  id_admin_resolutor: number;

  @Column({ type: 'datetime', nullable: true })
  fecha_resolucion: Date;
}
