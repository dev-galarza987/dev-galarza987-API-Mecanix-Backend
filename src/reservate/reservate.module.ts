import { Module } from '@nestjs/common';
import { ReservateService } from './reservate.service';
import { ReservateController } from './reservate.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservate } from './entities/reservate.entity';
import { Client } from '../client/entities/client.entity';
import { Service } from '../service/entities/service.entity';
import { Mechanic } from '../mechanic/entities/mechanic.entity';
import { ClientModule } from '../client/client.module';
import { ServiceModule } from '../service/service.module';
import { MechanicModule } from '../mechanic/mechanic.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservate, Client, Service, Mechanic]),
    ClientModule,
    ServiceModule,
    MechanicModule,
  ],
  controllers: [ReservateController],
  providers: [ReservateService],
})
export class ReservateModule {}