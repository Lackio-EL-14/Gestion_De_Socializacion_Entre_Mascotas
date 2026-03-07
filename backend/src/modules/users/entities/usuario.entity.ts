import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('USUARIO') 
export class Usuario {
  @PrimaryGeneratedColumn()
  id_usuario: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  contrasena_hash: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  foto_perfil_url: string;

  @Column({ type: 'int', default: 0 })
  cantidad_strikes: number; 

  @CreateDateColumn()
  fecha_registro: Date;

  @Column({ type: 'boolean', default: true })
  esta_activo: boolean;

   
  // Cuando creemos la entidad ROL @ManyToOne
  @Column({ type: 'int' })
  id_rol: number;
}
