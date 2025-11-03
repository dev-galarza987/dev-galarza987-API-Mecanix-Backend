# 📊 **Estadísticas y Reportes - Módulo Cliente**

## 📋 **Índice**
- [1. Estadísticas de Cliente Individual](#1-estadísticas-de-cliente-individual)
- [2. Top Clientes](#2-top-clientes)
- [3. Estadísticas Generales](#3-estadísticas-generales)
- [4. Reportes de Clientes Inactivos](#4-reportes-de-clientes-inactivos)
- [5. Filtros por Género](#5-filtros-por-género)
- [6. Filtros por Método de Contacto](#6-filtros-por-método-de-contacto)

---

## 1. **Estadísticas de Cliente Individual**

### 🌐 **Endpoint**
```
GET /client/:code/statistics
```

### 📝 **Ejemplo de Solicitud**
```http
GET /client/1001/statistics
```

### ✅ **Respuesta Exitosa (200)**
```json
{
  "clientCode": 1001,
  "fullName": "Juan Pérez",
  "email": "juan.perez@email.com",
  "totalReservations": 15,
  "completedReservations": 12,
  "pendingReservations": 2,
  "inProgressReservations": 1,
  "totalSpent": 4500.50,
  "lastReservationDate": "2025-10-15T10:30:00.000Z",
  "firstReservationDate": "2024-01-10T14:20:00.000Z",
  "averageSpentPerReservation": 375.04,
  "topServices": [
    "Cambio de aceite",
    "Revisión de frenos",
    "Alineación",
    "Balanceo",
    "Diagnóstico computarizado"
  ],
  "registrationDate": "2023-12-01T08:00:00.000Z",
  "isActive": true
}
```

### 📊 **Información Proporcionada**
- Total de reservaciones (completadas, pendientes, en progreso)
- Monto total gastado
- Promedio de gasto por reservación
- Servicios más solicitados (top 5)
- Fecha de primera y última reservación
- Fecha de registro del cliente
- Estado activo/inactivo

---

## 2. **Top Clientes**

### 🌐 **Endpoint**
```
GET /client/statistics/top?limit={limit}
```

### 📝 **Ejemplo de Solicitud**
```http
GET /client/statistics/top?limit=5
```

### ✅ **Respuesta Exitosa (200)**
```json
[
  {
    "code": 1001,
    "fullName": "Juan Pérez",
    "email": "juan.perez@email.com",
    "phone": "1234567890",
    "totalReservations": 25,
    "totalSpent": 7500.00,
    "lastVisit": "2025-11-01T15:30:00.000Z"
  },
  {
    "code": 1002,
    "fullName": "María González",
    "email": "maria.gonzalez@email.com",
    "phone": "0987654321",
    "totalReservations": 20,
    "totalSpent": 6200.00,
    "lastVisit": "2025-10-28T10:00:00.000Z"
  },
  {
    "code": 1003,
    "fullName": "Carlos López",
    "email": "carlos.lopez@email.com",
    "phone": "5551234567",
    "totalReservations": 18,
    "totalSpent": 5800.00,
    "lastVisit": "2025-10-25T14:15:00.000Z"
  }
]
```

### 📊 **Parámetros**
- `limit` (opcional): Cantidad de clientes a retornar (default: 10)

### 💡 **Uso**
Ideal para:
- Identificar clientes VIP
- Programas de fidelización
- Ofertas especiales para mejores clientes

---

## 3. **Estadísticas Generales**

### 🌐 **Endpoint**
```
GET /client/statistics/general
```

### 📝 **Ejemplo de Solicitud**
```http
GET /client/statistics/general
```

### ✅ **Respuesta Exitosa (200)**
```json
{
  "totalClients": 150,
  "activeClients": 135,
  "inactiveClients": 15,
  "totalReservations": 1200,
  "totalRevenue": 180000.00,
  "averageReservationsPerClient": 8.00,
  "averageRevenuePerClient": 1200.00,
  "genderDistribution": {
    "male": 85,
    "female": 65
  },
  "contactMethodDistribution": {
    "phone": 90,
    "email": 45,
    "whatsapp": 15
  }
}
```

### 📊 **Información Proporcionada**
- Total de clientes (activos e inactivos)
- Total de reservaciones realizadas
- Ingresos totales generados
- Promedios por cliente
- Distribución por género
- Distribución por método de contacto preferido

### 💡 **Uso**
Ideal para:
- Dashboard principal
- Reportes ejecutivos
- Análisis de mercado
- Planificación estratégica

---

## 4. **Reportes de Clientes Inactivos**

### 🌐 **Endpoint**
```
GET /client/reports/inactive-clients?days={days}
```

### 📝 **Ejemplo de Solicitud**
```http
GET /client/reports/inactive-clients?days=90
```

### ✅ **Respuesta Exitosa (200)**
```json
[
  {
    "id": 1,
    "code": 1005,
    "name": "Roberto",
    "lastname": "Silva",
    "phone": "1112223333",
    "ci": 87654321,
    "gender": "male",
    "email": "roberto.silva@email.com",
    "address": "Calle 123",
    "preferredContactMethod": "phone",
    "isActive": true,
    "createdAt": "2023-06-15T10:00:00.000Z",
    "updatedAt": "2025-11-01T12:00:00.000Z",
    "reservations": []
  }
]
```

### 📊 **Parámetros**
- `days` (opcional): Días de inactividad (default: 90)

### 💡 **Uso**
Ideal para:
- Campañas de reactivación
- Identificar clientes perdidos
- Email marketing dirigido
- Ofertas de regreso

---

## 5. **Filtros por Género**

### 🌐 **Endpoint**
```
GET /client/filter/gender/:gender
```

### 📝 **Ejemplos de Solicitud**
```http
GET /client/filter/gender/male
GET /client/filter/gender/female
```

### ✅ **Respuesta Exitosa (200)**
```json
[
  {
    "id": 1,
    "code": 1001,
    "name": "Juan",
    "lastname": "Pérez",
    "phone": "1234567890",
    "ci": 12345678,
    "gender": "male",
    "email": "juan.perez@email.com",
    "address": "Av. Principal 123",
    "preferredContactMethod": "email",
    "isActive": true,
    "createdAt": "2023-12-01T08:00:00.000Z",
    "updatedAt": "2025-11-01T10:30:00.000Z"
  }
]
```

### 📊 **Valores Válidos**
- `male` - Clientes masculinos
- `female` - Clientes femeninos

### 💡 **Uso**
Ideal para:
- Segmentación de mercado
- Campañas de marketing dirigidas
- Análisis demográfico
- Personalización de servicios

---

## 6. **Filtros por Método de Contacto**

### 🌐 **Endpoint**
```
GET /client/filter/contact-method/:method
```

### 📝 **Ejemplos de Solicitud**
```http
GET /client/filter/contact-method/phone
GET /client/filter/contact-method/email
GET /client/filter/contact-method/whatsapp
```

### ✅ **Respuesta Exitosa (200)**
```json
[
  {
    "id": 1,
    "code": 1001,
    "name": "Juan",
    "lastname": "Pérez",
    "phone": "1234567890",
    "ci": 12345678,
    "gender": "male",
    "email": "juan.perez@email.com",
    "address": "Av. Principal 123",
    "preferredContactMethod": "email",
    "isActive": true,
    "createdAt": "2023-12-01T08:00:00.000Z",
    "updatedAt": "2025-11-01T10:30:00.000Z"
  }
]
```

### 📊 **Valores Válidos**
- `phone` - Prefieren contacto telefónico
- `email` - Prefieren contacto por correo
- `whatsapp` - Prefieren contacto por WhatsApp

### 💡 **Uso**
Ideal para:
- Campañas de comunicación efectivas
- Respetar preferencias del cliente
- Optimizar canales de comunicación
- Aumentar tasas de respuesta

---

## 📌 **Resumen de Endpoints**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/client/:code/statistics` | Estadísticas detalladas de un cliente |
| GET | `/client/statistics/top?limit=10` | Top clientes por gasto |
| GET | `/client/statistics/general` | Estadísticas generales del sistema |
| GET | `/client/reports/inactive-clients?days=90` | Clientes sin actividad |
| GET | `/client/filter/gender/:gender` | Filtrar por género |
| GET | `/client/filter/contact-method/:method` | Filtrar por método de contacto |

---

## 🎯 **Casos de Uso Comunes**

### **1. Dashboard Principal**
```javascript
// Obtener estadísticas generales para mostrar en dashboard
const stats = await fetch('/client/statistics/general');
```

### **2. Programa de Fidelización**
```javascript
// Identificar top 10 clientes para beneficios especiales
const topClients = await fetch('/client/statistics/top?limit=10');
```

### **3. Campaña de Reactivación**
```javascript
// Clientes sin actividad en 60 días
const inactiveClients = await fetch('/client/reports/inactive-clients?days=60');
```

### **4. Marketing Dirigido**
```javascript
// Clientes masculinos que prefieren WhatsApp
const maleClients = await fetch('/client/filter/gender/male');
const whatsappPreferred = await fetch('/client/filter/contact-method/whatsapp');
```

### **5. Análisis de Cliente Individual**
```javascript
// Ver rendimiento detallado de un cliente
const clientStats = await fetch('/client/1001/statistics');
```

---

## 💡 **Mejores Prácticas**

1. **Caché**: Considera usar caché para estadísticas generales (se actualizan con menor frecuencia)
2. **Paginación**: Para listas grandes, implementa paginación
3. **Índices**: Asegura índices en campos frecuentemente consultados
4. **Rangos de Fechas**: Para reportes históricos, permite filtrar por rango de fechas
5. **Exportación**: Implementa opciones de exportación (CSV, Excel, PDF)

---

## 🔄 **Próximas Mejoras Sugeridas**

- [ ] Gráficos y visualizaciones
- [ ] Exportación de reportes
- [ ] Filtros combinados
- [ ] Comparativas período actual vs anterior
- [ ] Predicciones basadas en datos históricos
- [ ] Alertas automáticas para clientes en riesgo
