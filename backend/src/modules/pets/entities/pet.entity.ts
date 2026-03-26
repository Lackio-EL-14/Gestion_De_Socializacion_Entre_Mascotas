import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('MASCOTA')
export class Pet {

  @PrimaryGeneratedColumn()
  id_mascota: number;

  @Column()
  nombre: string;

  @Column()
  raza: string;

  @Column()
  tamano: string;

  @Column()
  edad: number;

  @Column()
  genero: string;

  @Column()
  estado_salud: string;

  @Column({ nullable: true })
  vacuna_imagen_url: string;

  @CreateDateColumn()
  fecha_registro: Date;

  @Column()
  id_usuario: number;
}