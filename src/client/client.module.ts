import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Reservate } from '../reservate/entities/reservate.entity';
import { ClientVehicle } from '../client-vehicle/entities/client-vehicle.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Client, Reservate, ClientVehicle])],
  controllers: [ClientController],
  providers: [ClientService],
  exports: [TypeOrmModule],
})
export class ClientModule {}
