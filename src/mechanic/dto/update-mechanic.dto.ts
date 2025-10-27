import { PartialType } from '@nestjs/swagger';
import { CreateMechanicDto } from './create-mechanic.dto.js';
import { ExperienceLevel, MechanicSpecialty, MechanicStatus } from 'src/types/MechanicTypes.js';

export class UpdateMechanicDto extends PartialType(CreateMechanicDto) {
    employeeCode?: string | undefined;
    firstName?: string | undefined;
    lastName?: string | undefined;
    phone?: string | undefined;
    emergencyContact?: string | undefined;
    experienceLevel?: ExperienceLevel | undefined;
    status?: MechanicStatus | undefined;
    specialties?: MechanicSpecialty[] | undefined;
    hourlyRate?: number | undefined;
    workScheduleStart?: string | undefined;
    workScheduleEnd?: string | undefined;
    workDays?: string[] | undefined;
    certifications?: string | undefined;
    notes?: string | undefined;
    isActive?: boolean | undefined;
    updatedAt?: Date | undefined;
}