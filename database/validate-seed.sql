-- =============================================
-- SCRIPT DE VALIDACIÓN DE INTEGRIDAD DE DATOS
-- API MECANIX - PostgreSQL
-- =============================================
-- Este script verifica la consistencia de los datos semilla
-- con las entidades TypeORM y constraints SET NULL

-- =============================================
-- 1. VERIFICACIONES DE ENTIDADES PRINCIPALES
-- =============================================

-- Verificar códigos únicos en clientes
SELECT 'VALIDACIÓN: Códigos únicos de clientes' as validation_type,
       COUNT(*) as total_records,
       COUNT(DISTINCT client_code) as unique_codes,
       CASE 
           WHEN COUNT(*) = COUNT(DISTINCT client_code) THEN '✅ CORRECTO'
           ELSE '❌ ERROR: Códigos duplicados'
       END as status
FROM client;

-- Verificar CIs únicos (excluyendo NULLs)
SELECT 'VALIDACIÓN: CIs únicos de clientes' as validation_type,
       COUNT(*) as total_records_with_ci,
       COUNT(DISTINCT ci) as unique_cis,
       CASE 
           WHEN COUNT(*) = COUNT(DISTINCT ci) THEN '✅ CORRECTO'
           ELSE '❌ ERROR: CIs duplicados'
       END as status
FROM client WHERE ci IS NOT NULL;

-- Verificar teléfonos únicos
SELECT 'VALIDACIÓN: Teléfonos únicos de clientes' as validation_type,
       COUNT(*) as total_records,
       COUNT(DISTINCT phone) as unique_phones,
       CASE 
           WHEN COUNT(*) = COUNT(DISTINCT phone) THEN '✅ CORRECTO'
           ELSE '❌ ERROR: Teléfonos duplicados'
       END as status
FROM client;

-- Verificar emails únicos (excluyendo NULLs)
SELECT 'VALIDACIÓN: Emails únicos de clientes' as validation_type,
       COUNT(*) as total_records_with_email,
       COUNT(DISTINCT email) as unique_emails,
       CASE 
           WHEN COUNT(*) = COUNT(DISTINCT email) THEN '✅ CORRECTO'
           ELSE '❌ ERROR: Emails duplicados'
       END as status
FROM client WHERE email IS NOT NULL;

-- Verificar placas únicas de vehículos
SELECT 'VALIDACIÓN: Placas únicas de vehículos' as validation_type,
       COUNT(*) as total_records,
       COUNT(DISTINCT board) as unique_boards,
       CASE 
           WHEN COUNT(*) = COUNT(DISTINCT board) THEN '✅ CORRECTO'
           ELSE '❌ ERROR: Placas duplicadas'
       END as status
FROM vehicle;

-- Verificar códigos únicos de empleados mecánicos
SELECT 'VALIDACIÓN: Códigos únicos de mecánicos' as validation_type,
       COUNT(*) as total_records,
       COUNT(DISTINCT employee_code) as unique_codes,
       CASE 
           WHEN COUNT(*) = COUNT(DISTINCT employee_code) THEN '✅ CORRECTO'
           ELSE '❌ ERROR: Códigos duplicados'
       END as status
FROM mechanic;

-- Verificar códigos únicos de servicios
SELECT 'VALIDACIÓN: Códigos únicos de servicios' as validation_type,
       COUNT(*) as total_records,
       COUNT(DISTINCT code) as unique_codes,
       CASE 
           WHEN COUNT(*) = COUNT(DISTINCT code) THEN '✅ CORRECTO'
           ELSE '❌ ERROR: Códigos duplicados'
       END as status
FROM service;

-- =============================================
-- 2. VALIDACIONES DE RELACIONES CON SET NULL
-- =============================================

-- Verificar relaciones en reservate (client y mechanic pueden ser NULL)
SELECT 'VALIDACIÓN: Reservaciones con cliente válido o NULL' as validation_type,
       COUNT(*) as total_reservations,
       SUM(CASE WHEN client IS NULL THEN 1 ELSE 0 END) as null_clients,
       SUM(CASE WHEN client IS NOT NULL AND EXISTS(SELECT 1 FROM client c WHERE c.id = reservate.client) THEN 1 ELSE 0 END) as valid_clients,
       CASE 
           WHEN COUNT(*) = SUM(CASE WHEN client IS NULL THEN 1 ELSE 0 END) + SUM(CASE WHEN client IS NOT NULL AND EXISTS(SELECT 1 FROM client c WHERE c.id = reservate.client) THEN 1 ELSE 0 END) 
           THEN '✅ CORRECTO'
           ELSE '❌ ERROR: Referencias inválidas'
       END as status
FROM reservate;

SELECT 'VALIDACIÓN: Reservaciones con mecánico válido o NULL' as validation_type,
       COUNT(*) as total_reservations,
       SUM(CASE WHEN mechanic IS NULL THEN 1 ELSE 0 END) as null_mechanics,
       SUM(CASE WHEN mechanic IS NOT NULL AND EXISTS(SELECT 1 FROM mechanic m WHERE m.id = reservate.mechanic) THEN 1 ELSE 0 END) as valid_mechanics,
       CASE 
           WHEN COUNT(*) = SUM(CASE WHEN mechanic IS NULL THEN 1 ELSE 0 END) + SUM(CASE WHEN mechanic IS NOT NULL AND EXISTS(SELECT 1 FROM mechanic m WHERE m.id = reservate.mechanic) THEN 1 ELSE 0 END) 
           THEN '✅ CORRECTO'
           ELSE '❌ ERROR: Referencias inválidas'
       END as status
FROM reservate;

-- Verificar relaciones en order (reservate_id, vehicle_id, mechanic_id pueden ser NULL)
SELECT 'VALIDACIÓN: Órdenes con reserva válida o NULL' as validation_type,
       COUNT(*) as total_orders,
       SUM(CASE WHEN reservate_id IS NULL THEN 1 ELSE 0 END) as null_reservates,
       SUM(CASE WHEN reservate_id IS NOT NULL AND EXISTS(SELECT 1 FROM reservate r WHERE r.id = "order".reservate_id) THEN 1 ELSE 0 END) as valid_reservates,
       CASE 
           WHEN COUNT(*) = SUM(CASE WHEN reservate_id IS NULL THEN 1 ELSE 0 END) + SUM(CASE WHEN reservate_id IS NOT NULL AND EXISTS(SELECT 1 FROM reservate r WHERE r.id = "order".reservate_id) THEN 1 ELSE 0 END) 
           THEN '✅ CORRECTO'
           ELSE '❌ ERROR: Referencias inválidas'
       END as status
FROM "order";

SELECT 'VALIDACIÓN: Órdenes con vehículo válido o NULL' as validation_type,
       COUNT(*) as total_orders,
       SUM(CASE WHEN vehicle_id IS NULL THEN 1 ELSE 0 END) as null_vehicles,
       SUM(CASE WHEN vehicle_id IS NOT NULL AND EXISTS(SELECT 1 FROM vehicle v WHERE v.id = "order".vehicle_id) THEN 1 ELSE 0 END) as valid_vehicles,
       CASE 
           WHEN COUNT(*) = SUM(CASE WHEN vehicle_id IS NULL THEN 1 ELSE 0 END) + SUM(CASE WHEN vehicle_id IS NOT NULL AND EXISTS(SELECT 1 FROM vehicle v WHERE v.id = "order".vehicle_id) THEN 1 ELSE 0 END) 
           THEN '✅ CORRECTO'
           ELSE '❌ ERROR: Referencias inválidas'
       END as status
FROM "order";

SELECT 'VALIDACIÓN: Órdenes con mecánico válido o NULL' as validation_type,
       COUNT(*) as total_orders,
       SUM(CASE WHEN mechanic_id IS NULL THEN 1 ELSE 0 END) as null_mechanics,
       SUM(CASE WHEN mechanic_id IS NOT NULL AND EXISTS(SELECT 1 FROM mechanic m WHERE m.id = "order".mechanic_id) THEN 1 ELSE 0 END) as valid_mechanics,
       CASE 
           WHEN COUNT(*) = SUM(CASE WHEN mechanic_id IS NULL THEN 1 ELSE 0 END) + SUM(CASE WHEN mechanic_id IS NOT NULL AND EXISTS(SELECT 1 FROM mechanic m WHERE m.id = "order".mechanic_id) THEN 1 ELSE 0 END) 
           THEN '✅ CORRECTO'
           ELSE '❌ ERROR: Referencias inválidas'
       END as status
FROM "order";

-- Verificar relaciones en client_vehicle (client_code y vehicle_id pueden ser NULL)
SELECT 'VALIDACIÓN: Cliente-Vehículo con cliente válido o NULL' as validation_type,
       COUNT(*) as total_relations,
       SUM(CASE WHEN client_code IS NULL THEN 1 ELSE 0 END) as null_clients,
       SUM(CASE WHEN client_code IS NOT NULL AND EXISTS(SELECT 1 FROM client c WHERE c.code = client_vehicle.client_code) THEN 1 ELSE 0 END) as valid_clients,
       CASE 
           WHEN COUNT(*) = SUM(CASE WHEN client_code IS NULL THEN 1 ELSE 0 END) + SUM(CASE WHEN client_code IS NOT NULL AND EXISTS(SELECT 1 FROM client c WHERE c.code = client_vehicle.client_code) THEN 1 ELSE 0 END) 
           THEN '✅ CORRECTO'
           ELSE '❌ ERROR: Referencias inválidas'
       END as status
FROM client_vehicle;

SELECT 'VALIDACIÓN: Cliente-Vehículo con vehículo válido o NULL' as validation_type,
       COUNT(*) as total_relations,
       SUM(CASE WHEN vehicle_id IS NULL THEN 1 ELSE 0 END) as null_vehicles,
       SUM(CASE WHEN vehicle_id IS NOT NULL AND EXISTS(SELECT 1 FROM vehicle v WHERE v.id = client_vehicle.vehicle_id) THEN 1 ELSE 0 END) as valid_vehicles,
       CASE 
           WHEN COUNT(*) = SUM(CASE WHEN vehicle_id IS NULL THEN 1 ELSE 0 END) + SUM(CASE WHEN vehicle_id IS NOT NULL AND EXISTS(SELECT 1 FROM vehicle v WHERE v.id = client_vehicle.vehicle_id) THEN 1 ELSE 0 END) 
           THEN '✅ CORRECTO'
           ELSE '❌ ERROR: Referencias inválidas'
       END as status
FROM client_vehicle;

-- =============================================
-- 3. VALIDACIONES DE ENUMS Y TIPOS
-- =============================================

-- Validar enums de cliente
SELECT 'VALIDACIÓN: Tipos de usuario válidos' as validation_type,
       COUNT(*) as total_records,
       SUM(CASE WHEN type IN ('admin', 'mechanic', 'client') THEN 1 ELSE 0 END) as valid_types,
       CASE 
           WHEN COUNT(*) = SUM(CASE WHEN type IN ('admin', 'mechanic', 'client') THEN 1 ELSE 0 END) 
           THEN '✅ CORRECTO'
           ELSE '❌ ERROR: Tipos inválidos'
       END as status
FROM client;

SELECT 'VALIDACIÓN: Géneros válidos' as validation_type,
       COUNT(*) as total_records,
       SUM(CASE WHEN gender IN ('male', 'female') THEN 1 ELSE 0 END) as valid_genders,
       CASE 
           WHEN COUNT(*) = SUM(CASE WHEN gender IN ('male', 'female') THEN 1 ELSE 0 END) 
           THEN '✅ CORRECTO'
           ELSE '❌ ERROR: Géneros inválidos'
       END as status
FROM client;

SELECT 'VALIDACIÓN: Métodos de contacto válidos' as validation_type,
       COUNT(*) as total_records,
       SUM(CASE WHEN preferred_contact_method IN ('phone', 'email', 'whatsapp') THEN 1 ELSE 0 END) as valid_methods,
       CASE 
           WHEN COUNT(*) = SUM(CASE WHEN preferred_contact_method IN ('phone', 'email', 'whatsapp') THEN 1 ELSE 0 END) 
           THEN '✅ CORRECTO'
           ELSE '❌ ERROR: Métodos inválidos'
       END as status
FROM client;

-- Validar enums de mecánico
SELECT 'VALIDACIÓN: Tipos de usuario de mecánicos' as validation_type,
       COUNT(*) as total_records,
       SUM(CASE WHEN type IN ('admin', 'mechanic', 'client') THEN 1 ELSE 0 END) as valid_types,
       CASE 
           WHEN COUNT(*) = SUM(CASE WHEN type IN ('admin', 'mechanic', 'client') THEN 1 ELSE 0 END) 
           THEN '✅ CORRECTO'
           ELSE '❌ ERROR: Tipos inválidos'
       END as status
FROM mechanic;

SELECT 'VALIDACIÓN: Niveles de experiencia válidos' as validation_type,
       COUNT(*) as total_records,
       SUM(CASE WHEN experience_level IN ('trainee', 'junior', 'senior', 'expert', 'master') THEN 1 ELSE 0 END) as valid_levels,
       CASE 
           WHEN COUNT(*) = SUM(CASE WHEN experience_level IN ('trainee', 'junior', 'senior', 'expert', 'master') THEN 1 ELSE 0 END) 
           THEN '✅ CORRECTO'
           ELSE '❌ ERROR: Niveles inválidos'
       END as status
FROM mechanic;

SELECT 'VALIDACIÓN: Estados de mecánico válidos' as validation_type,
       COUNT(*) as total_records,
       SUM(CASE WHEN status IN ('active', 'inactive', 'busy', 'on_break', 'sick_leave') THEN 1 ELSE 0 END) as valid_statuses,
       CASE 
           WHEN COUNT(*) = SUM(CASE WHEN status IN ('active', 'inactive', 'busy', 'on_break', 'sick_leave') THEN 1 ELSE 0 END) 
           THEN '✅ CORRECTO'
           ELSE '❌ ERROR: Estados inválidos'
       END as status
FROM mechanic;

-- Validar enums de reservaciones
SELECT 'VALIDACIÓN: Estados de reserva válidos' as validation_type,
       COUNT(*) as total_records,
       SUM(CASE WHEN state IN ('pending', 'in_progress', 'completed') THEN 1 ELSE 0 END) as valid_states,
       CASE 
           WHEN COUNT(*) = SUM(CASE WHEN state IN ('pending', 'in_progress', 'completed') THEN 1 ELSE 0 END) 
           THEN '✅ CORRECTO'
           ELSE '❌ ERROR: Estados inválidos'
       END as status
FROM reservate;

-- Validar enums de órdenes
SELECT 'VALIDACIÓN: Estados de orden válidos' as validation_type,
       COUNT(*) as total_records,
       SUM(CASE WHEN status IN ('pending', 'in_progress', 'completed') THEN 1 ELSE 0 END) as valid_statuses,
       CASE 
           WHEN COUNT(*) = SUM(CASE WHEN status IN ('pending', 'in_progress', 'completed') THEN 1 ELSE 0 END) 
           THEN '✅ CORRECTO'
           ELSE '❌ ERROR: Estados inválidos'
       END as status
FROM "order";

SELECT 'VALIDACIÓN: Métodos de pago válidos' as validation_type,
       COUNT(*) as total_records,
       SUM(CASE WHEN payment_method IN ('cash', 'card', 'transfer', 'qr') THEN 1 ELSE 0 END) as valid_methods,
       CASE 
           WHEN COUNT(*) = SUM(CASE WHEN payment_method IN ('cash', 'card', 'transfer', 'qr') THEN 1 ELSE 0 END) 
           THEN '✅ CORRECTO'
           ELSE '❌ ERROR: Métodos inválidos'
       END as status
FROM "order";

-- =============================================
-- 4. RESUMEN GENERAL
-- =============================================

SELECT 'RESUMEN GENERAL DE DATOS' as summary_type,
       (SELECT COUNT(*) FROM client) as total_clients,
       (SELECT COUNT(*) FROM vehicle) as total_vehicles,
       (SELECT COUNT(*) FROM mechanic) as total_mechanics,
       (SELECT COUNT(*) FROM service) as total_services,
       (SELECT COUNT(*) FROM client_vehicle) as total_client_vehicles,
       (SELECT COUNT(*) FROM reservate) as total_reservations,
       (SELECT COUNT(*) FROM "order") as total_orders,
       (SELECT COUNT(*) FROM mechanic_services) as total_mechanic_services,
       (SELECT COUNT(*) FROM reservate_service) as total_reservate_services;