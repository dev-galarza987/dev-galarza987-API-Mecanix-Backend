import { Reservate } from '../../reservate/entities/reservate.entity';
import { ClientGender } from '../../types/ClientGender';
import { ContactMethod } from '../../types/ContactMethod';
import { ClientVehicle } from '../../client-vehicle/entities/client-vehicle.entity';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'client' })
export class Client {
  @PrimaryGeneratedColumn({ type: 'int', name: 'client_id' })
  id: number;

  @Column({ type: 'int', name: 'client_code', unique: true, nullable: false })
  code: number;

  @Column({ type: 'varchar', name: 'name', nullable: false, length: 50 })
  name: string;

  @Column({ type: 'varchar', name: 'last_name', nullable: false, length: 80 })
  lastname: string;

  @Column({ type: 'varchar', name: 'phone', nullable: false, unique: true, length: 10 })
  phone: string;

  @Column({ type: 'int', name: 'ci', nullable: false, unique: true })
  ci: number;

  @Column({
    type: 'enum',
    enum: ClientGender,
    nullable: false,
  })
  gender: ClientGender;

  @Column({ type: 'varchar', name: 'email', nullable: true, unique: true, length: 100 })
  email: string;
  
  @Column({ type: 'varchar', name: 'password', nullable: true, length: 255 })
  password: string;

  @Column({ type: 'boolean', name: 'email_verified', nullable: false, default: false })
  emailVerified: boolean;

  @Column({ type: 'boolean', name: 'phone_verified', nullable: false, default: false })
  phoneVerified: boolean;

  @Column({ type: 'timestamp', name: 'last_login', nullable: true })
  lastLogin: Date;

  @Column({ type: 'text', name: 'address', nullable: true })
  address: string;

  @Column({
    type: 'enum',
    enum: ContactMethod,
    name: 'preferred_contact_method',
    nullable: false,
    default: ContactMethod.PHONE,
  })
  preferredContactMethod: ContactMethod;

  @Column({ type: 'boolean', name: 'is_active', nullable: false, default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Reservate, (reservate) => reservate.client)
  reservations: Reservate[];

  @OneToMany(() => ClientVehicle, (clientVehicle) => clientVehicle.client)
  vehicles: ClientVehicle[];
}