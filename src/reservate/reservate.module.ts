import { Module } from '@nestjs/common';
import { ReservateService } from './reservate.service';
import { ReservateController } from './reservate.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservate } from './entities/reservate.entity';
import { Client } from 'src/client/entities/client.entity';
import { Service } from 'src/service/entities/service.entity';
import { ClientModule } from 'src/client/client.module';
import { ServiceModule } from 'src/service/service.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservate, Client, Service]),
    ClientModule,
    ServiceModule,
  ],
  controllers: [ReservateController],
  providers: [ReservateService],
})
export class ReservateModule {}