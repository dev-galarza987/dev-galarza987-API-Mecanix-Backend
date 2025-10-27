import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from '../../user/entities/user.entity.js';
import { Service } from '../../service/entities/service.entity.js';
import { Reservate } from '../../reservate/entities/reservate.entity.js';
import {
  MechanicSpecialty,
  MechanicStatus,
  ExperienceLevel,
} from '../../types/MechanicTypes.js';

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
    name: 'emergency_contact',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  emergencyContact: string;

  @Column({
    name: 'hire_date',
    type: 'date',
    nullable: false,
  })
  hireDate: Date;

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
  hourlyRate: number;

  @Column({
    name: 'work_schedule_start',
    type: 'time',
    default: '08:00:00',
  })
  workScheduleStart: string;

  @Column({
    name: 'work_schedule_end',
    type: 'time',
    default: '17:00:00',
  })
  workScheduleEnd: string;

  @Column({
    name: 'work_days',
    type: 'simple-array',
    default: 'Monday,Tuesday,Wednesday,Thursday,Friday',
  })
  workDays: string[];

  @Column({
    name: 'certifications',
    type: 'text',
    nullable: true,
  })
  certifications: string;

  @Column({
    name: 'notes',
    type: 'text',
    nullable: true,
  })
  notes: string;

  @Column({ default: true })
  isActive: boolean;

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

  // Relaciones
  @OneToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Reservate, (reservate) => reservate.mechanic)
  reservations: Reservate[];

  @ManyToMany(() => Service, (service) => service.mechanics)
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