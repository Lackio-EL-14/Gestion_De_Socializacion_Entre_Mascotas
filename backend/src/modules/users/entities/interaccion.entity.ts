import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('INTERACCION')
export class Interaccion {
  @PrimaryGeneratedColumn()
  id_interaccion: number;

  @Column({ type: 'int' })
  id_mascota_origen: number;

  @Column({ type: 'int' })
  id_mascota_destino: number;

  @Column({ type: 'enum', enum: ['Me gusta', 'Duérmanlo'] })
  tipo_interaccion: string;

  @CreateDateColumn()
  fecha: Date;
}
