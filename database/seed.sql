-- Active: 1756061692664@@192.168.100.106@5432@MecanixDB
-- =====================================================================
-- SCRIPT DE DATOS DE PRUEBA PARA API MECANIX BACKEND
-- =====================================================================
-- Este archivo contiene datos de ejemplo para llenar la base de datos
-- de PostgreSQL del sistema de gestión de taller mecánico.
-- 
-- Ejecutar en el siguiente orden para respetar las relaciones FK:
-- 1. Entidades independientes: client, vehicle, service, mechanic
-- 2. Tablas de relación: client_vehicle, mechanic_services
-- 3. Entidades dependientes: reservate, reservate_service, order
-- =====================================================================

-- =====================================================================
-- 1. LIMPIEZA DE DATOS EXISTENTES
-- =====================================================================

-- Deshabilitar temporalmente las restricciones de claves foráneas
SET session_replication_role = replica;

-- Limpiar tablas en orden inverso de dependencias
TRUNCATE TABLE "order" RESTART IDENTITY CASCADE;
TRUNCATE TABLE reservate_service RESTART IDENTITY CASCADE;
TRUNCATE TABLE reservate RESTART IDENTITY CASCADE;
TRUNCATE TABLE mechanic_services RESTART IDENTITY CASCADE;
TRUNCATE TABLE client_vehicle RESTART IDENTITY CASCADE;
TRUNCATE TABLE mechanic RESTART IDENTITY CASCADE;
TRUNCATE TABLE service RESTART IDENTITY CASCADE;
TRUNCATE TABLE vehicle RESTART IDENTITY CASCADE;
TRUNCATE TABLE client RESTART IDENTITY CASCADE;

-- Rehabilitar las restricciones de claves foráneas
SET session_replication_role = DEFAULT;

-- =====================================================================
-- 2. INSERCIÓN DE CLIENTES
-- =====================================================================

INSERT INTO client (
    client_code, name, last_name, phone, ci, type, gender, email, password, 
    email_verified, phone_verified, last_login, address, preferred_contact_method, 
    is_active, created_at, updated_at
) VALUES
-- Clientes activos con diferentes características
(1001, 'Carlos', 'Mendoza García', '76543210', 12345678, 'client', 'male', 'carlos.mendoza@email.com', '$2a$10$hashedPassword1', true, true, '2024-11-09 14:30:00', 'Av. América 1234, Zona Sur, La Paz', 'phone', true, NOW() - INTERVAL '6 months', NOW() - INTERVAL '1 day'),
(1002, 'María', 'Lopez Fernández', '78901244', 87654321, 'client', 'female', 'maria.lopez@email.com', '$2a$10$hashedPassword2', true, false, '2024-11-08 10:15:00', 'Calle Murillo 567, Sopocachi, La Paz', 'whatsapp', true, NOW() - INTERVAL '4 months', NOW() - INTERVAL '2 days'),
(1003, 'Roberto', 'Silva Quispe', '71234567', 11223344, 'client', 'male', 'roberto.silva@email.com', '$2a$10$hashedPassword3', false, true, '2024-11-07 16:45:00', 'Av. 6 de Agosto 890, San Miguel, La Paz', 'email', true, NOW() - INTERVAL '8 months', NOW() - INTERVAL '3 days'),
(1004, 'Ana', 'Vásquez Condori', '72345678', 55667788, 'client', 'female', 'ana.vasquez@email.com', '$2a$10$hashedPassword4', true, true, '2024-11-06 09:20:00', 'Av. Ballivián 445, Calacoto, La Paz', 'phone', true, NOW() - INTERVAL '3 months', NOW() - INTERVAL '1 week'),
(1005, 'Diego', 'Mamani Choque', '73456789', 99887766, 'client', 'male', 'diego.mamani@email.com', '$2a$10$hashedPassword5', true, false, '2024-11-05 13:30:00', 'Calle Jaén 123, Centro, La Paz', 'whatsapp', true, NOW() - INTERVAL '5 months', NOW() - INTERVAL '4 days'),
-- Cliente inactivo para pruebas
(1006, 'Patricia', 'Rojas Torrico', '74567890', 44556677, 'client', 'female', 'patricia.rojas@email.com', '$2a$10$hashedPassword6', false, false, '2024-10-15 12:00:00', 'Av. Arce 789, Zona Central, La Paz', 'email', false, NOW() - INTERVAL '7 months', NOW() - INTERVAL '1 month'),
-- Clientes con características especiales
(1007, 'Luis', 'Gutierrez Ponce', '75678901', 33445566, 'client', 'male', 'luis.gutierrez@email.com', '$2a$10$hashedPassword7', true, true, '2024-11-10 08:00:00', 'Av. Costanera 321, Zona Sur, La Paz', 'phone', true, NOW() - INTERVAL '2 months', NOW()),
(1008, 'Carmen', 'Flores Ticona', '76789012', 22334455, 'client', 'female', 'carmen.flores@email.com', '$2a$10$hashedPassword8', true, true, '2024-11-09 17:30:00', 'Calle Comercio 654, Zona Norte, La Paz', 'whatsapp', true, NOW() - INTERVAL '1 month', NOW() - INTERVAL '12 hours'),
(1009, 'José', 'Vargas Nina', '77890123', 11223366, 'client', 'male', 'jose.vargas@email.com', '$2a$10$hashedPassword9', false, true, '2024-11-08 11:45:00', 'Av. La Salle 987, Calacoto, La Paz', 'email', true, NOW() - INTERVAL '9 months', NOW() - INTERVAL '2 days'),
(1010, 'Sandra', 'Cruz Apaza', '78901234', 66778899, 'client', 'female', 'sandra.cruz@email.com', '$2a$10$hashedPassword10', true, false, '2024-11-07 15:15:00', 'Calle Illimani 456, El Alto, La Paz', 'phone', true, NOW() - INTERVAL '6 months', NOW() - INTERVAL '5 days');

-- =====================================================================
-- 3. INSERCIÓN DE VEHÍCULOS
-- =====================================================================

INSERT INTO vehicle (board, model, brand, year) VALUES
-- Vehículos populares en Bolivia
('ABC123', 'Corolla', 'Toyota', 2020),
('DEF456', 'Civic', 'Honda', 2019),
('GHI789', 'Jetta', 'Volkswagen', 2021),
('JKL012', 'Aveo', 'Chevrolet', 2018),
('MNO345', 'Yaris', 'Toyota', 2022),
('PQR678', 'Accent', 'Hyundai', 2017),
('STU901', 'Fiesta', 'Ford', 2020),
('VWX234', 'Gol', 'Volkswagen', 2019),
('YZA567', 'Onix', 'Chevrolet', 2021),
('BCD890', 'Rio', 'Kia', 2018),
-- Vehículos adicionales para más variedad
('EFG123', 'Hilux', 'Toyota', 2023),
('HIJ456', 'Ranger', 'Ford', 2022),
('KLM789', 'Amarok', 'Volkswagen', 2021),
('NOP012', 'S10', 'Chevrolet', 2020),
('QRS345', 'Santa Fe', 'Hyundai', 2019);

-- =====================================================================
-- 4. INSERCIÓN DE SERVICIOS
-- =====================================================================

INSERT INTO service (code, title, description, price) VALUES
-- Servicios básicos de mantenimiento
(101, 'Cambio de Aceite', 'Cambio de aceite del motor con filtro incluido', 150),
(102, 'Revisión de Frenos', 'Inspección y ajuste del sistema de frenos', 200),
(103, 'Alineación y Balanceado', 'Alineación de ruedas y balanceado de neumáticos', 180),
(104, 'Cambio de Filtros', 'Cambio de filtro de aire, combustible y habitáculo', 120),
(105, 'Diagnosis Computarizada', 'Diagnosis electrónica del vehículo con scanner', 80),
-- Servicios de reparación especializada
(106, 'Reparación de Motor', 'Reparación mayor del motor', 1500),
(107, 'Cambio de Embrague', 'Cambio completo del sistema de embrague', 800),
(108, 'Reparación de Transmisión', 'Reparación de caja de cambios automática/manual', 1200),
(109, 'Sistema Eléctrico', 'Reparación del sistema eléctrico del vehículo', 300),
(110, 'Aire Acondicionado', 'Revisión y reparación de sistema A/C', 250),
-- Servicios de carrocería y pintura
(111, 'Pintura Completa', 'Pintura completa del vehículo', 2000),
(112, 'Reparación de Carrocería', 'Reparación de abolladuras y rayones', 400),
(113, 'Cambio de Parabrisas', 'Cambio de parabrisas delantero o trasero', 350),
-- Servicios de suspensión
(114, 'Cambio de Amortiguadores', 'Cambio de amortiguadores delanteros y traseros', 600),
(115, 'Revisión de Suspensión', 'Inspección completa del sistema de suspensión', 100);

-- =====================================================================
-- 5. INSERCIÓN DE MECÁNICOS
-- =====================================================================

INSERT INTO mechanic (
    employee_code, first_name, last_name, phone, type, hire_date, 
    years_experience, "experienceLevel", status, specialties, hourly_rate, 
    work_schedule_start, work_schedule_end, work_days, is_active, 
    created_at, updated_at
) VALUES
-- Mecánicos expertos
('MEC001', 'Juan Carlos', 'Pérez Mamani', '79123456', 'mechanic', '2020-01-15', 4, 'senior', 'active', 'engine,transmission,diagnostics', 45.00, '08:00:00', '17:00:00', 'Monday,Tuesday,Wednesday,Thursday,Friday', true, NOW() - INTERVAL '4 years', NOW()),
('MEC002', 'Miguel Angel', 'Quispe Condori', '79234567', 'mechanic', '2019-03-20', 5, 'expert', 'active', 'electrical,diagnostics,general', 50.00, '08:00:00', '17:00:00', 'Monday,Tuesday,Wednesday,Thursday,Friday', true, NOW() - INTERVAL '5 years', NOW()),
('MEC003', 'Fernando', 'Vásquez Torres', '79345678', 'mechanic', '2021-06-10', 3, 'senior', 'active', 'brakes,suspension,general', 40.00, '08:00:00', '17:00:00', 'Monday,Tuesday,Wednesday,Thursday,Friday,Saturday', true, NOW() - INTERVAL '3 years', NOW()),
-- Mecánicos especializados
('MEC004', 'Ricardo', 'Flores Apaza', '79456789', 'mechanic', '2022-02-14', 2, 'junior', 'active', 'air_conditioning,electrical', 35.00, '08:00:00', '17:00:00', 'Tuesday,Wednesday,Thursday,Friday,Saturday', true, NOW() - INTERVAL '2 years', NOW()),
('MEC005', 'Alberto', 'Cruz Nina', '79567890', 'mechanic', '2023-09-01', 1, 'junior', 'active', 'general,diagnostics', 30.00, '08:00:00', '16:00:00', 'Monday,Tuesday,Wednesday,Thursday,Friday', true, NOW() - INTERVAL '1 year', NOW()),
-- Especialistas en pintura y carrocería
('MEC006', 'Carlos Eduardo', 'Rojas Ticona', '79678901', 'mechanic', '2018-11-05', 6, 'expert', 'active', 'bodywork,painting', 55.00, '08:00:00', '17:00:00', 'Monday,Tuesday,Wednesday,Thursday,Friday', true, NOW() - INTERVAL '6 years', NOW()),
('MEC007', 'Daniel', 'Mamani Choque', '79789012', 'mechanic', '2021-04-18', 3, 'senior', 'active', 'bodywork,painting,general', 42.00, '08:30:00', '17:30:00', 'Monday,Tuesday,Wednesday,Thursday,Friday,Saturday', true, NOW() - INTERVAL '3 years', NOW()),
-- Mecánico maestro
('MEC008', 'Antonio', 'Vargas Calle', '79890123', 'mechanic', '2015-07-12', 9, 'master', 'active', 'engine,transmission,electrical,brakes,suspension,diagnostics', 65.00, '08:00:00', '17:00:00', 'Monday,Tuesday,Wednesday,Thursday,Friday', true, NOW() - INTERVAL '9 years', NOW()),
-- Mecánicos en entrenamiento
('MEC009', 'Javier', 'Huanca Quisbert', '79901234', 'mechanic', '2024-01-15', 0, 'trainee', 'active', 'general', 25.00, '08:00:00', '16:00:00', 'Monday,Tuesday,Wednesday,Thursday,Friday', true, NOW() - INTERVAL '10 months', NOW()),
('MEC010', 'Raúl', 'Condori Silva', '70012345', 'mechanic', '2024-06-01', 0, 'trainee', 'active', 'general', 25.00, '08:00:00', '16:00:00', 'Monday,Tuesday,Wednesday,Thursday,Friday', true, NOW() - INTERVAL '5 months', NOW());

-- =====================================================================
-- 6. RELACIÓN CLIENTE-VEHÍCULO
-- =====================================================================

INSERT INTO client_vehicle (
    client_code, vehicle_id, is_primary, notes, is_active, added_date, updated_at
) VALUES
-- Asignación de vehículos a clientes
(1001, 1, true, 'Vehículo principal del cliente, uso diario', true, NOW() - INTERVAL '6 months', NOW() - INTERVAL '1 day'),
(1002, 2, true, 'Honda Civic en excelente estado', true, NOW() - INTERVAL '4 months', NOW() - INTERVAL '2 days'),
(1003, 3, true, 'Vehículo familiar, uso frecuente', true, NOW() - INTERVAL '8 months', NOW() - INTERVAL '3 days'),
(1004, 4, true, 'Chevrolet Aveo para ciudad', true, NOW() - INTERVAL '3 months', NOW() - INTERVAL '1 week'),
(1005, 5, true, 'Toyota Yaris nuevo, primer servicio', true, NOW() - INTERVAL '5 months', NOW() - INTERVAL '4 days'),
(1006, 6, true, 'Vehículo del cliente inactivo', false, NOW() - INTERVAL '7 months', NOW() - INTERVAL '1 month'),
(1007, 7, true, 'Ford Fiesta para trabajo', true, NOW() - INTERVAL '2 months', NOW()),
(1008, 8, true, 'Volkswagen Gol económico', true, NOW() - INTERVAL '1 month', NOW() - INTERVAL '12 hours'),
(1009, 9, true, 'Chevrolet Onix moderno', true, NOW() - INTERVAL '9 months', NOW() - INTERVAL '2 days'),
(1010, 10, true, 'Kia Rio confiable', true, NOW() - INTERVAL '6 months', NOW() - INTERVAL '5 days'),
-- Clientes con múltiples vehículos
(1001, 11, false, 'Toyota Hilux para trabajo pesado', true, NOW() - INTERVAL '3 months', NOW() - INTERVAL '1 week'),
(1003, 12, false, 'Ford Ranger adicional', true, NOW() - INTERVAL '2 months', NOW() - INTERVAL '3 days'),
(1005, 13, false, 'Volkswagen Amarok para familia', true, NOW() - INTERVAL '4 months', NOW() - INTERVAL '2 weeks');

-- =====================================================================
-- 7. RELACIÓN MECÁNICO-SERVICIOS
-- =====================================================================

INSERT INTO mechanic_services (mechanic_id, service_id) VALUES
-- Juan Carlos (MEC001) - Especialista en motor y transmisión
(1, 1),  -- Cambio de Aceite
(1, 6),  -- Reparación de Motor
(1, 7),  -- Cambio de Embrague
(1, 8),  -- Reparación de Transmisión
(1, 5),  -- Diagnosis Computarizada

-- Miguel Angel (MEC002) - Especialista eléctrico
(2, 5),  -- Diagnosis Computarizada
(2, 9),  -- Sistema Eléctrico
(2, 1),  -- Cambio de Aceite (servicio general)
(2, 4),  -- Cambio de Filtros

-- Fernando (MEC003) - Especialista en frenos y suspensión
(3, 2),  -- Revisión de Frenos
(3, 3),  -- Alineación y Balanceado
(3, 14), -- Cambio de Amortiguadores
(3, 15), -- Revisión de Suspensión
(3, 1),  -- Cambio de Aceite (servicio general)

-- Ricardo (MEC004) - Especialista en A/C y eléctrico
(4, 10), -- Aire Acondicionado
(4, 9),  -- Sistema Eléctrico
(4, 4),  -- Cambio de Filtros
(4, 5),  -- Diagnosis Computarizada

-- Alberto (MEC005) - Servicios generales
(5, 1),  -- Cambio de Aceite
(5, 4),  -- Cambio de Filtros
(5, 5),  -- Diagnosis Computarizada
(5, 15), -- Revisión de Suspensión

-- Carlos Eduardo (MEC006) - Especialista en pintura
(6, 11), -- Pintura Completa
(6, 12), -- Reparación de Carrocería
(6, 13), -- Cambio de Parabrisas

-- Daniel (MEC007) - Carrocería y general
(7, 12), -- Reparación de Carrocería
(7, 11), -- Pintura Completa
(7, 1),  -- Cambio de Aceite
(7, 4),  -- Cambio de Filtros

-- Antonio (MEC008) - Maestro (todos los servicios)
(8, 1), (8, 2), (8, 3), (8, 4), (8, 5), (8, 6), (8, 7), (8, 8), (8, 9), (8, 10), (8, 11), (8, 12), (8, 13), (8, 14), (8, 15),

-- Javier (MEC009) - Aprendiz
(9, 1),  -- Cambio de Aceite
(9, 4),  -- Cambio de Filtros

-- Raúl (MEC010) - Aprendiz
(10, 1), -- Cambio de Aceite
(10, 4); -- Cambio de Filtros

-- =====================================================================
-- 8. INSERCIÓN DE RESERVACIONES
-- =====================================================================

INSERT INTO reservate (
    code_reservate, reservation_date, total_price, state, "clientId", "mechanicId", 
    created_at, updated_at
) VALUES
-- Reservaciones completadas
(2024110001, '2024-11-01 09:00:00', 150, 'completed', 1, 1, '2024-11-01 08:30:00', '2024-11-01 11:00:00'),
(2024110002, '2024-11-02 10:30:00', 200, 'completed', 2, 3, '2024-11-01 16:00:00', '2024-11-02 12:30:00'),
(2024110003, '2024-11-03 14:00:00', 180, 'completed', 3, 3, '2024-11-02 09:15:00', '2024-11-03 16:00:00'),
(2024110004, '2024-11-04 08:30:00', 300, 'completed', 4, 2, '2024-11-03 17:00:00', '2024-11-04 12:00:00'),
(2024110005, '2024-11-05 11:00:00', 250, 'completed', 5, 4, '2024-11-04 14:30:00', '2024-11-05 14:30:00'),

-- Reservaciones en progreso
(2024110006, '2024-11-08 09:30:00', 120, 'in_progress', 7, 5, '2024-11-07 11:00:00', '2024-11-08 09:30:00'),
(2024110007, '2024-11-09 13:00:00', 800, 'in_progress', 8, 1, '2024-11-08 15:45:00', '2024-11-09 13:00:00'),
(2024110008, '2024-11-09 15:30:00', 400, 'in_progress', 9, 7, '2024-11-08 10:20:00', '2024-11-09 15:30:00'),

-- Reservaciones pendientes
(2024110009, '2024-11-12 08:00:00', 1500, 'pending', 10, 8, '2024-11-10 16:30:00', '2024-11-10 16:30:00'),
(2024110010, '2024-11-12 10:00:00', 350, 'pending', 1, 6, '2024-11-10 18:00:00', '2024-11-10 18:00:00'),
(2024110011, '2024-11-13 14:00:00', 600, 'pending', 3, 3, '2024-11-10 19:15:00', '2024-11-10 19:15:00'),
(2024110012, '2024-11-14 09:30:00', 80, 'pending', 5, 2, '2024-11-10 20:00:00', '2024-11-10 20:00:00');

-- =====================================================================
-- 9. RELACIÓN RESERVACIÓN-SERVICIOS
-- =====================================================================

INSERT INTO reservate_service (reservate_id, service_id) VALUES
-- Reservación 1: Cambio de aceite
(1, 1),
-- Reservación 2: Revisión de frenos
(2, 2),
-- Reservación 3: Alineación y balanceado
(3, 3),
-- Reservación 4: Sistema eléctrico
(4, 9),
-- Reservación 5: Aire acondicionado
(5, 10),
-- Reservación 6: Cambio de filtros
(6, 4),
-- Reservación 7: Cambio de embrague
(7, 7),
-- Reservación 8: Reparación de carrocería
(8, 12),
-- Reservación 9: Reparación de motor
(9, 6),
-- Reservación 10: Cambio de parabrisas
(10, 13),
-- Reservación 11: Cambio de amortiguadores
(11, 14),
-- Reservación 12: Diagnosis computarizada
(12, 5);

-- =====================================================================
-- 10. INSERCIÓN DE ÓRDENES DE TRABAJO
-- =====================================================================

INSERT INTO "order" (
    order_code, reservate_id, vehicle_id, mechanic_id, status, diagnosis, 
    work_description, start_date, completion_date, client_nit_ci, client_name, 
    client_email, subtotal, tax_amount, total_cost, payment_method, 
    invoice_number, created_at, updated_at
) VALUES
-- Órdenes completadas
('ORD-2024-001', 1, 1, 1, 'completed', 
 'Aceite de motor en mal estado, filtro obstruido', 
 'Cambio de aceite 5W-30 sintético y filtro de aceite original', 
 '2024-11-01 09:00:00', '2024-11-01 10:30:00', 
 12345678, 'Carlos Mendoza García', 'carlos.mendoza@email.com', 
 132.74, 17.26, 150.00, 'card', 'FACT-001-2024', 
 '2024-11-01 08:30:00', '2024-11-01 10:30:00'),

('ORD-2024-002', 2, 2, 3, 'completed', 
 'Pastillas de freno delanteras desgastadas al 80%', 
 'Cambio de pastillas de freno delanteras y limpieza del sistema', 
 '2024-11-02 10:30:00', '2024-11-02 12:00:00', 
 87654321, 'María Lopez Fernández', 'maria.lopez@email.com', 
 176.99, 23.01, 200.00, 'cash', 'FACT-002-2024', 
 '2024-11-01 16:00:00', '2024-11-02 12:00:00'),

('ORD-2024-003', 3, 3, 3, 'completed', 
 'Vehículo presenta desalineación en rueda delantera derecha', 
 'Alineación computerizada y balanceado de 4 ruedas', 
 '2024-11-03 14:00:00', '2024-11-03 15:30:00', 
 11223344, 'Roberto Silva Quispe', 'roberto.silva@email.com', 
 159.29, 20.71, 180.00, 'transfer', 'FACT-003-2024', 
 '2024-11-02 09:15:00', '2024-11-03 15:30:00'),

('ORD-2024-004', 4, 4, 2, 'completed', 
 'Batería descargada, problemas en el alternador', 
 'Reparación del alternador y cambio de batería', 
 '2024-11-04 08:30:00', '2024-11-04 11:30:00', 
 55667788, 'Ana Vásquez Condori', 'ana.vasquez@email.com', 
 265.49, 34.51, 300.00, 'qr', 'FACT-004-2024', 
 '2024-11-03 17:00:00', '2024-11-04 11:30:00'),

('ORD-2024-005', 5, 5, 4, 'completed', 
 'Sistema A/C no enfría, posible fuga de refrigerante', 
 'Reparación de fuga en evaporador y recarga de gas R134a', 
 '2024-11-05 11:00:00', '2024-11-05 14:00:00', 
 99887766, 'Diego Mamani Choque', 'diego.mamani@email.com', 
 221.24, 28.76, 250.00, 'card', 'FACT-005-2024', 
 '2024-11-04 14:30:00', '2024-11-05 14:00:00'),

-- Órdenes en progreso
('ORD-2024-006', 6, 7, 5, 'in_progress', 
 'Filtros de aire y combustible obstruidos', 
 'Cambio de filtros de aire, combustible y habitáculo', 
 '2024-11-08 09:30:00', NULL, 
 33445566, 'Luis Gutierrez Ponce', 'luis.gutierrez@email.com', 
 106.19, 13.81, 120.00, 'cash', NULL, 
 '2024-11-07 11:00:00', '2024-11-08 09:30:00'),

('ORD-2024-007', 7, 8, 1, 'in_progress', 
 'Embrague patina, pedal se hunde completamente', 
 'Cambio completo del kit de embrague incluyendo disco, plato y collarin', 
 '2024-11-09 13:00:00', NULL, 
 22334455, 'Carmen Flores Ticona', 'carmen.flores@email.com', 
 707.96, 92.04, 800.00, 'transfer', NULL, 
 '2024-11-08 15:45:00', '2024-11-09 13:00:00'),

('ORD-2024-008', 8, 9, 7, 'in_progress', 
 'Abolladuras en puerta derecha por accidente menor', 
 'Reparación de abolladura y pintura parcial de puerta derecha', 
 '2024-11-09 15:30:00', NULL, 
 11223366, 'José Vargas Nina', 'jose.vargas@email.com', 
 353.98, 46.02, 400.00, 'card', NULL, 
 '2024-11-08 10:20:00', '2024-11-09 15:30:00'),

-- Órdenes pendientes
('ORD-2024-009', 9, 10, 8, 'pending', 
 'Motor presenta ruidos extraños y pérdida de potencia', 
 'Reparación mayor del motor, cambio de pistones y anillos', 
 NULL, NULL, 
 66778899, 'Sandra Cruz Apaza', 'sandra.cruz@email.com', 
 1327.43, 172.57, 1500.00, 'cash', NULL, 
 '2024-11-10 16:30:00', '2024-11-10 16:30:00'),

('ORD-2024-010', 10, 11, 6, 'pending', 
 'Parabrisas con grieta extensa por impacto', 
 'Cambio de parabrisas delantero con instalación y sellado', 
 NULL, NULL, 
 12345678, 'Carlos Mendoza García', 'carlos.mendoza@email.com', 
 309.73, 40.27, 350.00, 'transfer', NULL, 
 '2024-11-10 18:00:00', '2024-11-10 18:00:00'),

('ORD-2024-011', 11, 12, 3, 'pending', 
 'Amortiguadores traseros completamente desgastados', 
 'Cambio de amortiguadores traseros marca original', 
 NULL, NULL, 
 11223344, 'Roberto Silva Quispe', 'roberto.silva@email.com', 
 530.97, 69.03, 600.00, 'qr', NULL, 
 '2024-11-10 19:15:00', '2024-11-10 19:15:00'),

('ORD-2024-012', 12, 5, 2, 'pending', 
 'Check engine encendido, código de error P0301', 
 'Diagnosis computarizada para determinar falla en cilindro 1', 
 NULL, NULL, 
 99887766, 'Diego Mamani Choque', 'diego.mamani@email.com', 
 70.80, 9.20, 80.00, 'card', NULL, 
 '2024-11-10 20:00:00', '2024-11-10 20:00:00');

-- =====================================================================
-- RESUMEN DE DATOS INSERTADOS
-- =====================================================================
-- ✅ 10 Clientes (9 activos, 1 inactivo)
-- ✅ 15 Vehículos (variedad de marcas y modelos)
-- ✅ 15 Servicios (básicos, reparación, carrocería, suspensión)
-- ✅ 10 Mecánicos (diferentes niveles de experiencia)
-- ✅ 13 Relaciones Cliente-Vehículo
-- ✅ 38 Relaciones Mecánico-Servicios
-- ✅ 12 Reservaciones (5 completadas, 3 en progreso, 4 pendientes)
-- ✅ 12 Relaciones Reservación-Servicios
-- ✅ 12 Órdenes de trabajo (5 completadas, 3 en progreso, 4 pendientes)
-- =====================================================================

SELECT 'Datos de prueba insertados exitosamente!' as message,
       (SELECT COUNT(*) FROM client) as total_clients,
       (SELECT COUNT(*) FROM vehicle) as total_vehicles,
       (SELECT COUNT(*) FROM service) as total_services,
       (SELECT COUNT(*) FROM mechanic) as total_mechanics,
       (SELECT COUNT(*) FROM reservate) as total_reservations,
       (SELECT COUNT(*) FROM "order") as total_orders;

SELECT * FROM client;
SELECT * FROM vehicle;
SELECT * FROM service;
SELECT * FROM mechanic;
SELECT * FROM client_vehicle;
SELECT * FROM mechanic_services;
SELECT * FROM reservate;
SELECT * FROM reservate_service;
SELECT * FROM "order";