import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import 'dotenv/config';

const configService = new ConfigService();

const isSupabase = configService.get('SUPABASE_DB_HOST')?.includes('supabase.co');

export default new DataSource({
  type: 'postgres',
  host: configService.get('SUPABASE_DB_HOST'),
  port: parseInt(configService.get('SUPABASE_DB_PORT', '5432'), 10),
  username: configService.get('DB_SUPABASE_USERNAME'),
  password: configService.get('DB_SUPABASE_PASSWORD'),
  database: configService.get('DB_SUPABASE_DATABASE'),
  schema: 'public',
  ssl: isSupabase ? { rejectUnauthorized: false } : false,
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/*{.ts,.js}'],
});
