import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientModule } from './client/client.module';
import { VehicleModule } from './vehicle/vehicle.module';
import { ServiceModule } from './service/service.module';
import { ReservateModule } from './reservate/reservate.module';
import { MechanicModule } from './mechanic/mechanic.module';
import { ClientVehicleModule } from './client-vehicle/client-vehicle.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '127.0.0.1',
      port: 5432,
      username: 'postgres',
      password: '12413087',
      database: 'MecanixDB',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    ClientModule,
    VehicleModule,
    ServiceModule,
    ReservateModule,
    MechanicModule,
    ClientVehicleModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
