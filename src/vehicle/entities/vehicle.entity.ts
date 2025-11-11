import { ClientVehicle } from '../../client-vehicle/entities/client-vehicle.entity';
import { Order } from '../../order/entities/order.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'vehicle' })
export class Vehicle {
  @ApiProperty({
    description: 'ID único del vehículo',
    example: 1,
  })
  @PrimaryGeneratedColumn({ type: 'int', name: 'vehicle_id' })
  id: number;

  @ApiProperty({
    description: 'Placa del vehículo',
    example: 'ABC123',
    maxLength: 20,
  })
  @Column({ type: 'varchar', length: 20, name: 'board', nullable: false })
  board: string;

  @ApiProperty({
    description: 'Modelo del vehículo',
    example: 'Corolla',
    maxLength: 20,
  })
  @Column({ type: 'varchar', length: 20, name: 'model', nullable: false })
  model: string;

  @ApiProperty({
    description: 'Marca del vehículo',
    example: 'Toyota',
    maxLength: 50,
  })
  @Column({ type: 'varchar', length: 50, name: 'brand', nullable: false })
  brand: string;

  @ApiProperty({
    description: 'Año del vehículo',
    example: 2023,
  })
  @Column({ type: 'int', name: 'year', nullable: false })
  year: number;

  @OneToMany(() => ClientVehicle, (clientVehicle) => clientVehicle.vehicle)
  clientVehicles: ClientVehicle[];

  @OneToMany(() => Order, (order) => order.vehicle)
  orders: Order[];
}
