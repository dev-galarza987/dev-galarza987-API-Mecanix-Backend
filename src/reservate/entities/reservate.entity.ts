import { Client } from '../../client/entities/client.entity';
import { Service } from '../../service/entities/service.entity';
import { Mechanic } from '../../mechanic/entities/mechanic.entity';
import { Order } from '../../order/entities/order.entity';
import { StateReservate } from '../../types/StateReservate';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'reservate' })
export class Reservate {
  @PrimaryGeneratedColumn({ name: 'reservate_id', type: 'int' })
  id: number;

  @Column({
    name: 'code_reservate',
    type: 'bigint',
    unique: true,
    nullable: false,
  })
  code: number;

  @Column({
    name: 'reservation_date',
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  reservationDate: Date;

  @Column({
    name: 'total_price',
    type: 'int',
    nullable: false,
  })
  totalPrice: number;

  @Column({
    type: 'enum',
    enum: StateReservate,
    default: StateReservate.PENDING,
    nullable: false,
  })
  state: StateReservate;

  @ManyToOne(() => Client, (client) => client.reservations, { onDelete: 'SET NULL', nullable: true })
  client: Client | null;

  @ManyToOne(() => Mechanic, (mechanic) => mechanic.reservations, { nullable: true, onDelete: 'SET NULL' })
  mechanic: Mechanic | null;

  @ManyToMany(() => Service)
  @JoinTable({
    name: 'reservate_service',
    joinColumn: {
      name: 'reservate_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'service_id',
      referencedColumnName: 'id',
    },
  })
  services: Service[];

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @OneToMany(() => Order, (order) => order.reservate)
  orders: Order[];
}