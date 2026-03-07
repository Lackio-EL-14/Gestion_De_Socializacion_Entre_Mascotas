import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ROL')
export class Rol {
  @PrimaryGeneratedColumn()
  id_rol: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  nombre_rol: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  descripcion: string;
}
