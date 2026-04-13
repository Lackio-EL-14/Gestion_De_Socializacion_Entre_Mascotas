import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Pet } from '../../pets/entities/pet.entity';

@Entity('MATCH_MASCOTA') 
export class Match {
  @PrimaryGeneratedColumn()
  id_match: number;

  @ManyToOne(() => Pet)
  @JoinColumn({ name: 'id_mascota_1' })
  mascota_1: Pet;

  @ManyToOne(() => Pet)
  @JoinColumn({ name: 'id_mascota_2' })
  mascota_2: Pet;

  @CreateDateColumn()
  fecha_match: Date;

  @Column({ type: 'boolean', default: true })
  activo: boolean;
}
