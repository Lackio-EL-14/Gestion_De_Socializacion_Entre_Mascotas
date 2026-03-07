import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('MATCH_MASCOTA') // Cambiado ligeramente por si 'MATCH' es palabra reservada en SQL que si lo es en mariadb pero al deployar no se sabe la verdad investigare
export class Match {
  @PrimaryGeneratedColumn()
  id_match: number;

  @Column({ type: 'int' })
  id_mascota_1: number;

  @Column({ type: 'int' })
  id_mascota_2: number;

  @CreateDateColumn()
  fecha_match: Date;

  @Column({ type: 'boolean', default: true })
  activo: boolean;
}
