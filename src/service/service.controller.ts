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
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@ApiTags('Servicios')
@Controller('service/')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Crear un nuevo servicio',
    description: 'Crea un nuevo servicio en el sistema'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Servicio creado exitosamente',
    type: CreateServiceDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Datos de entrada inválidos' 
  })
  @ApiBody({ 
    type: CreateServiceDto,
    description: 'Datos del servicio a crear'
  })
  create(@Body() createService: CreateServiceDto) {
    return this.serviceService.create(createService);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Obtener todos los servicios',
    description: 'Obtiene una lista de todos los servicios disponibles'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de servicios obtenida exitosamente' 
  })
  findAll() {
    return this.serviceService.findAll();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Obtener un servicio por ID',
    description: 'Obtiene un servicio específico mediante su ID'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID del servicio', 
    type: 'number',
    example: 1
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Servicio encontrado exitosamente' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Servicio no encontrado' 
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.serviceService.findOne(id);
  }

  @Patch(':id/update')
  @ApiOperation({ 
    summary: 'Actualizar un servicio',
    description: 'Actualiza los datos de un servicio existente'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID del servicio a actualizar', 
    type: 'number',
    example: 1
  })
  @ApiBody({ 
    type: UpdateServiceDto,
    description: 'Datos del servicio a actualizar'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Servicio actualizado exitosamente' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Servicio no encontrado' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Datos de entrada inválidos' 
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateService: UpdateServiceDto,
  ) {
    return this.serviceService.update(id, updateService);
  }

  @Delete(':id/delete')
  @ApiOperation({ 
    summary: 'Eliminar un servicio',
    description: 'Elimina un servicio del sistema'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID del servicio a eliminar', 
    type: 'number',
    example: 1
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Servicio eliminado exitosamente' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Servicio no encontrado' 
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.serviceService.remove(id);
  }
}
