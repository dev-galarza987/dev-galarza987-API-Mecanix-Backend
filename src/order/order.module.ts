import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order } from './entities/order.entity';
import { Reservate } from '../reservate/entities/reservate.entity';
import { Vehicle } from '../vehicle/entities/vehicle.entity';
import { Mechanic } from '../mechanic/entities/mechanic.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Reservate, Vehicle, Mechanic])],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
