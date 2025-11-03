# 🔧 Ejemplos de Reservaciones - API Mecanix

## 📋 **Índice**
- [1. Crear Reservación (POST)](#1-crear-reservación-post)
- [2. Actualizar Reservación (PUT/PATCH)](#2-actualizar-reservación-putpatch)
- [3. Consultas SQL Equivalentes](#3-consultas-sql-equivalentes)
- [4. Esquema de Base de Datos](#4-esquema-de-base-de-datos)

---

## 1. **Crear Reservación (POST)**

### 🌐 **Endpoint**
```
POST /reservate
Content-Type: application/json
```

### 📝 **Ejemplo JSON - Básico (sin mecánico)**
```json
{
  "clientCode": 1001,
  "serviceCodes": [1, 2, 3]
}
```

### 📝 **Ejemplo JSON - Completo (con mecánico y fecha personalizada)**
```json
{
  "clientCode": 1001,
  "serviceCodes": [1, 2, 3],
  "reservationDate": "2025-11-15T14:30:00Z",
  "mechanicId": 5
}
```

### 📝 **Ejemplo JSON - Con múltiples servicios**
```json
{
  "clientCode": 2005,
  "serviceCodes": [1, 4, 7, 10],
  "mechanicId": 3
}
```

### ✅ **Respuesta Exitosa (201 Created)**
```json
{
  "message": "Reservación creada exitosamente",
  "data": {
    "id": 15,
    "code": 1729947234567,
    "reservationDate": "2025-10-26T18:30:00.000Z",
    "totalPrice": 450,
    "state": "pending",
    "client": {
      "id": 1,
      "code": 1001,
      "name": "Juan Pérez",
      "email": "juan.perez@email.com"
    },
    "mechanic": {
      "id": 5,
      "code": 5001,
      "name": "Carlos Martínez",
      "specialty": "engine"
    },
    "services": [
      {
        "id": 1,
        "code": 1,
        "name": "Cambio de aceite",
        "price": 80
      },
      {
        "id": 2,
        "code": 2,
        "name": "Revisión de frenos",
        "price": 120
      },
      {
        "id": 3,
        "code": 3,
        "name": "Alineación",
        "price": 250
      }
    ]
  }
}
```

### ❌ **Respuestas de Error**
```json
// Cliente no encontrado (404)
{
  "message": "Cliente con código 9999 no encontrado",
  "error": "Not Found",
  "statusCode": 404
}

// Servicio no encontrado (404)
{
  "message": "Servicio con código 99 no encontrado",
  "error": "Not Found",
  "statusCode": 404
}

// Mecánico no encontrado (404)
{
  "message": "Mecánico con ID 99 no encontrado",
  "error": "Not Found",
  "statusCode": 404
}

// Validación de datos (400)
{
  "message": [
    "El código del cliente es requerido",
    "La lista de códigos de servicio es requerida"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

---

## 2. **Actualizar Reservación (PUT/PATCH)**

### 🌐 **Endpoint**
```
PUT /reservate/:id
Content-Type: application/json
```

### 📝 **Ejemplo JSON - Cambiar estado**
```json
{
  "state": "in_progress"
}
```

### 📝 **Ejemplo JSON - Asignar mecánico**
```json
{
  "mechanicId": 7,
  "state": "in_progress"
}
```

### 📝 **Ejemplo JSON - Cambiar servicios y precio**
```json
{
  "serviceCodes": [1, 5, 8],
  "totalPrice": 380,
  "state": "pending"
}
```

### 📝 **Ejemplo JSON - Actualización completa**
```json
{
  "clientCode": 2003,
  "serviceCodes": [2, 4, 6, 9],
  "reservationDate": "2025-11-20T09:00:00Z",
  "mechanicId": 4,
  "state": "completed",
  "totalPrice": 650
}
```

### 📝 **Ejemplo JSON - Desasignar mecánico (null)**
```json
{
  "mechanicId": null,
  "state": "pending"
}
```

### ✅ **Respuesta Exitosa (200 OK)**
```json
{
  "message": "Reservación actualizada exitosamente",
  "data": {
    "id": 15,
    "code": 1729947234567,
    "reservationDate": "2025-11-20T09:00:00.000Z",
    "totalPrice": 650,
    "state": "completed",
    "client": {
      "id": 3,
      "code": 2003,
      "name": "María González",
      "email": "maria.gonzalez@email.com"
    },
    "mechanic": {
      "id": 4,
      "code": 4001,
      "name": "Roberto Silva",
      "specialty": "transmission"
    },
    "services": [
      {
        "id": 2,
        "code": 2,
        "name": "Revisión de frenos",
        "price": 120
      },
      {
        "id": 4,
        "code": 4,
        "name": "Cambio de filtros",
        "price": 90
      },
      {
        "id": 6,
        "code": 6,
        "name": "Diagnóstico computarizado",
        "price": 200
      },
      {
        "id": 9,
        "code": 9,
        "name": "Reparación de transmisión",
        "price": 240
      }
    ]
  }
}
```

---

## 3. **Consultas SQL Equivalentes**

### 🗄️ **CREATE - Insertar nueva reservación**

```sql
-- 1. Insertar la reservación principal
INSERT INTO reservate (
    code_reservate, 
    reservation_date, 
    total_price, 
    state, 
    clientId, 
    mechanicId
) VALUES (
    1729947234567,                    -- Código único generado
    CURRENT_TIMESTAMP,                -- Fecha actual por defecto
    450,                              -- Precio total calculado
    'pending',                        -- Estado inicial
    1,                                -- ID del cliente (obtenido por clientCode)
    5                                 -- ID del mecánico (opcional)
);

-- 2. Obtener el ID de la reservación recién creada
SET @reservate_id = LAST_INSERT_ID();

-- 3. Asociar servicios en la tabla intermedia
INSERT INTO reservate_service (reservate_id, service_id) VALUES
    (@reservate_id, 1),  -- Servicio: Cambio de aceite
    (@reservate_id, 2),  -- Servicio: Revisión de frenos
    (@reservate_id, 3);  -- Servicio: Alineación

-- 4. Consulta completa con relaciones
SELECT 
    r.reservate_id,
    r.code_reservate,
    r.reservation_date,
    r.total_price,
    r.state,
    c.client_id as client_id,
    c.code as client_code,
    c.name as client_name,
    c.email as client_email,
    m.mechanic_id as mechanic_id,
    m.code as mechanic_code,
    m.name as mechanic_name,
    m.specialty as mechanic_specialty
FROM reservate r
INNER JOIN client c ON r.clientId = c.client_id
LEFT JOIN mechanic m ON r.mechanicId = m.mechanic_id
WHERE r.reservate_id = @reservate_id;
```

### 🔄 **UPDATE - Actualizar reservación existente**

```sql
-- 1. Actualizar datos principales de la reservación
UPDATE reservate 
SET 
    state = 'in_progress',
    mechanicId = 7,
    total_price = 380
WHERE reservate_id = 15;

-- 2. Eliminar servicios anteriores (si se cambian)
DELETE FROM reservate_service 
WHERE reservate_id = 15;

-- 3. Insertar nuevos servicios
INSERT INTO reservate_service (reservate_id, service_id) VALUES
    (15, 1),  -- Cambio de aceite
    (15, 5),  -- Balanceado
    (15, 8);  -- Revisión eléctrica

-- 4. Actualización de estado específica
UPDATE reservate 
SET state = 'completed'
WHERE reservate_id = 15;

-- 5. Desasignar mecánico
UPDATE reservate 
SET mechanicId = NULL, state = 'pending'
WHERE reservate_id = 15;
```

### 🔍 **SELECT - Consultas de lectura complejas**

```sql
-- Reservación completa con todas las relaciones
SELECT 
    r.reservate_id,
    r.code_reservate,
    r.reservation_date,
    r.total_price,
    r.state,
    c.client_id, c.code as client_code, c.name as client_name, c.email as client_email,
    m.mechanic_id, m.code as mechanic_code, m.name as mechanic_name, m.specialty,
    GROUP_CONCAT(CONCAT(s.service_id, ':', s.name, ':', s.price) SEPARATOR '|') as services
FROM reservate r
INNER JOIN client c ON r.clientId = c.client_id
LEFT JOIN mechanic m ON r.mechanicId = m.mechanic_id
LEFT JOIN reservate_service rs ON r.reservate_id = rs.reservate_id
LEFT JOIN service s ON rs.service_id = s.service_id
WHERE r.reservate_id = 15
GROUP BY r.reservate_id;

-- Reservaciones por estado
SELECT r.*, c.name as client_name, m.name as mechanic_name
FROM reservate r
INNER JOIN client c ON r.clientId = c.client_id
LEFT JOIN mechanic m ON r.mechanicId = m.mechanic_id
WHERE r.state = 'pending'
ORDER BY r.reservation_date DESC;

-- Reservaciones por mecánico
SELECT r.*, c.name as client_name
FROM reservate r
INNER JOIN client c ON r.clientId = c.client_id
WHERE r.mechanicId = 5
ORDER BY r.reservation_date DESC;
```

---

## 4. **Esquema de Base de Datos**

### 🗄️ **Tabla: reservate**
```sql
CREATE TABLE reservate (
    reservate_id INT PRIMARY KEY AUTO_INCREMENT,
    code_reservate BIGINT NOT NULL UNIQUE,
    reservation_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total_price INT NOT NULL,
    state ENUM('pending', 'in_progress', 'completed') NOT NULL DEFAULT 'pending',
    clientId INT NOT NULL,
    mechanicId INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (clientId) REFERENCES client(client_id),
    FOREIGN KEY (mechanicId) REFERENCES mechanic(mechanic_id)
);
```

### 🗄️ **Tabla: reservate_service (Relación muchos a muchos)**
```sql
CREATE TABLE reservate_service (
    reservate_id INT NOT NULL,
    service_id INT NOT NULL,
    
    PRIMARY KEY (reservate_id, service_id),
    FOREIGN KEY (reservate_id) REFERENCES reservate(reservate_id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES service(service_id) ON DELETE CASCADE
);
```

### 📊 **Índices Recomendados**
```sql
-- Índices para mejorar rendimiento
CREATE INDEX idx_reservate_client ON reservate(clientId);
CREATE INDEX idx_reservate_mechanic ON reservate(mechanicId);
CREATE INDEX idx_reservate_state ON reservate(state);
CREATE INDEX idx_reservate_date ON reservate(reservation_date);
CREATE INDEX idx_reservate_code ON reservate(code_reservate);
```

---

## 📌 **Notas Importantes**

1. **Fechas**: Si no se proporciona `reservationDate`, se usa automáticamente la fecha y hora actual
2. **Códigos únicos**: El `code_reservate` se genera automáticamente usando timestamp
3. **Estados válidos**: `pending`, `in_progress`, `completed`
4. **Mecánico opcional**: Las reservaciones pueden existir sin mecánico asignado
5. **Precios**: Se calculan automáticamente sumando los precios de los servicios seleccionados
6. **Validaciones**: Todos los códigos de cliente, mecánico y servicios deben existir en la base de datos

---

## 🔗 **Endpoints Relacionados**

- `GET /reservate` - Listar todas las reservaciones
- `GET /reservate/:id` - Obtener reservación específica
- `POST /reservate` - Crear nueva reservación
- `PUT /reservate/:id` - Actualizar reservación completa
- `PATCH /reservate/:id` - Actualizar campos específicos
- `DELETE /reservate/:id` - Eliminar reservación
- `GET /reservate/client/:clientCode` - Reservaciones por cliente
- `GET /reservate/mechanic/:mechanicId` - Reservaciones por mecánico
- `GET /reservate/state/:state` - Reservaciones por estado