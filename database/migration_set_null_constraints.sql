-- Migración para actualizar restricciones de clave foránea
-- Permite eliminación con SET NULL en lugar de RESTRICT

-- 1. Actualizar restricciones en tabla reservate

-- Eliminar restricción actual de client_id si existe
ALTER TABLE reservate DROP CONSTRAINT IF EXISTS "FK_f12ed90ea192b020d0e41ded42b";
ALTER TABLE reservate DROP CONSTRAINT IF EXISTS FK_client_reservate;
ALTER TABLE reservate DROP CONSTRAINT IF EXISTS reservate_client_fkey;

-- Permitir NULL en clientId
ALTER TABLE reservate ALTER COLUMN "clientId" DROP NOT NULL;

-- Crear nueva restricción con SET NULL
ALTER TABLE reservate 
ADD CONSTRAINT FK_reservate_client_id 
FOREIGN KEY ("clientId") 
REFERENCES client(client_id) 
ON DELETE SET NULL ON UPDATE CASCADE;

-- Actualizar restricción de mechanic_id
ALTER TABLE reservate DROP CONSTRAINT IF EXISTS FK_reservate_mechanic;
ALTER TABLE reservate DROP CONSTRAINT IF EXISTS reservate_mechanic_fkey;

-- La columna mechanicId ya permite NULL
-- Crear nueva restricción con SET NULL para mechanic
ALTER TABLE reservate 
ADD CONSTRAINT FK_reservate_mechanic_id 
FOREIGN KEY ("mechanicId") 
REFERENCES mechanic(mechanic_id) 
ON DELETE SET NULL ON UPDATE CASCADE;

-- 2. Actualizar restricciones en tabla order

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

-- 3. Actualizar restricciones en tabla client_vehicle

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

-- 4. Comentarios para documentar los cambios
COMMENT ON CONSTRAINT FK_reservate_client_id ON reservate IS 'FK con SET NULL - permite eliminar clientes sin afectar reservas';
COMMENT ON CONSTRAINT FK_reservate_mechanic_id ON reservate IS 'FK con SET NULL - permite eliminar mecánicos sin afectar reservas';
COMMENT ON CONSTRAINT FK_order_reservate_id ON "order" IS 'FK con SET NULL - permite eliminar reservas sin afectar órdenes';
COMMENT ON CONSTRAINT FK_order_vehicle_id ON "order" IS 'FK con SET NULL - permite eliminar vehículos sin afectar órdenes';
COMMENT ON CONSTRAINT FK_order_mechanic_id ON "order" IS 'FK con SET NULL - permite eliminar mecánicos sin afectar órdenes';
COMMENT ON CONSTRAINT FK_client_vehicle_client_code ON client_vehicle IS 'FK con SET NULL - permite eliminar clientes preservando relación vehículo';
COMMENT ON CONSTRAINT FK_client_vehicle_vehicle_id ON client_vehicle IS 'FK con SET NULL - permite eliminar vehículos preservando relación cliente';

-- Verificar las restricciones actualizadas
SELECT 
    tc.table_name, 
    tc.constraint_name, 
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    rc.delete_rule,
    rc.update_rule
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
    AND tc.table_name IN ('reservate', 'order', 'client_vehicle')
ORDER BY tc.table_name, tc.constraint_name;