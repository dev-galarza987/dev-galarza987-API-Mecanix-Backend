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
import { getDatabaseConfig, validateDatabaseConfig } from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      ...getDatabaseConfig(),
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
export class AppModule {
  constructor() {
    // Validar configuración de base de datos al iniciar
    if (!validateDatabaseConfig()) {
      console.error('❌ Error en configuración de base de datos. Revisa las variables de entorno.');
      process.exit(1);
    }
  }
}
