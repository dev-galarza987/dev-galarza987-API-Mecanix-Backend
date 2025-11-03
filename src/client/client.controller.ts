import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ClientService } from './client.service.js';
import { CreateClientDto } from './dto/create-client.dto.js';
import { UpdateClientDto } from './dto/update-client.dto.js';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('Clientes')
@Controller({ path: 'client/' })
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  /*
    Crear un nuevo cliente
  */
  @Post('create')
  @ApiOperation({ summary: 'Crear un nuevo cliente' })
  @ApiResponse({ status: 201, description: 'Cliente creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createClient: CreateClientDto) {
    return this.clientService.create(createClient);
  }

  /*
    Obtener todos los clientes
  */
  @Get()
  @ApiOperation({ summary: 'Obtener todos los clientes' })
  @ApiResponse({ status: 200, description: 'Lista de clientes obtenida exitosamente' })
  findAll() {
    return this.clientService.findAll();
  }

  /*
    Obtener solo clientes activos
  */
  @Get('active')
  @ApiOperation({ summary: 'Obtener solo clientes activos' })
  @ApiResponse({ status: 200, description: 'Lista de clientes activos' })
  findActiveClients() {
    return this.clientService.findActiveClients();
  }

  /*
    Obtener solo clientes inactivos
  */
  @Get('inactive')
  @ApiOperation({ summary: 'Obtener solo clientes inactivos' })
  @ApiResponse({ status: 200, description: 'Lista de clientes inactivos' })
  findInactiveClients() {
    return this.clientService.findInactiveClients();
  }

  /*
    Búsqueda general de clientes por término
  */
  @Get('search')
  @ApiOperation({ summary: 'Buscar clientes por término general' })
  @ApiQuery({ name: 'term', description: 'Término de búsqueda (nombre, apellido, email, teléfono)', example: 'Juan' })
  @ApiResponse({ status: 200, description: 'Resultados de la búsqueda' })
  searchClients(@Query('term') term: string) {
    return this.clientService.searchClients(term);
  }

  /*
    Métodos de búsqueda específicos
  */
  @Get('email/:email')
  @ApiOperation({ summary: 'Buscar cliente por email' })
  @ApiParam({ name: 'email', description: 'Email del cliente', example: 'juan@email.com' })
  @ApiResponse({ status: 200, description: 'Cliente encontrado' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  findByEmail(@Param('email') email: string) {
    return this.clientService.findByEmail(email);
  }

  /*
    Métodos de búsqueda específicos
  */
  @Get('phone/:phone')
  @ApiOperation({ summary: 'Buscar cliente por teléfono' })
  @ApiParam({ name: 'phone', description: 'Teléfono del cliente', example: '1234567890' })
  @ApiResponse({ status: 200, description: 'Cliente encontrado' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  findByPhone(@Param('phone') phone: string) {
    return this.clientService.findByPhone(phone);
  }

  /*
    Métodos de búsqueda específicos
  */
  @Get('ci/:ci')
  @ApiOperation({ summary: 'Buscar cliente por CI' })
  @ApiParam({ name: 'ci', description: 'Cédula de Identidad del cliente', example: 12345678 })
  @ApiResponse({ status: 200, description: 'Cliente encontrado' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  findByCI(@Param('ci', ParseIntPipe) ci: number) {
    return this.clientService.findByCI(ci);
  }

  /*
    Métodos de búsqueda específicos
  */
  @Get(':code')
  @ApiOperation({ summary: 'Obtener un cliente por código' })
  @ApiParam({ name: 'code', description: 'Código único del cliente', example: 1001 })
  @ApiResponse({ status: 200, description: 'Cliente encontrado' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  findOne(@Param('code', ParseIntPipe) code: number) {
    return this.clientService.findOne(code);
  }

  /*
    Métodos de búsqueda específicos
  */
  @Patch(':code/update')
  @ApiOperation({ summary: 'Actualizar un cliente existente' })
  @ApiParam({ name: 'code', description: 'Código único del cliente', example: 1001 })
  @ApiResponse({ status: 200, description: 'Cliente actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  update(
    @Param('code', ParseIntPipe) code: number,
    @Body() updateClient: UpdateClientDto,
  ) {
    return this.clientService.update(code, updateClient);
  }

  /*
    Eliminar un cliente
  */
  @Delete(':code/delete')
  @ApiOperation({ summary: 'Eliminar un cliente' })
  @ApiParam({ name: 'code', description: 'Código único del cliente', example: 1001 })
  @ApiResponse({ status: 200, description: 'Cliente eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  remove(@Param('code', ParseIntPipe) code: number) {
    return this.clientService.remove(code);
  }
}
