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
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('order/')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createOrder: CreateOrderDto) {
    return this.orderService.create(createOrder);
  }

  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @Get(':code/factus')
  async prepareForFactus(@Param('code') code: string) {
    return await this.orderService.prepareOrderForFactusByCode(code);
  }

  @Get(':code')
  findByCode(@Param('code') code: string) {
    return this.orderService.findByCode(code);
  }

  @Patch(':code/update')
  update(@Param('code') code: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.updateByCode(code, updateOrderDto);
  }

  @Delete(':code/delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('code') code: string) {
    return this.orderService.removeByCode(code);
  }
}
