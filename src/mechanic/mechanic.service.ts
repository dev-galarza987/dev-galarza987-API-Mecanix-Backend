import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mechanic } from './entities/mechanic.entity.js';
import { CreateMechanicDto } from './dto/create-mechanic.dto.js';
import { UpdateMechanicDto } from './dto/update-mechanic.dto.js';
import {
  MechanicSpecialty,
  MechanicStatus,
  ExperienceLevel,
} from '../types/MechanicTypes.js';

@Injectable()
export class MechanicService {
  constructor(
    @InjectRepository(Mechanic)
    private readonly mechanicRepository: Repository<Mechanic>,
  ) {}

  async create(createMechanicDto: CreateMechanicDto): Promise<void> {
    // Verificar que el código de empleado no exista
    const existingMechanic = await this.mechanicRepository.findOne({
      where: { employeeCode: createMechanicDto.employeeCode },
    });

    if (existingMechanic) {
      throw new ConflictException(
        `Employee code ${createMechanicDto.employeeCode} already exists`,
      );
    }

    const mechanic = this.mechanicRepository.create({
      ...createMechanicDto,
      hireDate: new Date(createMechanicDto.hireDate),
    });

    await this.mechanicRepository.save(mechanic);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{
    mechanics: Mechanic[];
    total: number;
    page: number;
    lastPage: number;
  }> {
    const [mechanics, total] = await this.mechanicRepository.findAndCount({
      relations: ['services', 'reservations', 'orders'],
      take: limit,
      skip: (page - 1) * limit,
      order: { createdAt: 'DESC' },
    });

    return {
      mechanics,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<Mechanic> {
    const mechanic = await this.mechanicRepository.findOne({
      where: { id },
      relations: ['services', 'reservations', 'orders'],
    });

    if (!mechanic) {
      throw new NotFoundException(`Mechanic with ID ${id} not found`);
    }

    return mechanic;
  }

  async findByEmployeeCode(employeeCode: string): Promise<Mechanic> {
    const mechanic = await this.mechanicRepository.findOne({
      where: { employeeCode },
      relations: ['services', 'reservations', 'orders'],
    });

    if (!mechanic) {
      throw new NotFoundException(
        `Mechanic with employee code ${employeeCode} not found`,
      );
    }

    return mechanic;
  }

  async findBySpecialty(
    specialty: MechanicSpecialty,
  ): Promise<Mechanic[]> {
    return await this.mechanicRepository
      .createQueryBuilder('mechanic')
      .where('mechanic.specialties LIKE :specialty', {
        specialty: `%${specialty}%`,
      })
      .andWhere('mechanic.isActive = :isActive', { isActive: true })
      .leftJoinAndSelect('mechanic.services', 'services')
      .getMany();
  }

  async findAvailable(date?: string): Promise<Mechanic[]> {
    const queryBuilder = this.mechanicRepository
      .createQueryBuilder('mechanic')
      .where('mechanic.status = :status', { status: MechanicStatus.ACTIVE })
      .andWhere('mechanic.isActive = :isActive', { isActive: true })
      .leftJoinAndSelect('mechanic.services', 'services');

    if (date) {
      const targetDate = new Date(date);
      const dayName = targetDate.toLocaleDateString('en-US', { weekday: 'long' });
      
      queryBuilder.andWhere('mechanic.workDays LIKE :dayName', {
        dayName: `%${dayName}%`,
      });
    }

    return await queryBuilder.getMany();
  }

  async findByExperienceLevel(
    experienceLevel: ExperienceLevel,
  ): Promise<Mechanic[]> {
    return await this.mechanicRepository.find({
      where: { experienceLevel, isActive: true },
      relations: ['services'],
    });
  }

  async updateByCode(
    code: string,
    updateMechanicDto: UpdateMechanicDto,
  ): Promise<Mechanic> {
    const mechanic = await this.findByEmployeeCode(code);

    // Si se actualiza el código de empleado, verificar que no exista
    if (
      updateMechanicDto.employeeCode &&
      updateMechanicDto.employeeCode !== mechanic.employeeCode
    ) {
      const existingMechanic = await this.mechanicRepository.findOne({
        where: { employeeCode: updateMechanicDto.employeeCode },
      });

      if (existingMechanic) {
        throw new ConflictException(
          `Employee code ${updateMechanicDto.employeeCode} already exists`,
        );
      }
    }

    const updateData = { ...updateMechanicDto };
    if (updateMechanicDto.hireDate) {
      updateData.hireDate = updateMechanicDto.hireDate;
    }

    await this.mechanicRepository.update(mechanic.id, updateData);
    return this.findByEmployeeCode(code);
  }

  async update(id: number, updateMechanicDto: UpdateMechanicDto): Promise<Mechanic> {
    const mechanic = await this.findOne(id);

    // Si se actualiza el código de empleado, verificar que no exista
    if (updateMechanicDto.employeeCode && 
        updateMechanicDto.employeeCode !== mechanic.employeeCode) {
      const existingMechanic = await this.mechanicRepository.findOne({
        where: { employeeCode: updateMechanicDto.employeeCode },
      });

      if (existingMechanic) {
        throw new ConflictException(
          `Employee code ${updateMechanicDto.employeeCode} already exists`,
        );
      }
    }

    const updateData = { ...updateMechanicDto };
    if (updateMechanicDto.hireDate) {
      updateData.hireDate = updateMechanicDto.hireDate;
    }

    await this.mechanicRepository.update(id, updateData);
    return this.findOne(id);
  }

  async updateStatus(id: number, status: MechanicStatus): Promise<Mechanic> {
    const mechanic = await this.findOne(id);
    mechanic.status = status;
    await this.mechanicRepository.save(mechanic);
    return mechanic;
  }

  async updateStatusByCode(
    code: string,
    status: MechanicStatus,
  ): Promise<Mechanic> {
    const mechanic = await this.findByEmployeeCode(code);
    mechanic.status = status;
    await this.mechanicRepository.save(mechanic);
    return mechanic;
  }

  async remove(id: number): Promise<void> {
    const mechanic = await this.findOne(id);

    // Soft delete - marcar como inactivo en lugar de eliminar
    mechanic.isActive = false;
    mechanic.status = MechanicStatus.INACTIVE;
    await this.mechanicRepository.save(mechanic);
  }

  async removeByCode(code: string): Promise<void> {
    const mechanic = await this.findByEmployeeCode(code);

    // Soft delete - marcar como inactivo en lugar de eliminar
    mechanic.isActive = false;
    mechanic.status = MechanicStatus.INACTIVE;
    await this.mechanicRepository.save(mechanic);
  }

  async getWorkSchedule(id: number): Promise<{
    mechanic: Mechanic;
    schedule: {
      workDays: string[];
      startTime: string;
      endTime: string;
      totalHours: number;
    };
  }> {
    const mechanic = await this.findOne(id);
    
    const startTime = mechanic.workScheduleStart;
    const endTime = mechanic.workScheduleEnd;
    const workDays = mechanic.workDays;

    // Calcular horas totales por día
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    const totalMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin);
    const totalHours = totalMinutes / 60;

    return {
      mechanic,
      schedule: {
        workDays,
        startTime,
        endTime,
        totalHours,
      },
    };
  }

  async getWorkScheduleByCode(code: string): Promise<{
    mechanic: Mechanic;
    schedule: {
      workDays: string[];
      startTime: string;
      endTime: string;
      totalHours: number;
    };
  }> {
    const mechanic = await this.findByEmployeeCode(code);
    
    const startTime = mechanic.workScheduleStart;
    const endTime = mechanic.workScheduleEnd;
    const workDays = mechanic.workDays;

    // Calcular horas totales por día
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    const totalMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin);
    const totalHours = totalMinutes / 60;

    return {
      mechanic,
      schedule: {
        workDays,
        startTime,
        endTime,
        totalHours,
      },
    };
  }

  async getStatistics(): Promise<{
    total: number;
    active: number;
    inactive: number;
    byExperienceLevel: Record<ExperienceLevel, number>;
    bySpecialty: Record<MechanicSpecialty, number>;
    averageExperience: number;
  }> {
    const mechanics = await this.mechanicRepository.find();
    
    const total = mechanics.length;
    const active = mechanics.filter(m => m.isActive && m.status === MechanicStatus.ACTIVE).length;
    const inactive = total - active;

    const byExperienceLevel = mechanics.reduce((acc, mechanic) => {
      acc[mechanic.experienceLevel] = (acc[mechanic.experienceLevel] || 0) + 1;
      return acc;
    }, {} as Record<ExperienceLevel, number>);

    const bySpecialty = {} as Record<MechanicSpecialty, number>;
    mechanics.forEach(mechanic => {
      if (mechanic.specialties) {
        mechanic.specialties.forEach(specialty => {
          bySpecialty[specialty] = (bySpecialty[specialty] || 0) + 1;
        });
      }
    });

    const totalExperience = mechanics.reduce((sum, mechanic) => sum + mechanic.yearsExperience, 0);
    const averageExperience = total > 0 ? totalExperience / total : 0;

    return {
      total,
      active,
      inactive,
      byExperienceLevel,
      bySpecialty,
      averageExperience: Math.round(averageExperience * 100) / 100,
    };
  }

  async findMechanicsByWorkDay(dayName: string): Promise<Mechanic[]> {
    return await this.mechanicRepository
      .createQueryBuilder('mechanic')
      .where('mechanic.workDays LIKE :dayName', {
        dayName: `%${dayName}%`,
      })
      .andWhere('mechanic.isActive = :isActive', { isActive: true })
      .andWhere('mechanic.status = :status', { status: MechanicStatus.ACTIVE })
      .getMany();
  }

  async searchMechanics(searchTerm: string): Promise<Mechanic[]> {
    return await this.mechanicRepository
      .createQueryBuilder('mechanic')
      .where('mechanic.firstName ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .orWhere('mechanic.lastName ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .orWhere('mechanic.employeeCode ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .andWhere('mechanic.isActive = :isActive', { isActive: true })
      .leftJoinAndSelect('mechanic.services', 'services')
      .getMany();
  }

  // Métodos adicionales especializados

  async assignMechanicToReservation(
    mechanicId: number,
    _reservationId: number,
  ): Promise<boolean> {
    const mechanic = await this.findOne(mechanicId);
    
    if (mechanic.status !== MechanicStatus.ACTIVE) {
      throw new BadRequestException('Mechanic is not available for assignments');
    }

    // Aquí se implementaría la lógica para asignar el mecánico a la reserva
    // Por ahora solo validamos que el mecánico esté disponible
    return true;
  }

  async getMechanicWorkload(mechanicId: number, _startDate: Date, _endDate: Date): Promise<{
    mechanic: Mechanic;
    totalReservations: number;
    pendingReservations: number;
    completedReservations: number;
    workloadPercentage: number;
  }> {
    const mechanic = await this.findOne(mechanicId);
    
    // Aquí se implementaría la lógica para calcular la carga de trabajo
    // usando las relaciones con Reservate
    const mockData = {
      mechanic,
      totalReservations: 15,
      pendingReservations: 5,
      completedReservations: 10,
      workloadPercentage: 75,
    };

    return mockData;
  }

  async getTopMechanicsByPerformance(limit: number = 5): Promise<{
    mechanic: Mechanic;
    completedJobs: number;
    averageRating: number;
    totalRevenue: number;
  }[]> {
    const mechanics = await this.mechanicRepository.find({
      where: { isActive: true },
      relations: ['services'],
      take: limit,
    });

    // Simulación de datos de rendimiento
    return mechanics.map((mechanic) => ({
      mechanic,
      completedJobs: Math.floor(Math.random() * 50) + 10,
      averageRating: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3.0 - 5.0
      totalRevenue: Math.floor(Math.random() * 10000) + 5000,
    }));
  }

  async updateMechanicSpecialties(
    mechanicId: number,
    specialties: MechanicSpecialty[],
  ): Promise<Mechanic> {
    const mechanic = await this.findOne(mechanicId);
    mechanic.specialties = specialties;
    await this.mechanicRepository.save(mechanic);
    return this.findOne(mechanicId);
  }

  async getMechanicsAvailableForDate(
    date: Date,
    requiredSpecialty?: MechanicSpecialty,
  ): Promise<Mechanic[]> {
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    
    let queryBuilder = this.mechanicRepository
      .createQueryBuilder('mechanic')
      .where('mechanic.status = :status', { status: MechanicStatus.ACTIVE })
      .andWhere('mechanic.isActive = :isActive', { isActive: true })
      .andWhere('mechanic.workDays LIKE :dayName', { dayName: `%${dayName}%` })
      .leftJoinAndSelect('mechanic.services', 'services');

    if (requiredSpecialty) {
      queryBuilder = queryBuilder.andWhere('mechanic.specialties LIKE :specialty', {
        specialty: `%${requiredSpecialty}%`,
      });
    }

    return await queryBuilder.getMany();
  }

  async generateMechanicReport(mechanicId: number): Promise<{
    mechanic: Mechanic;
    personalInfo: any;
    workSchedule: any;
    performance: any;
    specialties: MechanicSpecialty[];
  }> {
    const mechanic = await this.findOne(mechanicId);
    const workSchedule = await this.getWorkSchedule(mechanicId);

    return {
      mechanic,
      personalInfo: {
        fullName: `${mechanic.firstName} ${mechanic.lastName}`,
        employeeCode: mechanic.employeeCode,
        hireDate: mechanic.hireDate,
        yearsExperience: mechanic.yearsExperience,
        experienceLevel: mechanic.experienceLevel,
        phone: mechanic.phone,
      },
      workSchedule: workSchedule.schedule,
      performance: {
        status: mechanic.status,
        hourlyRate: mechanic.hourlyRate,
      },
      specialties: mechanic.specialties || [],
    };
  }
}