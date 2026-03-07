import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('FOTO_MASCOTA')
export class FotoMascota {
  @PrimaryGeneratedColumn()
  id_foto: number;

  @Column({ type: 'int' })
  id_mascota: number;

  @Column({ type: 'varchar', length: 500 })
  url_foto: string;

  @CreateDateColumn()
  fecha_subida: Date;
}
