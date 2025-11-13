# Configuración de Bases de Datos

Este proyecto está configurado para usar tanto PostgreSQL local como Supabase en la nube de manera flexible.

## Configuración de Variables de Entorno

El archivo `.env` contiene configuraciones para ambas bases de datos:

```bash
# Selector de base de datos (cambiar entre 'local' y 'supabase')
DB_ENVIRONMENT=supabase

# Configuración Base de Datos Local
DB_LOCAL_TYPE=postgres
DB_LOCAL_HOST=127.0.0.1
DB_LOCAL_PORT=5432
DB_LOCAL_USERNAME=victor
DB_LOCAL_PASSWORD=1234
DB_LOCAL_DATABASE=MecanixDB

# Configuración Base de Datos Supabase
DB_SUPABASE_TYPE=postgres
DB_SUPABASE_HOST=db.ydygsmhxxxrgwhumwqfc.supabase.co
DB_SUPABASE_PORT=5432
DB_SUPABASE_USERNAME=postgres
DB_SUPABASE_PASSWORD=[tu-password-de-supabase]
DB_SUPABASE_DATABASE=postgres
```

## Cambio de Base de Datos

### Método 1: Cambiar variable en .env
Edita el archivo `.env` y cambia la variable `DB_ENVIRONMENT`:
- Para usar base de datos local: `DB_ENVIRONMENT=local`
- Para usar Supabase: `DB_ENVIRONMENT=supabase`

### Método 2: Usar scripts npm
El proyecto incluye scripts que automáticamente usan la base de datos especificada:

```bash
# Ejecutar con base de datos local
npm run dev:local
npm run start:local

# Ejecutar con base de datos Supabase
npm run dev:supabase
npm run start:supabase
```

## Aplicar Datos Semilla

Una vez configurada la base de datos, puedes aplicar los datos semilla:

1. **Para base de datos local:**
   ```bash
   # Cambiar a modo local
   DB_ENVIRONMENT=local npm run start:dev
   
   # En otra terminal, aplicar seed
   psql -h 127.0.0.1 -p 5432 -U victor -d MecanixDB -f database/seed.sql
   ```

2. **Para Supabase:**
   ```bash
   # Cambiar a modo Supabase
   DB_ENVIRONMENT=supabase npm run start:dev
   
   # Aplicar seed usando el cliente SQL de Supabase o pgAdmin
   ```

## Validación de la Configuración

El sistema automáticamente validará la configuración al iniciar:
- Verificará que todas las variables requeridas estén definidas
- Mostrará qué base de datos está siendo utilizada
- Reportará errores de configuración si faltan variables

## Estructura de Archivos

- `src/config/database.config.ts`: Configuración dinámica de la base de datos
- `database/seed.sql`: Datos semilla con soporte para SET NULL
- `database/validate-seed.sql`: Script de validación de datos
- `.env`: Variables de entorno para ambas configuraciones

## Características del Sistema

1. **Flexibilidad**: Cambio fácil entre local y cloud
2. **Validación**: Verificación automática de configuración
3. **SSL**: Soporte automático para conexiones SSL en Supabase
4. **Scripts**: Comandos npm para cada entorno
5. **Datos de Prueba**: Seed completo con relaciones SET NULL

## Resolución de Problemas

Si encuentras errores de conexión:

1. Verifica que las variables de entorno estén correctamente configuradas
2. Para Supabase, asegúrate de que la IP esté en la lista blanca
3. Para PostgreSQL local, verifica que el servicio esté corriendo
4. Revisa los logs de la aplicación para mensajes de error específicos

## Comandos Útiles

```bash
# Verificar configuración actual
npm run start:dev

# Cambiar rápidamente a local
npm run dev:local

# Cambiar rápidamente a Supabase
npm run dev:supabase

# Instalar dependencias si es necesario
npm install
```