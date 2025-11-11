import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Reservate } from '../../reservate/entities/reservate.entity';
import { Vehicle } from '../../vehicle/entities/vehicle.entity';
import { Mechanic } from '../../mechanic/entities/mechanic.entity';
import { OrderStatus } from '../../types/OrderStatus';
import { PaymentMethod } from '../../types/PaymentMethod';

@Entity({ name: 'order' })
export class Order {
  @PrimaryGeneratedColumn({ name: 'order_id', type: 'int' })
  id: number;

  @Column({
    name: 'order_code',
    type: 'varchar',
    length: 20,
    unique: true,
    nullable: false,
  })
  code: string;

  @ManyToOne(() => Reservate, { nullable: false })
  @JoinColumn({ name: 'reservate_id' })
  reservate: Reservate;

  @ManyToOne(() => Vehicle, { nullable: false })
  @JoinColumn({ name: 'vehicle_id' })
  vehicle: Vehicle;

  @ManyToOne(() => Mechanic, { nullable: false })
  @JoinColumn({ name: 'mechanic_id' })
  mechanic: Mechanic;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
    nullable: false,
  })
  status: OrderStatus;

  @Column({
    name: 'diagnosis',
    type: 'text',
    nullable: true,
  })
  diagnosis: string;

  @Column({
    name: 'work_description',
    type: 'text',
    nullable: true,
  })
  workDescription: string;  // Descripción del trabajo realizado

  @Column({
    name: 'start_date',
    type: 'timestamp',
    nullable: true,
  })
  startDate: Date;  // Fecha de inicio del trabajo

  @Column({
    name: 'completion_date',
    type: 'timestamp',
    nullable: true,
  })
  completionDate: Date; // Fecha de finalización del trabajo

  // ==================== CAMPOS DE FACTURACIÓN ====================

  @Column({
    name: 'client_nit_ci',
    type: 'bigint',
    nullable: false,
    comment: 'NIT o CI del cliente para facturación (7-10 dígitos)',
  })
  clientNitCi: number;

  @Column({
    name: 'client_name',
    type: 'varchar',
    length: 150,
    nullable: false,
    comment: 'Nombre completo del cliente para facturación',
  })
  clientName: string;

  @Column({
    name: 'client_email',
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'Email del cliente para envío de factura',
  })
  clientEmail: string;

  @Column({
    name: 'subtotal',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    comment: 'Subtotal antes de impuestos',
  })
  subtotal: number;

  @Column({
    name: 'tax_amount',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    comment: 'Monto de IVA (13%)',
  })
  taxAmount: number;

  @Column({
    name: 'total_cost',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    comment: 'Total a pagar (subtotal + IVA)',
  })
  totalCost: number;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    name: 'payment_method',
    nullable: false,
    default: PaymentMethod.CASH,
    comment: 'Método de pago utilizado',
  })
  paymentMethod: PaymentMethod;

  @Column({
    name: 'invoice_number',
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: 'Número de factura generado por Factus',
  })
  invoiceNumber: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
