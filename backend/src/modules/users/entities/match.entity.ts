import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Mascota } from './mascota.entity';

@Entity('MATCH_MASCOTA') 
export class Match {
  @PrimaryGeneratedColumn()
  id_match: number;

  @ManyToOne(() => Mascota)
  @JoinColumn({ name: 'id_mascota_1' })
  mascota_1: Mascota;

  @ManyToOne(() => Mascota)
  @JoinColumn({ name: 'id_mascota_2' })
  mascota_2: Mascota;

  @CreateDateColumn()
  fecha_match: Date;

  @Column({ type: 'boolean', default: true })
  activo: boolean;
}
