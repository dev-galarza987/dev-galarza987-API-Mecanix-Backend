-- ================================================================
-- MIGRACIÓN COMPLETA: ACTUALIZAR TODAS LAS RESTRICCIONES FK
-- Objetivo: Permitir eliminaciones sin errores de violación FK
-- ================================================================

-- ================================================================
-- FASE 1: ACTUALIZAR TABLAS INTERMEDIAS (Many-to-Many)
-- ================================================================

-- 1.1 Actualizar tabla mechanic_services
-- Eliminar restricciones existentes
ALTER TABLE mechanic_services DROP CONSTRAINT IF EXISTS FK_mechanic_services_mechanic_id;
ALTER TABLE mechanic_services DROP CONSTRAINT IF EXISTS FK_mechanic_services_service_id;
ALTER TABLE mechanic_services DROP CONSTRAINT IF EXISTS mechanic_services_mechanic_id_fkey;
ALTER TABLE mechanic_services DROP CONSTRAINT IF EXISTS mechanic_services_service_id_fkey;
ALTER TABLE mechanic_services DROP CONSTRAINT IF EXISTS "FK_3c2eff14f521f952cf741d00c42";

-- Crear nuevas restricciones con CASCADE (elimina la relación cuando se elimina el registro padre)
ALTER TABLE mechanic_services 
ADD CONSTRAINT FK_mechanic_services_mechanic_id 
FOREIGN KEY (mechanic_id) 
REFERENCES mechanic(mechanic_id) 
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE mechanic_services 
ADD CONSTRAINT FK_mechanic_services_service_id 
FOREIGN KEY (service_id) 
REFERENCES service(service_id) 
ON DELETE CASCADE ON UPDATE CASCADE;

-- 1.2 Actualizar tabla reservate_service
-- Eliminar restricciones existentes
ALTER TABLE reservate_service DROP CONSTRAINT IF EXISTS FK_reservate_service_reservate_id;
ALTER TABLE reservate_service DROP CONSTRAINT IF EXISTS FK_reservate_service_service_id;
ALTER TABLE reservate_service DROP CONSTRAINT IF EXISTS reservate_service_reservate_id_fkey;
ALTER TABLE reservate_service DROP CONSTRAINT IF EXISTS reservate_service_service_id_fkey;

-- Crear nuevas restricciones con CASCADE
ALTER TABLE reservate_service 
ADD CONSTRAINT FK_reservate_service_reservate_id 
FOREIGN KEY (reservate_id) 
REFERENCES reservate(reservate_id) 
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE reservate_service 
ADD CONSTRAINT FK_reservate_service_service_id 
FOREIGN KEY (service_id) 
REFERENCES service(service_id) 
ON DELETE CASCADE ON UPDATE CASCADE;

-- ================================================================
-- FASE 2: ACTUALIZAR RELACIONES ManyToOne (ya hechas previamente)
-- ================================================================

-- 2.1 Tabla reservate (ya actualizada en migración anterior)
-- Verificar que estén aplicadas las restricciones correctas
ALTER TABLE reservate DROP CONSTRAINT IF EXISTS "FK_f12ed90ea192b020d0e41ded42b";
ALTER TABLE reservate DROP CONSTRAINT IF EXISTS FK_client_reservate;
ALTER TABLE reservate DROP CONSTRAINT IF EXISTS reservate_client_fkey;

-- Permitir NULL en clientId si no está permitido
ALTER TABLE reservate ALTER COLUMN "clientId" DROP NOT NULL;

-- Crear restricción con SET NULL para client
ALTER TABLE reservate 
ADD CONSTRAINT FK_reservate_client_id 
FOREIGN KEY ("clientId") 
REFERENCES client(client_id) 
ON DELETE SET NULL ON UPDATE CASCADE;

-- Actualizar restricción de mechanic_id
ALTER TABLE reservate DROP CONSTRAINT IF EXISTS FK_reservate_mechanic;
ALTER TABLE reservate DROP CONSTRAINT IF EXISTS reservate_mechanic_fkey;

-- Crear nueva restricción con SET NULL para mechanic
ALTER TABLE reservate 
ADD CONSTRAINT FK_reservate_mechanic_id 
FOREIGN KEY ("mechanicId") 
REFERENCES mechanic(mechanic_id) 
ON DELETE SET NULL ON UPDATE CASCADE;

-- 2.2 Tabla order (ya actualizada en migración anterior)
-- Permitir NULL en las columnas de FK de orders
ALTER TABLE "order" ALTER COLUMN reservate_id DROP NOT NULL;
ALTER TABLE "order" ALTER COLUMN vehicle_id DROP NOT NULL; 
ALTER TABLE "order" ALTER COLUMN mechanic_id DROP NOT NULL;

-- Eliminar restricciones existentes en order
ALTER TABLE "order" DROP CONSTRAINT IF EXISTS FK_order_reservate;
ALTER TABLE "order" DROP CONSTRAINT IF EXISTS FK_order_vehicle; 
ALTER TABLE "order" DROP CONSTRAINT IF EXISTS FK_order_mechanic;
ALTER TABLE "order" DROP CONSTRAINT IF EXISTS order_reservate_id_fkey;
ALTER TABLE "order" DROP CONSTRAINT IF EXISTS order_vehicle_id_fkey;
ALTER TABLE "order" DROP CONSTRAINT IF EXISTS order_mechanic_id_fkey;

-- Crear nuevas restricciones con SET NULL
ALTER TABLE "order" 
ADD CONSTRAINT FK_order_reservate_id 
FOREIGN KEY (reservate_id) 
REFERENCES reservate(reservate_id) 
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "order" 
ADD CONSTRAINT FK_order_vehicle_id 
FOREIGN KEY (vehicle_id) 
REFERENCES vehicle(vehicle_id) 
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "order" 
ADD CONSTRAINT FK_order_mechanic_id 
FOREIGN KEY (mechanic_id) 
REFERENCES mechanic(mechanic_id) 
ON DELETE SET NULL ON UPDATE CASCADE;

-- 2.3 Tabla client_vehicle (ya actualizada en migración anterior)
-- Permitir NULL en las columnas FK de client_vehicle
ALTER TABLE client_vehicle ALTER COLUMN client_code DROP NOT NULL;
ALTER TABLE client_vehicle ALTER COLUMN vehicle_id DROP NOT NULL;

-- Eliminar restricciones existentes en client_vehicle
ALTER TABLE client_vehicle DROP CONSTRAINT IF EXISTS FK_client_vehicle_client;
ALTER TABLE client_vehicle DROP CONSTRAINT IF EXISTS FK_client_vehicle_vehicle;
ALTER TABLE client_vehicle DROP CONSTRAINT IF EXISTS client_vehicle_client_code_fkey;
ALTER TABLE client_vehicle DROP CONSTRAINT IF EXISTS client_vehicle_vehicle_id_fkey;

-- Crear nuevas restricciones con SET NULL
ALTER TABLE client_vehicle 
ADD CONSTRAINT FK_client_vehicle_client_code 
FOREIGN KEY (client_code) 
REFERENCES client(client_code) 
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE client_vehicle 
ADD CONSTRAINT FK_client_vehicle_vehicle_id 
FOREIGN KEY (vehicle_id) 
REFERENCES vehicle(vehicle_id) 
ON DELETE SET NULL ON UPDATE CASCADE;

-- ================================================================
-- FASE 3: DOCUMENTACIÓN Y COMENTARIOS
-- ================================================================

-- Agregar comentarios para documentar las restricciones
COMMENT ON CONSTRAINT FK_mechanic_services_mechanic_id ON mechanic_services IS 'FK con CASCADE - elimina relación M2M cuando se elimina mecánico';
COMMENT ON CONSTRAINT FK_mechanic_services_service_id ON mechanic_services IS 'FK con CASCADE - elimina relación M2M cuando se elimina servicio';
COMMENT ON CONSTRAINT FK_reservate_service_reservate_id ON reservate_service IS 'FK con CASCADE - elimina relación M2M cuando se elimina reserva';
COMMENT ON CONSTRAINT FK_reservate_service_service_id ON reservate_service IS 'FK con CASCADE - elimina relación M2M cuando se elimina servicio';

COMMENT ON CONSTRAINT FK_reservate_client_id ON reservate IS 'FK con SET NULL - permite eliminar clientes sin afectar reservas';
COMMENT ON CONSTRAINT FK_reservate_mechanic_id ON reservate IS 'FK con SET NULL - permite eliminar mecánicos sin afectar reservas';
COMMENT ON CONSTRAINT FK_order_reservate_id ON "order" IS 'FK con SET NULL - permite eliminar reservas sin afectar órdenes';
COMMENT ON CONSTRAINT FK_order_vehicle_id ON "order" IS 'FK con SET NULL - permite eliminar vehículos sin afectar órdenes';
COMMENT ON CONSTRAINT FK_order_mechanic_id ON "order" IS 'FK con SET NULL - permite eliminar mecánicos sin afectar órdenes';
COMMENT ON CONSTRAINT FK_client_vehicle_client_code ON client_vehicle IS 'FK con SET NULL - permite eliminar clientes preservando relación vehículo';
COMMENT ON CONSTRAINT FK_client_vehicle_vehicle_id ON client_vehicle IS 'FK con SET NULL - permite eliminar vehículos preservando relación cliente';

-- ================================================================
-- FASE 4: VERIFICACIÓN FINAL
-- ================================================================

-- Consulta para verificar todas las restricciones FK actualizadas
SELECT 
    tc.table_name,
    tc.constraint_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    rc.delete_rule,
    rc.update_rule,
    CASE 
        WHEN rc.delete_rule = 'CASCADE' THEN '✅ CASCADE - Elimina relaciones'
        WHEN rc.delete_rule = 'SET NULL' THEN '✅ SET NULL - Preserva registros'
        WHEN rc.delete_rule = 'RESTRICT' THEN '❌ RESTRICT - Bloquea eliminación'
        WHEN rc.delete_rule = 'NO ACTION' THEN '❌ NO ACTION - Bloquea eliminación'
        ELSE '⚠️ Sin configurar'
    END as status
FROM 
    information_schema.table_constraints tc 
    JOIN information_schema.key_column_usage kcu 
      ON tc.constraint_name = kcu.constraint_name
    LEFT JOIN information_schema.constraint_column_usage ccu 
      ON tc.constraint_name = ccu.constraint_name
    LEFT JOIN information_schema.referential_constraints rc 
      ON tc.constraint_name = rc.constraint_name
WHERE 
    tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_name IN ('reservate', 'order', 'client_vehicle', 'mechanic_services', 'reservate_service')
ORDER BY tc.table_name, tc.constraint_name;

-- ================================================================
-- RESUMEN DE CAMBIOS
-- ================================================================
/*
TABLAS MANY-TO-MANY (Relaciones intermedias):
✅ mechanic_services: CASCADE - permite eliminar Service o Mechanic
✅ reservate_service: CASCADE - permite eliminar Reservate o Service

TABLAS MANY-TO-ONE (Referencias directas):
✅ reservate: SET NULL - preserva registros cuando se eliminan Client/Mechanic
✅ order: SET NULL - preserva registros cuando se eliminan Reservate/Vehicle/Mechanic  
✅ client_vehicle: SET NULL - preserva registros cuando se eliminan Client/Vehicle

COMPORTAMIENTO ESPERADO:
- Eliminar Service ✅: Remueve relaciones en mechanic_services y reservate_service
- Eliminar Mechanic ✅: Remueve relaciones en mechanic_services, SET NULL en reservate/order
- Eliminar Client ✅: SET NULL en reservate, client_vehicle
- Eliminar Vehicle ✅: SET NULL en order, client_vehicle  
- Eliminar Reservate ✅: Remueve relaciones en reservate_service, SET NULL en order

NO MÁS ERRORES DE FK! 🎉
*/