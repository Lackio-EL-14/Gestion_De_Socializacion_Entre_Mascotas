import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Mascota } from './mascota.entity';

@Entity('INTERACCION')
export class Interaccion {
  @PrimaryGeneratedColumn()
  id_interaccion: number;

  @ManyToOne(() => Mascota)
  @JoinColumn({ name: 'id_mascota_origen' })
  mascota_origen: Mascota;

  @ManyToOne(() => Mascota)
  @JoinColumn({ name: 'id_mascota_destino' })
  mascota_destino: Mascota; 
  
  @Column({ type: 'enum', enum: ['Me gusta', 'Duérmanlo'] })
  tipo_interaccion: string;

  @CreateDateColumn()
  fecha: Date;
}
