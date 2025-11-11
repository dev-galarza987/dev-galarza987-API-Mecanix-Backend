import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Mechanic } from '../../mechanic/entities/mechanic.entity';

@Entity({ name: 'service' })
export class Service {
  @ApiProperty({
    description: 'ID único del servicio',
    example: 1
  })
  @PrimaryGeneratedColumn({ type: 'int', name: 'service_id' })
  id: number;

  @ApiProperty({
    description: 'Código único del servicio',
    example: 101
  })
  @Column({ type: 'int', name: 'code', nullable: true, unique: true })
  code: number;

  @ApiProperty({
    description: 'Título del servicio',
    example: 'Cambio de aceite'
  })
  @Column({ type: 'varchar', length: 100, name: 'title', nullable: false })
  title: string;

  @ApiProperty({
    description: 'Descripción detallada del servicio',
    example: 'Cambio de aceite del motor con filtro incluido'
  })
  @Column({
    type: 'varchar',
    length: 100,
    name: 'description',
    nullable: false,
  })
  description: string;

  @ApiProperty({
    description: 'Precio del servicio en pesos colombianos',
    example: 150000
  })
  @Column({ type: 'int', name: 'price', nullable: false })
  price: number;

  @ApiProperty({
    description: 'Mecánicos que pueden realizar este servicio',
    type: () => [Mechanic]
  })
  // Relación con Mechanic
  @ManyToMany(() => Mechanic, (mechanic) => mechanic.services)
  mechanics: Mechanic[];
}
