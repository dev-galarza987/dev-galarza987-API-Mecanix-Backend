import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'service' })
export class Service {
  @PrimaryGeneratedColumn({ type: 'int', name: 'service_id' })
  id: number;

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
}
