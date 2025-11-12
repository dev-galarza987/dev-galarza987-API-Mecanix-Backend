import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { Service } from '../../service/entities/service.entity';
import { Reservate } from '../../reservate/entities/reservate.entity';
import { Order } from '../../order/entities/order.entity';
import {
  MechanicSpecialty,
  MechanicStatus,
  ExperienceLevel,
} from '../../types/MechanicTypes';
import { UserRole } from '../../types/UserRole';

@Entity({ name: 'mechanic' })
export class Mechanic {
  @PrimaryGeneratedColumn({ name: 'mechanic_id', type: 'int' })
  id: number;

  @Column({
    name: 'employee_code',
    type: 'varchar',
    length: 20,
    unique: true,
    nullable: false,
  })
  employeeCode: string;

  @Column({ name: 'first_name', type: 'varchar', length: 100, nullable: false })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar', length: 100, nullable: false })
  lastName: string;

  @Column({
    name: 'phone',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  phone: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    nullable: false,
    default: UserRole.MECHANIC,
  })
  type: UserRole;

  @Column({
    name: 'hire_date',
    type: 'date',
    nullable: false,
    default: () => 'CURRENT_DATE',
  })
  hireDate: Date; // Fecha de contratación

  @Column({
    name: 'years_experience',
    type: 'int',
    default: 0,
  })
  yearsExperience: number;

  @Column({
    type: 'enum',
    enum: ExperienceLevel,
    default: ExperienceLevel.TRAINEE,
  })
  experienceLevel: ExperienceLevel;

  @Column({
    type: 'enum',
    enum: MechanicStatus,
    default: MechanicStatus.ACTIVE,
  })
  status: MechanicStatus;

  @Column({
    name: 'specialties',
    type: 'simple-array',
    nullable: true,
  })
  specialties: MechanicSpecialty[];

  @Column({
    name: 'hourly_rate',
    type: 'decimal',
    precision: 8,
    scale: 2,
    nullable: true,
  })
  hourlyRate: number; // Tarifa por hora en Bs.

  @Column({
    name: 'work_schedule_start',
    type: 'time',
    default: '08:00:00',
  })
  workScheduleStart: string;  // Hora de inicio de la jornada laboral

  @Column({
    name: 'work_schedule_end',
    type: 'time',
    default: '17:00:00',
  })
  workScheduleEnd: string;  // Hora de finalización de la jornada laboral


  @Column({
    name: 'work_days',
    type: 'simple-array',
    default: 'Monday,Tuesday,Wednesday,Thursday,Friday',
  })
  workDays: string[]; // Días de trabajo

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;

  // Relaciones

  @OneToMany(() => Reservate, (reservate) => reservate.mechanic)
  reservations: Reservate[];

  @OneToMany(() => Order, (order) => order.mechanic)
  orders: Order[];

  @ManyToMany(() => Service, (service) => service.mechanics, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  @JoinTable({
    name: 'mechanic_services',
    joinColumn: {
      name: 'mechanic_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'service_id',
      referencedColumnName: 'id',
    },
  })
  services: Service[];
}