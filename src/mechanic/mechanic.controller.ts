import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { MechanicService } from './mechanic.service.js';
import { CreateMechanicDto } from './dto/create-mechanic.dto.js';
import { UpdateMechanicDto } from './dto/update-mechanic.dto.js';
import { Mechanic } from './entities/mechanic.entity.js';
import {
  MechanicSpecialty,
  MechanicStatus,
  ExperienceLevel,
} from '../types/MechanicTypes.js';

@ApiTags('Mechanics')
@Controller('mechanic')
@UsePipes(new ValidationPipe({ transform: true }))
export class MechanicController {
  constructor(private readonly mechanicService: MechanicService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo mecánico' })
  @ApiBody({ type: CreateMechanicDto })
  @ApiResponse({
    status: 201,
    description: 'Mecánico creado exitosamente',
    type: Mechanic,
  })
  @ApiResponse({
    status: 409,
    description: 'El código de empleado ya existe',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
  })
  async create(@Body() createMechanic: CreateMechanicDto): Promise<void> {
    await this.mechanicService.create(createMechanic);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener lista de mecánicos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de mecánicos obtenida exitosamente',
  })
  async findAll() {
    return await this.mechanicService.findAll();
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Obtener estadísticas de mecánicos' })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas obtenidas exitosamente',
  })
  async getStatistics() {
    return await this.mechanicService.getStatistics();
  }

  @Get('available')
  @ApiOperation({ summary: 'Obtener mecánicos disponibles' })
  @ApiQuery({
    name: 'date',
    required: false,
    type: String,
    description: 'Fecha para verificar disponibilidad (YYYY-MM-DD)',
    example: '2024-01-15',
  })
  @ApiResponse({
    status: 200,
    description: 'Mecánicos disponibles obtenidos exitosamente',
    type: [Mechanic],
  })
  async findAvailable(@Query('date') date?: string): Promise<Mechanic[]> {
    return await this.mechanicService.findAvailable(date);
  }

  @Get('specialty/:specialty')
  @ApiOperation({ summary: 'Buscar mecánicos por especialidad' })
  @ApiParam({
    name: 'specialty',
    enum: MechanicSpecialty,
    description: 'Especialidad del mecánico',
  })
  @ApiResponse({
    status: 200,
    description: 'Mecánicos encontrados por especialidad',
    type: [Mechanic],
  })
  async findBySpecialty(
    @Param('specialty') specialty: MechanicSpecialty,
  ): Promise<Mechanic[]> {
    return await this.mechanicService.findBySpecialty(specialty);
  }

  @Get('experience/:level')
  @ApiOperation({ summary: 'Buscar mecánicos por nivel de experiencia' })
  @ApiParam({
    name: 'level',
    enum: ExperienceLevel,
    description: 'Nivel de experiencia del mecánico',
  })
  @ApiResponse({
    status: 200,
    description: 'Mecánicos encontrados por nivel de experiencia',
    type: [Mechanic],
  })
  async findByExperienceLevel(
    @Param('level') level: ExperienceLevel,
  ): Promise<Mechanic[]> {
    return await this.mechanicService.findByExperienceLevel(level);
  }

  @Get('workday/:day')
  @ApiOperation({ summary: 'Obtener mecánicos que trabajan en un día específico' })
  @ApiParam({
    name: 'day',
    type: String,
    description: 'Día de la semana (Monday, Tuesday, etc.)',
    example: 'Monday',
  })
  @ApiResponse({
    status: 200,
    description: 'Mecánicos que trabajan el día especificado',
    type: [Mechanic],
  })
  async findByWorkDay(@Param('day') day: string): Promise<Mechanic[]> {
    return await this.mechanicService.findMechanicsByWorkDay(day);
  }

  @Get('search')
  @ApiOperation({ summary: 'Buscar mecánicos por término de búsqueda' })
  @ApiQuery({
    name: 'q',
    type: String,
    description: 'Término de búsqueda (nombre, apellido, código de empleado)',
    example: 'Juan',
  })
  @ApiResponse({
    status: 200,
    description: 'Mecánicos encontrados',
    type: [Mechanic],
  })
  async searchMechanics(@Query('q') searchTerm: string): Promise<Mechanic[]> {
    return await this.mechanicService.searchMechanics(searchTerm);
  }

  @Get(':code')
  @ApiOperation({ summary: 'Buscar mecánico por código de empleado' })
  @ApiParam({
    name: 'code',
    type: String,
    description: 'Código único del empleado',
    example: 'MEC001',
  })
  @ApiResponse({
    status: 200,
    description: 'Mecánico encontrado',
    type: Mechanic,
  })
  @ApiResponse({
    status: 404,
    description: 'Mecánico no encontrado',
  })
  async findByEmployeeCode(@Param('code') code: string): Promise<Mechanic> {
    return await this.mechanicService.findByEmployeeCode(code);
  }

  @Get(':code/schedule')
  @ApiOperation({ summary: 'Obtener horario de trabajo de un mecánico' })
  @ApiParam({
    name: 'code',
    type: String,
    description: 'Código único del empleado mecánico',
    example: 'MEC001',
  })
  @ApiResponse({
    status: 200,
    description: 'Horario de trabajo obtenido exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Mecánico no encontrado',
  })
  async getWorkSchedule(@Param('code') code: string) {
    return await this.mechanicService.getWorkScheduleByCode(code);
  }

  @Get(':code')
  @ApiOperation({ summary: 'Obtener un mecánico por código' })
  @ApiParam({
    name: 'code',
    type: String,
    description: 'Código único del empleado mecánico',
    example: 'MECH001',
  })
  @ApiResponse({
    status: 200,
    description: 'Mecánico encontrado',
    type: Mechanic,
  })
  @ApiResponse({
    status: 404,
    description: 'Mecánico no encontrado',
  })
  async findOne(@Param('code') code: string): Promise<Mechanic> {
    return await this.mechanicService.findByEmployeeCode(code);
  }

  @Patch(':code/update')
  @ApiOperation({ summary: 'Actualizar información de un mecánico' })
  @ApiParam({
    name: 'code',
    type: String,
    description: 'Código único del empleado mecánico',
    example: 'MEC001',
  })
  @ApiBody({ type: UpdateMechanicDto })
  @ApiResponse({
    status: 200,
    description: 'Mecánico actualizado exitosamente',
    type: Mechanic,
  })
  @ApiResponse({
    status: 404,
    description: 'Mecánico no encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'El código de empleado ya existe',
  })
  async update(
    @Param('code') code: string,
    @Body() updateMechanic: UpdateMechanicDto,
  ): Promise<Mechanic> {
    return await this.mechanicService.updateByCode(code, updateMechanic);
  }

  @Patch(':code/status')
  @ApiOperation({ summary: 'Actualizar estado de un mecánico' })
  @ApiParam({
    name: 'code',
    type: String,
    description: 'Código único del empleado mecánico',
    example: 'MEC001',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: Object.values(MechanicStatus),
          example: MechanicStatus.ACTIVE,
        },
      },
      required: ['status'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Estado del mecánico actualizado exitosamente',
    type: Mechanic,
  })
  @ApiResponse({
    status: 404,
    description: 'Mecánico no encontrado',
  })
  async updateStatus(
    @Param('code') code: string,
    @Body('status') status: MechanicStatus,
  ): Promise<Mechanic> {
    return await this.mechanicService.updateStatusByCode(code, status);
  }

  @Delete(':code/delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un mecánico (soft delete)' })
  @ApiParam({
    name: 'code',
    type: String,
    description: 'Código único del empleado mecánico',
    example: 'MEC001',
  })
  @ApiResponse({
    status: 204,
    description: 'Mecánico eliminado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Mecánico no encontrado',
  })
  async remove(@Param('code') code: string): Promise<void> {
    return await this.mechanicService.removeByCode(code);
  }
}