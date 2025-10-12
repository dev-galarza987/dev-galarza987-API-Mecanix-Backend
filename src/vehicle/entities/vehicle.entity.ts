import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
