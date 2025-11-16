import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientModule } from './client/client.module';
import { VehicleModule } from './vehicle/vehicle.module';
import { ServiceModule } from './service/service.module';
import { ReservateModule } from './reservate/reservate.module';
import { MechanicModule } from './mechanic/mechanic.module';
import { ClientVehicleModule } from './client-vehicle/client-vehicle.module';
import { OrderModule } from './order/order.module';
//import { getDatabaseConfig, validateDatabaseConfig } from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        // ...getDatabaseConfig(configService),
        type: 'postgres',
        host: config.get<string>('DB_SUPABASE_HOST'),
        port: parseInt(config.get<string>('DB_SUPABASE_PORT', '5432'), 10),
        username: config.get<string>('DB_SUPABASE_USERNAME'),
        password: config.get<string>('DB_SUPABASE_PASSWORD'),
        database: config.get<string>('DB_SUPABASE_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
        ssl: {
          rejectUnauthorized: false,
        }
      }),
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
    /*if (!validateDatabaseConfig()) {
      console.error('❌ Error en configuración de base de datos. Revisa las variables de entorno.');
      process.exit(1);
    }*/
  }
}
