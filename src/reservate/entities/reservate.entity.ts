import { Client } from '../../client/entities/client.entity';
import { Service } from '../../service/entities/service.entity';
import { Mechanic } from '../../mechanic/entities/mechanic.entity';
import { Order } from '../../order/entities/order.entity';
import { StateReservate } from '../../types/StateReservate';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
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

  @ManyToMany(() => Service, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
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

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
  })
  updatedAt: Date;

  @OneToMany(() => Order, (order) => order.reservate)
  orders: Order[];
}