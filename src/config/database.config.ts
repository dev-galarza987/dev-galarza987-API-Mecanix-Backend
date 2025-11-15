import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Client } from '../client/entities/client.entity';
import { Vehicle } from '../vehicle/entities/vehicle.entity';
import { Service } from '../service/entities/service.entity';
import { Reservate } from '../reservate/entities/reservate.entity';
import { ClientVehicle } from '../client-vehicle/entities/client-vehicle.entity';
import { Mechanic } from '../mechanic/entities/mechanic.entity';
import { Order } from '../order/entities/order.entity';

export const getDatabaseConfig = (): TypeOrmModuleOptions => {
  const environment = process.env.DB_ENVIRONMENT || 'local';
  
  console.log(`🔗 Configurando base de datos para entorno: ${environment.toUpperCase()}`);
  
  // Entidades que se registrarán en TypeORM
  const entities = [
    Client,
    Vehicle,
    Service,
    Reservate,
    ClientVehicle,
    Mechanic,
    Order,
  ];
  
  if (environment === 'supabase') {
    const config: TypeOrmModuleOptions = {
      type: 'postgres',
      host: process.env.DB_SUPABASE_HOST,
      port: parseInt(process.env.DB_SUPABASE_PORT || '5432', 10),
      username: process.env.DB_SUPABASE_USERNAME,
      password: process.env.DB_SUPABASE_PASSWORD,
      database: process.env.DB_SUPABASE_DATABASE,
      entities: entities,
      synchronize: true, // ⚠️ Solo para desarrollo
      ssl: {
        rejectUnauthorized: false, // Necesario para Supabase
      },
      extra: {
        max: 10, // Máximo de conexiones
        connectionTimeoutMillis: 30000,
        idleTimeoutMillis: 30000,
      },
      logging: false, // Cambiar a true si necesitas debug
    };
    
    console.log(`📡 Conectando a Supabase PostgreSQL:`);
    console.log(`   Host: ${config.host}`);
    console.log(`   Database: ${config.database}`);
    console.log(`   Port: ${config.port}`);
    
    return config;
  } else {
    // Configuración local por defecto
    const config: TypeOrmModuleOptions = {
      type: 'postgres',
      host: process.env.DB_LOCAL_HOST || '127.0.0.1',
      port: parseInt(process.env.DB_LOCAL_PORT || '5432', 10),
      username: process.env.DB_LOCAL_USERNAME || 'postgres',
      password: process.env.DB_LOCAL_PASSWORD,
      database: process.env.DB_LOCAL_DATABASE || 'MecanixDB',
      entities: entities,
      synchronize: true, // ⚠️ Solo para desarrollo
      // logging: true, // Cambiar a true si necesitas debug
    };
    
    console.log(`💻 Conectando a PostgreSQL local:`);
    console.log(`   Host: ${config.host}`);
    console.log(`   Database: ${config.database}`);
    console.log(`   Port: ${config.port}`);
    
    return config;
  }
};

// Función para validar la configuración de la base de datos
export const validateDatabaseConfig = (): boolean => {
  const environment = process.env.DB_ENVIRONMENT || 'local';
  
  if (environment === 'supabase') {
    const requiredVars = [
      'DB_SUPABASE_HOST',
      'DB_SUPABASE_USERNAME', 
      'DB_SUPABASE_PASSWORD',
      'DB_SUPABASE_DATABASE'
    ];
    
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.error(`❌ Variables de entorno faltantes para Supabase: ${missingVars.join(', ')}`);
      return false;
    }
  } else {
    const requiredVars = [
      'DB_LOCAL_HOST',
      'DB_LOCAL_USERNAME', 
      'DB_LOCAL_PASSWORD',
      'DB_LOCAL_DATABASE'
    ];
    
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.error(`❌ Variables de entorno faltantes para PostgreSQL local: ${missingVars.join(', ')}`);
      return false;
    }
  }
  
  return true;
};