import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('MASCOTA')
export class Mascota {
  @PrimaryGeneratedColumn()
  id_mascota: number;

  @Column({ type: 'int' })
  id_usuario: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 100 })
  raza: string;

  @Column({ type: 'varchar', length: 50 })
  tamano: string;

  @Column({ type: 'int' })
  edad: number;

  @Column({ type: 'varchar', length: 20 })
  genero: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  estado_salud: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  vacuna_imagen_url: string; // La simplificación que hicieron

  @CreateDateColumn()
  fecha_registro: Date;
}
