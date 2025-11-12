-- =============================================
-- DATOS SEMILLA PARA API MECANIX v2.0
-- =============================================
-- Archivo actualizado con soporte para constraints SET NULL
-- Compatible con PostgreSQL y TypeORM
-- Fecha: 2025-11-12

-- =============================================
-- 1. LIMPIEZA INICIAL (Opcional - solo para reset completo)
-- =============================================
-- TRUNCATE TABLE "order" RESTART IDENTITY CASCADE;
-- TRUNCATE TABLE reservate_service RESTART IDENTITY CASCADE; 
-- TRUNCATE TABLE reservate RESTART IDENTITY CASCADE;
-- TRUNCATE TABLE client_vehicle RESTART IDENTITY CASCADE;
-- TRUNCATE TABLE mechanic_services RESTART IDENTITY CASCADE;
-- TRUNCATE TABLE mechanic RESTART IDENTITY CASCADE;
-- TRUNCATE TABLE service RESTART IDENTITY CASCADE;
-- TRUNCATE TABLE vehicle RESTART IDENTITY CASCADE;
-- TRUNCATE TABLE client RESTART IDENTITY CASCADE;

-- =============================================
-- 2. DATOS MAESTROS - CLIENTES
-- =============================================
INSERT INTO client (
    client_code, 
    name, 
    last_name, 
    phone, 
    ci, 
    type, 
    gender, 
    email, 
    password, 
    email_verified, 
    phone_verified, 
    last_login, 
    address, 
    preferred_contact_method, 
    is_active,
    created_at,
    updated_at
) VALUES
(1001, 'Carlos', 'Rodriguez', '70123456', 12345678, 'client', 'male', 'carlos.rodriguez@mecanix.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', true, true, '2025-11-10 10:00:00', 'Av. 6 de Agosto #1234, La Paz', 'phone', true, NOW(), NOW()),
(1002, 'María', 'González', '70234567', 87654321, 'client', 'female', 'maria.gonzalez@mecanix.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', true, true, '2025-11-09 14:30:00', 'Calle Comercio #567, El Alto', 'email', true, NOW(), NOW()),
(1003, 'Pedro', 'Martínez', '70345678', 11223344, 'client', 'male', 'pedro.martinez@mecanix.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', false, true, '2025-11-08 09:15:00', 'Av. Arce #890, Sopocachi', 'whatsapp', true, NOW(), NOW()),
(1004, 'Ana', 'López', '70456789', 55667788, 'client', 'female', 'ana.lopez@mecanix.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', true, false, '2025-11-07 16:45:00', 'Zona Sur, Calacoto #321', 'phone', false, NOW(), NOW()),
(1005, 'Luis', 'Fernández', '70567890', 33445566, 'client', 'male', 'luis.fernandez@mecanix.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', true, true, '2025-11-06 11:20:00', 'Miraflores #654, Zona Centro', 'email', true, NOW(), NOW()),
(1006, 'Sofía', 'Vargas', '70678901', 66778899, 'client', 'female', 'sofia.vargas@mecanix.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', true, true, '2025-11-05 13:10:00', 'Villa Fátima #777, Zona Norte', 'whatsapp', true, NOW(), NOW()),
(1007, 'Ricardo', 'Moreno', '70789012', 77889900, 'client', 'male', 'ricardo.moreno@mecanix.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', false, true, '2025-11-04 12:25:00', 'Obrajes #888, Zona Residencial', 'phone', true, NOW(), NOW()),
(1008, 'Carmen', 'Silva', '70890123', 88990011, 'client', 'female', NULL, NULL, false, false, NULL, 'Achumani #999, Zona Sur', 'phone', true, NOW(), NOW());

-- =============================================
-- 3. DATOS MAESTROS - VEHÍCULOS
-- =============================================
INSERT INTO vehicle (board, model, brand, year) VALUES
('ABC123', 'Corolla', 'Toyota', 2020),
('XYZ789', 'Civic', 'Honda', 2019),
('DEF456', 'Aveo', 'Chevrolet', 2021),
('GHI789', 'Focus', 'Ford', 2018),
('JKL012', 'Sentra', 'Nissan', 2022),
('MNO345', 'Golf', 'Volkswagen', 2020),
('PQR678', 'Accent', 'Hyundai', 2019),
('STU901', 'Camry', 'Toyota', 2023),
('VWX234', 'Altima', 'Nissan', 2021),
('YZA567', 'Mazda3', 'Mazda', 2020),
('BCD890', 'Cruze', 'Chevrolet', 2019),
('EFG123', 'Jetta', 'Volkswagen', 2022);

-- =============================================
-- 4. DATOS MAESTROS - MECÁNICOS
-- =============================================
INSERT INTO mechanic (
    employee_code, 
    first_name, 
    last_name, 
    phone, 
    type, 
    hire_date, 
    years_experience, 
    experience_level, 
    status, 
    specialties, 
    hourly_rate, 
    work_schedule_start, 
    work_schedule_end, 
    work_days, 
    is_active,
    created_at,
    updated_at
) VALUES
('MECH001', 'Roberto', 'Pérez', '71234567', 'mechanic', '2022-01-15', 3, 'senior', 'active', 'engine,transmission,general', 85.50, '08:00:00', '17:00:00', 'Monday,Tuesday,Wednesday,Thursday,Friday', true, NOW(), NOW()),
('MECH002', 'Sofía', 'Ramírez', '72345678', 'mechanic', '2023-03-20', 2, 'junior', 'active', 'electrical,brakes,diagnostics', 65.00, '08:00:00', '17:00:00', 'Monday,Tuesday,Wednesday,Thursday,Friday', true, NOW(), NOW()),
('MECH003', 'Diego', 'Morales', '73456789', 'mechanic', '2021-06-10', 5, 'expert', 'active', 'suspension,air_conditioning,general', 125.00, '09:00:00', '18:00:00', 'Monday,Tuesday,Wednesday,Thursday,Friday,Saturday', true, NOW(), NOW()),
('MECH004', 'Carmen', 'Vargas', '74567890', 'mechanic', '2023-08-01', 1, 'trainee', 'busy', 'general', 45.00, '08:00:00', '16:00:00', 'Monday,Tuesday,Wednesday,Thursday,Friday', true, NOW(), NOW()),
('MECH005', 'Miguel', 'Torres', '75678901', 'mechanic', '2020-11-25', 8, 'master', 'active', 'diagnostics,bodywork,painting,engine', 180.00, '07:00:00', '16:00:00', 'Monday,Tuesday,Wednesday,Thursday,Friday', true, NOW(), NOW()),
('MECH006', 'Isabel', 'Cruz', '76789012', 'mechanic', '2024-02-10', 1, 'junior', 'active', 'electrical,general', 58.00, '08:30:00', '17:30:00', 'Monday,Tuesday,Wednesday,Thursday,Friday', true, NOW(), NOW());

-- =============================================
-- 5. DATOS MAESTROS - SERVICIOS
-- =============================================
INSERT INTO service (code, title, description, price) VALUES
(101, 'Cambio de aceite', 'Cambio de aceite del motor con filtro incluido', 180),
(102, 'Revisión de frenos', 'Inspección completa del sistema de frenos', 250),
(103, 'Alineación y balanceado', 'Alineación de ruedas y balanceado de neumáticos', 220),
(104, 'Cambio de filtro de aire', 'Reemplazo del filtro de aire del motor', 95),
(105, 'Revisión eléctrica', 'Diagnóstico completo del sistema eléctrico', 320),
(106, 'Cambio de bujías', 'Reemplazo de bujías de encendido', 150),
(107, 'Lavado completo', 'Lavado exterior e interior del vehículo', 80),
(108, 'Cambio de batería', 'Reemplazo de batería del vehículo', 450),
(109, 'Revisión de suspensión', 'Diagnóstico y ajuste del sistema de suspensión', 380),
(110, 'Cambio de aceite de transmisión', 'Cambio de aceite de la caja de cambios', 280),
(111, 'Rectificación de frenos', 'Rectificado de discos y tambores de freno', 320),
(112, 'Diagnóstico computarizado', 'Escaneo completo con equipo de diagnóstico', 200);

-- =============================================
-- 6. TABLA RELACIONAL - MECÁNICOS Y SERVICIOS
-- =============================================
INSERT INTO mechanic_services (mechanic_id, service_id) VALUES
-- Roberto (MECH001) - Senior en motor y transmisión
(1, 1), (1, 4), (1, 6), (1, 10), (1, 12),
-- Sofía (MECH002) - Junior en eléctrico y frenos  
(2, 2), (2, 5), (2, 8), (2, 11), (2, 12),
-- Diego (MECH003) - Expert en suspensión y AC
(3, 3), (3, 9), (3, 7), (3, 12),
-- Carmen (MECH004) - Trainee general
(4, 7), (4, 4),
-- Miguel (MECH005) - Master multidisciplinario
(5, 1), (5, 2), (5, 3), (5, 5), (5, 8), (5, 9), (5, 10), (5, 11), (5, 12),
-- Isabel (MECH006) - Junior eléctrico
(6, 5), (6, 8), (6, 7), (6, 12);

-- =============================================
-- 7. TABLA RELACIONAL - CLIENTE-VEHÍCULO
-- =============================================
INSERT INTO client_vehicle (
    client_code, 
    vehicle_id, 
    is_primary, 
    notes, 
    is_active, 
    added_date,
    updated_at
) VALUES
(1001, 1, true, 'Toyota Corolla 2020 - Vehículo principal', true, '2024-10-01 08:00:00', NOW()),
(1002, 2, true, 'Honda Civic 2019 - Muy bien cuidado', true, '2024-10-02 09:30:00', NOW()),
(1003, 3, true, 'Chevrolet Aveo 2021 - Para trabajo', true, '2024-10-03 10:15:00', NOW()),
(1004, 4, true, 'Ford Focus 2018 - Necesita mantenimiento', true, '2024-10-04 11:45:00', NOW()),
(1005, 5, true, 'Nissan Sentra 2022 - Vehículo nuevo', true, '2024-10-05 14:20:00', NOW()),
(1001, 6, false, 'Volkswagen Golf 2020 - Segundo vehículo familiar', true, '2024-10-15 16:30:00', NOW()),
(1006, 7, true, 'Hyundai Accent 2019 - Económico y confiable', true, '2024-10-20 09:00:00', NOW()),
(1007, 8, true, 'Toyota Camry 2023 - Vehículo de lujo', true, '2024-10-25 10:30:00', NOW()),
(1008, 9, true, 'Nissan Altima 2021 - Para viajes largos', true, '2024-10-28 12:00:00', NOW()),
(1002, 10, false, 'Mazda3 2020 - Vehículo deportivo', true, '2024-11-01 14:15:00', NOW());

-- =============================================
-- 8. RESERVACIONES
-- =============================================
-- Nota: Los campos client y mechanic pueden ser NULL debido a SET NULL constraint
INSERT INTO reservate (
    code_reservate, 
    reservation_date, 
    total_price, 
    state, 
    client, 
    mechanic,
    created_at,
    updated_at
) VALUES
(202411001, '2025-11-12 09:00:00', 180, 'completed', 1, 1, NOW(), NOW()),
(202411002, '2025-11-12 10:30:00', 570, 'completed', 2, 2, NOW(), NOW()),
(202411003, '2025-11-12 14:00:00', 220, 'in_progress', 3, 3, NOW(), NOW()),
(202411004, '2025-11-12 08:30:00', 575, 'pending', 4, 5, NOW(), NOW()),
(202411005, '2025-11-12 16:00:00', 150, 'pending', 5, 1, NOW(), NOW()),
(202411006, '2025-11-13 09:30:00', 320, 'pending', 6, 2, NOW(), NOW()),
(202411007, '2025-11-13 11:00:00', 380, 'pending', 7, 3, NOW(), NOW()),
-- Reservación sin cliente asignado (cliente eliminado - SET NULL)
(202411008, '2025-11-13 15:30:00', 200, 'pending', NULL, 5, NOW(), NOW()),
-- Reservación sin mecánico asignado (mecánico no disponible)
(202411009, '2025-11-14 10:00:00', 280, 'pending', 8, NULL, NOW(), NOW()),
(202411010, '2025-11-14 13:00:00', 450, 'pending', 1, 6, NOW(), NOW());

-- =============================================
-- 9. TABLA RELACIONAL - RESERVA-SERVICIO
-- =============================================
INSERT INTO reservate_service (reservate_id, service_id) VALUES
-- Reserva 1: Cambio de aceite básico
(1, 1),
-- Reserva 2: Revisión completa de frenos + eléctrica
(2, 2), (2, 5),
-- Reserva 3: Alineación y balanceado
(3, 3),
-- Reserva 4: Mantenimiento completo
(4, 1), (4, 4), (4, 6), (4, 7),
-- Reserva 5: Cambio de bujías
(5, 6),
-- Reserva 6: Revisión eléctrica + cambio batería
(6, 5), (6, 8),
-- Reserva 7: Revisión de suspensión
(7, 9),
-- Reserva 8: Diagnóstico computarizado
(8, 12),
-- Reserva 9: Cambio aceite transmisión
(9, 10),
-- Reserva 10: Cambio batería + lavado
(10, 8), (10, 7);

-- =============================================
-- 10. ÓRDENES DE TRABAJO
-- =============================================
-- Nota: Los campos reservate_id, vehicle_id y mechanic_id pueden ser NULL debido a SET NULL
INSERT INTO "order" (
    order_code, 
    reservate_id, 
    vehicle_id, 
    mechanic_id, 
    status, 
    diagnosis, 
    work_description, 
    start_date, 
    completion_date, 
    client_nit_ci, 
    client_name, 
    client_email, 
    subtotal, 
    tax_amount, 
    total_cost, 
    payment_method, 
    invoice_number,
    created_at,
    updated_at
) VALUES
-- Orden completada 1
('ORD-20251112-001', 1, 1, 1, 'completed', 
 'Aceite viejo y filtro obstruido', 
 'Se realizó cambio de aceite 5W-30 sintético y reemplazo de filtro de aceite marca OEM', 
 '2025-11-12 09:30:00', '2025-11-12 10:30:00', 
 12345678, 'Carlos Rodriguez', 'carlos.rodriguez@mecanix.com', 
 159.29, 20.71, 180.00, 'cash', 'FAC-001-2025', NOW(), NOW()),

-- Orden completada 2
('ORD-20251112-002', 2, 2, 2, 'completed', 
 'Pastillas de freno desgastadas al 80% y líquido de frenos contaminado. Sistema eléctrico presenta falla en alternador', 
 'Cambio completo de pastillas delanteras y traseras, purga de líquido de frenos, reemplazo de alternador y revisión integral del sistema eléctrico', 
 '2025-11-12 11:00:00', '2025-11-12 16:00:00', 
 87654321, 'María González', 'maria.gonzalez@mecanix.com', 
 504.42, 65.58, 570.00, 'card', 'FAC-002-2025', NOW(), NOW()),

-- Orden en progreso
('ORD-20251112-003', 3, 3, 3, 'in_progress', 
 'Vehículo presenta vibración al frenar y jalón hacia la derecha', 
 'Alineación de ruedas y balanceado en proceso, rectificación de discos si es necesaria', 
 '2025-11-12 14:30:00', NULL, 
 11223344, 'Pedro Martínez', 'pedro.martinez@mecanix.com', 
 194.69, 25.31, 220.00, 'transfer', NULL, NOW(), NOW()),

-- Orden pendiente
('ORD-20251112-004', 4, 4, 5, 'pending', 
 NULL, NULL, NULL, NULL, 
 55667788, 'Ana López', 'ana.lopez@mecanix.com', 
 508.85, 66.15, 575.00, 'qr', NULL, NOW(), NOW()),

-- Orden con vehículo eliminado (SET NULL)
('ORD-20251112-005', 5, NULL, 1, 'pending', 
 NULL, NULL, NULL, NULL, 
 33445566, 'Luis Fernández', 'luis.fernandez@mecanix.com', 
 132.74, 17.26, 150.00, 'cash', NULL, NOW(), NOW()),

-- Orden con reserva eliminada (SET NULL)
('ORD-20251113-001', NULL, 7, 2, 'pending', 
 'Revisión rutinaria programada', 
 'Mantenimiento preventivo sin reserva previa', 
 NULL, NULL, 
 66778899, 'Sofía Vargas', 'sofia.vargas@mecanix.com', 
 283.19, 36.81, 320.00, 'card', NULL, NOW(), NOW()),

-- Orden sin mecánico asignado (SET NULL)
('ORD-20251113-002', 7, 8, NULL, 'pending', 
 NULL, NULL, NULL, NULL, 
 77889900, 'Ricardo Moreno', 'ricardo.moreno@mecanix.com', 
 336.28, 43.72, 380.00, 'transfer', NULL, NOW(), NOW()),

-- Orden huérfana (todos los FK en NULL por eliminaciones)
('ORD-20251114-001', NULL, NULL, NULL, 'pending', 
 'Orden sin referencias debido a eliminación de datos relacionados', 
 'Orden que quedó huérfana por eliminación de registros relacionados', 
 NULL, NULL, 
 88990011, 'Carmen Silva', NULL, 
 176.99, 23.01, 200.00, 'cash', NULL, NOW(), NOW());

-- =============================================
-- RESUMEN DE DATOS INSERTADOS
-- =============================================
-- Clientes: 8 registros
-- Vehículos: 12 registros  
-- Mecánicos: 6 registros
-- Servicios: 12 registros
-- Relaciones Mecánico-Servicio: 28 registros
-- Relaciones Cliente-Vehículo: 10 registros
-- Reservaciones: 10 registros
-- Relaciones Reserva-Servicio: 15 registros
-- Órdenes: 8 registros
-- =============================================