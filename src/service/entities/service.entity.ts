import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Mechanic } from '../../mechanic/entities/mechanic.entity.js';

@Entity({ name: 'service' })
export class Service {
  @PrimaryGeneratedColumn({ type: 'int', name: 'service_id' })
  id: number;

  @Column({ type: 'int', name: 'code', nullable: true, unique: true })
  code: number;

  @Column({ type: 'varchar', length: 100, name: 'title', nullable: false })
  title: string;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'description',
    nullable: false,
  })
  description: string;

  @Column({ type: 'int', name: 'price', nullable: false })
  price: number;

  // Relación con Mechanic
  @ManyToMany(() => Mechanic, (mechanic) => mechanic.services)
  mechanics: Mechanic[];
}
