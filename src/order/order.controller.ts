import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';

@ApiTags('Orders')
@Controller('order/')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('create')
  @ApiOperation({ summary: 'Crear una nueva orden de trabajo' })
  @ApiBody({ 
    type: CreateOrderDto,
    description: 'Datos para crear la orden de trabajo',
  })
  @ApiCreatedResponse({
    description: 'Orden de trabajo creada exitosamente',
    type: Order,
  })
  @ApiBadRequestResponse({
    description: 'Datos de entrada inválidos',
  })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createOrder: CreateOrderDto) {
    return this.orderService.create(createOrder);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las órdenes de trabajo' })
  @ApiResponse({
    status: 200,
    description: 'Lista de órdenes de trabajo obtenida exitosamente',
    type: [Order],
  })
  findAll() {
    return this.orderService.findAll();
  }

  @Get(':code/factus')
  @ApiOperation({ summary: 'Preparar orden para facturación con Factus' })
  @ApiParam({
    name: 'code',
    description: 'Código único de la orden de trabajo',
    example: 'ORD-2024-001',
  })
  @ApiResponse({
    status: 200,
    description: 'Datos preparados para facturación con Factus',
  })
  @ApiNotFoundResponse({
    description: 'Orden no encontrada',
  })
  async prepareForFactus(@Param('code') code: string) {
    return await this.orderService.prepareOrderForFactusByCode(code);
  }

  @Get(':code')
  @ApiOperation({ summary: 'Obtener orden de trabajo por código' })
  @ApiParam({
    name: 'code',
    description: 'Código único de la orden de trabajo',
    example: 'ORD-2024-001',
  })
  @ApiResponse({
    status: 200,
    description: 'Orden de trabajo encontrada exitosamente',
    type: Order,
  })
  @ApiNotFoundResponse({
    description: 'Orden no encontrada',
  })
  findByCode(@Param('code') code: string) {
    return this.orderService.findByCode(code);
  }

  @Patch(':code/update')
  @ApiOperation({ summary: 'Actualizar orden de trabajo por código' })
  @ApiParam({
    name: 'code',
    description: 'Código único de la orden de trabajo',
    example: 'ORD-2024-001',
  })
  @ApiBody({
    type: UpdateOrderDto,
    description: 'Datos para actualizar la orden de trabajo',
  })
  @ApiResponse({
    status: 200,
    description: 'Orden de trabajo actualizada exitosamente',
    type: Order,
  })
  @ApiNotFoundResponse({
    description: 'Orden no encontrada',
  })
  @ApiBadRequestResponse({
    description: 'Datos de entrada inválidos',
  })
  update(@Param('code') code: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.updateByCode(code, updateOrderDto);
  }

  @Delete(':code/delete')
  @ApiOperation({ summary: 'Eliminar orden de trabajo por código' })
  @ApiParam({
    name: 'code',
    description: 'Código único de la orden de trabajo',
    example: 'ORD-2024-001',
  })
  @ApiNoContentResponse({
    description: 'Orden de trabajo eliminada exitosamente',
  })
  @ApiNotFoundResponse({
    description: 'Orden no encontrada',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('code') code: string) {
    return this.orderService.removeByCode(code);
  }
}
