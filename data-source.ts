import { DataSource } from 'typeorm';
import { join } from 'path';
import { config } from 'dotenv';

// Cargar variables de entorno
config();

const environment = process.env.DB_ENVIRONMENT || 'local';

console.log(`🔧 Configurando migraciones para entorno: ${environment.toUpperCase()}`);

// Configuración según el entorno
let dataSourceConfig;

if (environment === 'supabase') {
  dataSourceConfig = {
    type: 'postgres' as const,
    host: process.env.DB_SUPABASE_HOST,
    port: parseInt(process.env.DB_SUPABASE_PORT || '5432', 10),
    username: process.env.DB_SUPABASE_USERNAME,
    password: process.env.DB_SUPABASE_PASSWORD,
    database: process.env.DB_SUPABASE_DATABASE,
    ssl: {
      rejectUnauthorized: false,
    },
    extra: {
      max: 10,
      connectionTimeoutMillis: 30000,
      idleTimeoutMillis: 30000,
    },
  };
  console.log(`📡 Migraciones para Supabase PostgreSQL`);
} else {
  dataSourceConfig = {
    type: 'postgres' as const,
    host: process.env.DB_LOCAL_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_LOCAL_PORT || '5432', 10),
    username: process.env.DB_LOCAL_USERNAME || 'postgres',
    password: process.env.DB_LOCAL_PASSWORD,
    database: process.env.DB_LOCAL_DATABASE || 'MecanixDB',
  };
  console.log(`💻 Migraciones para PostgreSQL local`);
}

const AppDataSource = new DataSource({
  ...dataSourceConfig,
  entities: [join(__dirname, 'src/**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, 'src/migrations/*.ts')],
  migrationsTableName: 'typeorm_migrations',
  synchronize: false, // ¡IMPORTANTE! Desactivar synchronize para usar migraciones
  logging: true,
});

export default AppDataSource;