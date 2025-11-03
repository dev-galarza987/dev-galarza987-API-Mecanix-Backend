import { ClientVehicle } from 'src/client-vehicle/entities/client-vehicle.entity';
import { Order } from '../../order/entities/order.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'vehicle' })
export class Vehicle {
  @PrimaryGeneratedColumn({ type: 'int', name: 'vehicle_id' })
  id: number;

  @Column({ type: 'varchar', length: 20, name: 'board', nullable: false })
  board: string;

  @Column({ type: 'varchar', length: 20, name: 'model', nullable: false })
  model: string;

  @Column({ type: 'varchar', length: 50, name: 'brand', nullable: false })
  brand: string;

  @Column({ type: 'int', name: 'year', nullable: false })
  year: number;

  @OneToMany(() => ClientVehicle, (clientVehicle) => clientVehicle.vehicle)
  clientVehicles: ClientVehicle[];

  @OneToMany(() => Order, (order) => order.vehicle)
  orders: Order[];
}
