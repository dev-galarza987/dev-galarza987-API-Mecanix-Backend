import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { CreateClientVehicleDto } from './dto/create-client-vehicle.dto';
import { UpdateClientVehicleDto } from './dto/update-client-vehicle.dto';
import { ClientVehicleResponseDto } from './dto/client-vehicle-response.dto';
import { ClientVehicleService } from './client-vehicle.service';

@ApiTags('Client-Vehicle')
@Controller('client-vehicle')
export class ClientVehicleController {
  constructor(private readonly clientVehicleService: ClientVehicleService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nueva relación cliente-vehículo' })
  @ApiBody({ type: CreateClientVehicleDto })
  @ApiResponse({
    status: 201,
    description: 'Relación creada exitosamente',
    type: ClientVehicleResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos o relación ya existe' })
  @ApiResponse({ status: 404, description: 'Cliente o vehículo no encontrado' })
  create(@Body() createClientVehicleDto: CreateClientVehicleDto) {
    return this.clientVehicleService.create(createClientVehicleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las relaciones cliente-vehículo' })
  @ApiResponse({
    status: 200,
    description: 'Lista de relaciones',
    type: [ClientVehicleResponseDto],
  })
  findAll() {
    return this.clientVehicleService.findAll();
  }

  @Get('client/:clientCode')
  @ApiOperation({ summary: 'Obtener vehículos de un cliente' })
  @ApiParam({ name: 'clientCode', description: 'Código del cliente', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Lista de vehículos del cliente',
    type: [ClientVehicleResponseDto],
  })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  findByClient(@Param('clientCode', ParseIntPipe) clientCode: number) {
    return this.clientVehicleService.findByClient(clientCode);
  }

  @Get('vehicle/:vehicleId')
  @ApiOperation({ summary: 'Obtener clientes de un vehículo' })
  @ApiParam({ name: 'vehicleId', description: 'ID del vehículo', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Lista de clientes del vehículo',
    type: [ClientVehicleResponseDto],
  })
  @ApiResponse({ status: 404, description: 'Vehículo no encontrado' })
  findByVehicle(@Param('vehicleId', ParseIntPipe) vehicleId: number) {
    return this.clientVehicleService.findByVehicle(vehicleId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una relación cliente-vehículo por ID' })
  @ApiParam({ name: 'id', description: 'ID de la relación', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Relación encontrada',
    type: ClientVehicleResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Relación no encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.clientVehicleService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una relación cliente-vehículo' })
  @ApiParam({ name: 'id', description: 'ID de la relación', type: Number })
  @ApiBody({ type: UpdateClientVehicleDto })
  @ApiResponse({
    status: 200,
    description: 'Relación actualizada exitosamente',
    type: ClientVehicleResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Relación no encontrada' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateClientVehicleDto: UpdateClientVehicleDto,
  ) {
    return this.clientVehicleService.update(id, updateClientVehicleDto);
  }

  @Patch(':id/set-primary')
  @ApiOperation({ summary: 'Establecer un vehículo como principal para el cliente' })
  @ApiParam({ name: 'id', description: 'ID de la relación', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Vehículo establecido como principal',
    type: ClientVehicleResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Relación no encontrada' })
  setPrimary(@Param('id', ParseIntPipe) id: number) {
    return this.clientVehicleService.setPrimary(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una relación cliente-vehículo' })
  @ApiParam({ name: 'id', description: 'ID de la relación', type: Number })
  @ApiResponse({ status: 204, description: 'Relación eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Relación no encontrada' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.clientVehicleService.remove(id);
  }
}
