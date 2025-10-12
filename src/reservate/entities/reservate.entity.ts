import { StateReservate } from 'src/types/StateReservate';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'reservate' })
export class Reservate {
  @PrimaryGeneratedColumn({ name: 'reservate_id', type: 'int' })
  id: number;

  @Column({
    name: 'code_reservate',
    type: 'int',
    unique: true,
    nullable: false,
  })
  code: number;

  @Column({
    name: 'title',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  title: string;

  @Column({
    name: 'description',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  description: string;

  @Column({
    type: 'enum',
    enum: StateReservate,
    default: StateReservate.CANCELLED,
    nullable: false,
  })
  state: StateReservate;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
