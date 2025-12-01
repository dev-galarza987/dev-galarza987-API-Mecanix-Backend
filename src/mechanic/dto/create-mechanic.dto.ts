import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsArray,
  IsNumber,
  IsPositive,
  IsDateString,
  MinLength,
  MaxLength,
  Matches,
  Min,
  Max,
  IsEmail,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  MechanicSpecialty,
  MechanicStatus,
  ExperienceLevel,
} from '../../types/MechanicTypes.js';

export class CreateMechanicDto {
  @ApiProperty({
    description: 'Código único del empleado',
    example: 'MEC001',
    minLength: 3,
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  @Matches(/^[A-Z0-9]+$/, {
    message: 'Employee code must contain only uppercase letters and numbers',
  })
  employeeCode!: string;

  @ApiProperty({
    description: 'Nombre del mecánico',
    example: 'Juan Carlos',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  firstName!: string;

  @ApiProperty({
    description: 'Apellido del mecánico',
    example: 'González López',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  lastName!: string;

  @ApiPropertyOptional({
    description: 'Número de teléfono',
    example: '+1234567890',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Phone number must be a valid international format',
  })
  phone?: string;

  @ApiPropertyOptional({
    description: 'Email del mecánico',
    example: 'mechanic@mecanix.com',
  })
  @IsOptional()
  @IsEmail()
  @IsString()
  email!: string;

  @ApiPropertyOptional({
    description: 'Email del mecánico',
    example: 'contraseña123#?',
  })
  @IsOptional()
  @IsString()
  password!: string;

  @ApiProperty({
    description: 'Fecha de contratación',
    example: '2024-01-15',
  })
  @IsDateString()
  @IsNotEmpty()
  hireDate!: string;

  @ApiPropertyOptional({
    description: 'Años de experiencia',
    example: 5,
    minimum: 0,
    maximum: 50,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(50)
  yearsExperience?: number;

  @ApiPropertyOptional({
    description: 'Nivel de experiencia',
    enum: ExperienceLevel,
    example: ExperienceLevel.SENIOR,
  })
  @IsOptional()
  @IsEnum(ExperienceLevel)
  experienceLevel?: ExperienceLevel;

  @ApiPropertyOptional({
    description: 'Estado actual del mecánico',
    enum: MechanicStatus,
    example: MechanicStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(MechanicStatus)
  status?: MechanicStatus;

  @ApiPropertyOptional({
    description: 'Especialidades del mecánico',
    type: [String],
    enum: MechanicSpecialty,
    example: [MechanicSpecialty.ENGINE, MechanicSpecialty.TRANSMISSION],
  })
  @IsOptional()
  @IsArray()
  @IsEnum(MechanicSpecialty, { each: true })
  specialties?: MechanicSpecialty[];

  @ApiPropertyOptional({
    description: 'Tarifa por hora en USD',
    example: 25.50,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  hourlyRate?: number;

  @ApiPropertyOptional({
    description: 'Hora de inicio de jornada laboral (HH:mm)',
    example: '08:00',
    pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$',
  })
  @IsOptional()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Work schedule start must be in HH:mm format',
  })
  workScheduleStart?: string;

  @ApiPropertyOptional({
    description: 'Hora de fin de jornada laboral (HH:mm)',
    example: '17:00',
    pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$',
  })
  @IsOptional()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Work schedule end must be in HH:mm format',
  })
  workScheduleEnd?: string;

  @ApiPropertyOptional({
    description: 'Días de trabajo',
    type: [String],
    example: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  workDays?: string[];

  // @ApiPropertyOptional({
  //   description: 'ID del usuario asociado',
  //   example: 1,
  // })
  // @IsOptional()
  // @IsNumber()
  // @IsPositive()
  // userId?: number;
}