# 🚀 Guía de Migración a Supabase

## 📋 Resumen del Proceso Completado

### ✅ Configuración de Migraciones Automáticas
- Sistema de migraciones TypeORM configurado
- Migración inicial `InitialSchema1763245258748` creada y ejecutada
- Base de datos local validada con esquema completo

### 🔧 Archivos Configurados
1. **`data-source.ts`**: Configuración para CLI de TypeORM con soporte dual (local/Supabase)
2. **`src/config/database.config.ts`**: Configuración de aplicación con migraciones habilitadas
3. **`package.json`**: Scripts para gestión de migraciones
4. **Migración inicial**: Esquema completo capturado en `src/migrations/`

## 🎯 Próximos Pasos para Migrar a Supabase

### 1. Preparar Variables de Entorno
Actualiza tu archivo `.env` con las credenciales de Supabase:

```env
# Cambiar el entorno a Supabase
DB_ENVIRONMENT=supabase

# Credenciales de Supabase (ya configuradas)
DB_SUPABASE_HOST=aws-0-us-west-1.pooler.supabase.com
DB_SUPABASE_PORT=6543
DB_SUPABASE_USERNAME=postgres.frlopknvbtducvbwceex
DB_SUPABASE_PASSWORD=9GV$PbZKNpEg&h@
DB_SUPABASE_DATABASE=postgres
```

### 2. Ejecutar Migración en Supabase
```bash
# Cambiar entorno
set DB_ENVIRONMENT=supabase

# Ejecutar migración
npm run migration:run
```

### 3. Verificar la Migración
```bash
# Ver estado de migraciones
npm run migration:show

# Si es necesario generar una nueva migración
npm run migration:generate src/migrations/NombreMigracion
```

### 4. Iniciar Aplicación con Supabase
```bash
# Modo desarrollo con Supabase
npm run start:dev

# Modo producción
npm run build
npm run start:prod
```

## 🔄 Comandos de Migración Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run migration:generate src/migrations/Nombre` | Genera una nueva migración |
| `npm run migration:run` | Ejecuta migraciones pendientes |
| `npm run migration:revert` | Revierte la última migración |
| `npm run migration:show` | Muestra estado de migraciones |

## ⚠️ Consideraciones Importantes

### Antes de la Migración
- ✅ **Backup de datos**: Exporta datos importantes de tu BD local
- ✅ **Validación**: La migración inicial está probada y funcional
- ✅ **Variables de entorno**: Supabase configurado en `.env`

### Durante la Migración  
- 🔄 **Sincronización deshabilitada**: `synchronize: false` en producción
- 🔄 **Migraciones automáticas**: `migrationsRun: true` ejecuta al iniciar
- 🔄 **SSL habilitado**: Configurado para conexiones seguras a Supabase

### Después de la Migración
- ✅ **Verificar conexión**: La aplicación debe conectar exitosamente
- ✅ **Probar endpoints**: Todos los módulos deben funcionar
- ✅ **Monitoreo**: Revisar logs de conexión y consultas

## 🗂️ Estructura del Esquema Migrado

El esquema incluye:

### Tablas Principales
- `client` - Gestión de clientes
- `mechanic` - Gestión de mecánicos  
- `vehicle` - Gestión de vehículos
- `service` - Catálogo de servicios
- `reservate` - Sistema de reservas
- `order` - Órdenes de trabajo y facturación

### Tablas de Relación
- `client_vehicle` - Relación cliente-vehículo
- `mechanic_services` - Servicios por mecánico
- `reservate_service` - Servicios por reserva

### Tipos ENUM
- Estados, roles, métodos de pago, y más

### Procedimientos Almacenados
- `sp_insert_client`, `sp_insert_service`, `sp_insert_vehicle`

## 🚨 Solución de Problemas

### Error de Conexión a Supabase
```bash
# Verificar variables de entorno
echo $DB_ENVIRONMENT
echo $DB_SUPABASE_HOST

# Probar conexión manual
npx typeorm-ts-node-commonjs migration:show -d data-source.ts
```

### Error de Migración Duplicada
```bash
# Ver migraciones existentes
npm run migration:show

# Si es necesario, revertir migración
npm run migration:revert
```

### Error de Esquema
```bash
# Generar migración diferencial
npm run migration:generate src/migrations/FixSchema

# Aplicar cambios
npm run migration:run
```

## ✨ Resultado Final

Una vez completada la migración tendrás:

- ✅ **Base de datos en la nube**: PostgreSQL en Supabase
- ✅ **Migraciones versionadas**: Control total del esquema
- ✅ **Escalabilidad**: Infraestructura preparada para producción
- ✅ **Respaldos automáticos**: Incluidos con Supabase
- ✅ **Monitoreo**: Dashboard de Supabase disponible

¡Tu API estará lista para producción! 🎉