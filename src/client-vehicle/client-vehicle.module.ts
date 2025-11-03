import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientVehicleController } from './client-vehicle.controller';
import { Client } from '../client/entities/client.entity';
import { Vehicle } from '../vehicle/entities/vehicle.entity';
import { ClientVehicle } from './entities/client-vehicle.entity';
import { ClientVehicleService } from './client-vehicle.service';

@Module({
  imports: [TypeOrmModule.forFeature([ClientVehicle, Client, Vehicle])],
  controllers: [ClientVehicleController],
  providers: [ClientVehicleService],
  exports: [ClientVehicleService],
})
export class ClientVehicleModule {}
