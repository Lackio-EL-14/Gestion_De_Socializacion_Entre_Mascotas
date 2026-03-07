import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('PERFIL_PROFESIONAL')
export class PerfilProfesional {
  @PrimaryGeneratedColumn()
  id_perfil_prof: number;

  @Column({ type: 'int', unique: true })
  id_usuario: number;

  @Column({ type: 'varchar', length: 150 })
  nombre_servicio: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  datos_contacto: string;

  @CreateDateColumn()
  fecha_creacion: Date;
}
