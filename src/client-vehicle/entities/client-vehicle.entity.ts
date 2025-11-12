import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Client } from '../../client/entities/client.entity';
import { Vehicle } from '../../vehicle/entities/vehicle.entity';

@Entity({ name: 'client_vehicle' })
export class ClientVehicle {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({ type: 'int', name: 'client_code', nullable: true })
  clientCode: number;

  @Column({ type: 'int', name: 'vehicle_id', nullable: true })
  vehicleId: number;

  @ManyToOne(() => Client, (client) => client.vehicles, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'client_code', referencedColumnName: 'code' })
  client: Client | null;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.clientVehicles, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'vehicle_id', referencedColumnName: 'id' })
  vehicle: Vehicle | null;

  @Column({
    type: 'boolean',
    name: 'is_primary',
    default: false,
    comment: 'Indica si este es el vehículo principal del cliente',
  })
  isPrimary: boolean;

  @Column({
    type: 'varchar',
    length: 500,
    name: 'notes',
    nullable: true,
    comment: 'Notas adicionales sobre esta relación cliente-vehículo',
  })
  notes?: string;

  @Column({
    type: 'boolean',
    name: 'is_active',
    default: true,
    comment: 'Indica si el cliente aún posee este vehículo',
  })
  isActive: boolean;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'added_date',
    comment: 'Fecha en que se agregó este vehículo al cliente',
  })
  addedDate: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_at',
  })
  updatedAt: Date;
}
