import { Reservate } from 'src/reservate/entities/reservate.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({ type: 'int', name: 'phone', nullable: false, unique: true })
  phone: number;

  @OneToMany(() => Reservate, (reservate) => reservate.client)
  reservations: Reservate[];
}