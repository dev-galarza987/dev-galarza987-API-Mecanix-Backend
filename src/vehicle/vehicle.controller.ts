import {
  Controller,
  Post,
  Body,
  Get,
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
import { VehicleService } from './vehicle.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@ApiTags('Vehiculos')
@Controller('vehicle/')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post('/create')
  @ApiOperation({ summary: 'Crear un nuevo vehículo' })
  @ApiResponse({
    status: 201,
    description: 'Vehículo creado exitosamente.',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos.',
  })
  @ApiBody({ type: CreateVehicleDto })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createVehicle: CreateVehicleDto) {
    return this.vehicleService.create(createVehicle);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los vehículos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de vehículos obtenida exitosamente.',
  })
  findAll() {
    return this.vehicleService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un vehículo por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID del vehículo',
    type: 'number',
  })
  @ApiResponse({
    status: 200,
    description: 'Vehículo encontrado.',
  })
  @ApiResponse({
    status: 404,
    description: 'Vehículo no encontrado.',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.vehicleService.findOne(id);
  }

  @Patch(':id/update')
  @ApiOperation({ summary: 'Actualizar un vehículo' })
  @ApiParam({
    name: 'id',
    description: 'ID del vehículo a actualizar',
    type: 'number',
  })
  @ApiBody({ type: UpdateVehicleDto })
  @ApiResponse({
    status: 200,
    description: 'Vehículo actualizado exitosamente.',
  })
  @ApiResponse({
    status: 404,
    description: 'Vehículo no encontrado.',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVehicle: UpdateVehicleDto,
  ) {
    return this.vehicleService.update(id, updateVehicle);
  }

  @Delete(':id/delete')
  @ApiOperation({ summary: 'Eliminar un vehículo' })
  @ApiParam({
    name: 'id',
    description: 'ID del vehículo a eliminar',
    type: 'number',
  })
  @ApiResponse({
    status: 200,
    description: 'Vehículo eliminado exitosamente.',
  })
  @ApiResponse({
    status: 404,
    description: 'Vehículo no encontrado.',
  })
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.vehicleService.remove(id);
  }
}
