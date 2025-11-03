# 🧾 Integración Order → Factus (Facturación Electrónica)

## 📋 Resumen

El módulo **Order** está preparado para integrarse con **Factus**, el sistema de facturación electrónica. La orden captura todos los datos necesarios del cliente, servicios y totales con IVA incluido.

---

## 🔧 Campos de Facturación en Order

### Información del Cliente
- `clientNitCi` (bigint) - NIT o CI del cliente (7-10 dígitos)
- `clientName` (varchar 150) - Nombre completo
- `clientEmail` (varchar 100) - Email para envío de factura

### Detalles Financieros
- `subtotal` (decimal 10,2) - Subtotal antes de impuestos
- `taxAmount` (decimal 10,2) - Monto de IVA (13%)
- `totalCost` (decimal 10,2) - Total final (subtotal + IVA)
- `paymentMethod` (enum) - Método de pago: `cash`, `card`, `transfer`, `qr`
- `currency` (varchar 3) - Moneda, por defecto `BOB` (Bolivianos)

### Control de Facturación
- `invoiceNumber` (varchar 50) - Número de factura generado por Factus
- `invoiceStatus` (enum) - Estado: `pending`, `issued`, `cancelled`, `voided`
- `invoiceDate` (timestamp) - Fecha de emisión de la factura

---

## 🎯 Enums Creados

### PaymentMethod (`src/types/PaymentMethod.ts`)
```typescript
export enum PaymentMethod {
  CASH = 'cash',        // Efectivo
  CARD = 'card',        // Tarjeta
  TRANSFER = 'transfer', // Transferencia bancaria
  QR = 'qr',            // Pago QR
}
```

### InvoiceStatus (`src/types/InvoiceStatus.ts`)
```typescript
export enum InvoiceStatus {
  PENDING = 'pending',     // Pendiente de emisión
  ISSUED = 'issued',       // Factura emitida
  CANCELLED = 'cancelled', // Cancelada
  VOIDED = 'voided',       // Anulada
}
```

---

## 📡 Endpoint para Factus

### `GET /api/v1/order/:id/factus`

Prepara los datos de una orden para enviarlos a Factus.

**Respuesta:** `OrderToFactusDto`
```json
{
  "orderCode": "ORD-2025-001",
  "orderDate": "2025-11-03T10:30:00.000Z",
  "client": {
    "nitCi": 12345678,
    "name": "Carlos Gutiérrez",
    "email": "carlos.gutierrez@admin.com"
  },
  "services": [
    {
      "serviceId": 1,
      "name": "Cambio de aceite",
      "description": "Cambio completo de aceite sintético",
      "quantity": 1,
      "unitPrice": 150.00,
      "subtotal": 150.00
    },
    {
      "serviceId": 2,
      "name": "Alineación y balanceo",
      "description": "Alineación computarizada de 4 ruedas",
      "quantity": 1,
      "unitPrice": 200.00,
      "subtotal": 200.00
    }
  ],
  "subtotal": 350.00,
  "taxAmount": 45.50,
  "totalCost": 395.50,
  "paymentMethod": "card",
  "currency": "BOB",
  "vehicleInfo": {
    "board": "ABC-1234",
    "brand": "Toyota",
    "model": "Corolla"
  }
}
```

---

## 🔄 Flujo de Integración

### 1. Crear Orden
```bash
POST /api/v1/order
Content-Type: application/json

{
  "code": "ORD-2025-001",
  "reservateId": 1,
  "vehicleId": 5,
  "mechanicId": 2,
  "clientNitCi": 12345678,
  "clientName": "Carlos Gutiérrez",
  "clientEmail": "carlos.gutierrez@admin.com",
  "subtotal": 350.00,
  "paymentMethod": "card"
}
```

**Nota:** El sistema calcula automáticamente:
- `taxAmount = subtotal * 0.13` → 45.50 Bs.
- `totalCost = subtotal + taxAmount` → 395.50 Bs.

### 2. Obtener datos para Factus
```bash
GET /api/v1/order/1/factus
```

### 3. Enviar a Factus (desde tu app)
```javascript
// En tu aplicación cliente o backend
const orderData = await fetch('http://localhost:4000/api/v1/order/1/factus');
const factusResponse = await fetch('https://factus-api.com/invoices', {
  method: 'POST',
  body: JSON.stringify(orderData)
});
```

### 4. Actualizar orden con datos de factura
```bash
PATCH /api/v1/order/1
Content-Type: application/json

{
  "invoiceNumber": "FACT-2025-12345",
  "invoiceStatus": "issued",
  "invoiceDate": "2025-11-03T10:30:00.000Z"
}
```

---

## ✅ Validaciones Implementadas

### NIT/CI
- ✅ Debe ser un número entero
- ✅ Debe tener entre 7 y 10 dígitos
- ✅ Validación en creación y actualización

### Cálculo de IVA
- ✅ IVA fijo del 13%
- ✅ Cálculo automático en `create()` y `update()`
- ✅ Redondeo a 2 decimales

### Moneda
- ✅ Por defecto: `BOB` (Bolivianos)
- ✅ Formato ISO 4217 (3 caracteres)

---

## 📊 Datos Enviados a Factus

### Información del Cliente (desde Order)
- NIT/CI
- Nombre completo
- Email

### Detalle de Servicios (desde Reservate → Services)
- ID del servicio
- Nombre (título)
- Descripción
- Cantidad (siempre 1 por servicio)
- Precio unitario
- Subtotal

### Información del Vehículo (contexto adicional)
- Placa (board)
- Marca (brand)
- Modelo (model)

### Totales y Pago
- Subtotal
- IVA (13%)
- Total
- Método de pago
- Moneda

---

## 🚀 Próximos Pasos

1. **Implementar el servicio de integración con Factus**
   - Crear módulo `FactusModule`
   - Implementar `FactusService` con HttpClient
   - Manejar webhooks de Factus

2. **Gestionar estados de facturación**
   - Actualizar `invoiceStatus` según respuesta de Factus
   - Guardar `invoiceNumber` y `invoiceDate`
   - Manejar errores de facturación

3. **Agregar endpoints adicionales**
   - `POST /order/:id/issue-invoice` - Emitir factura
   - `POST /order/:id/cancel-invoice` - Cancelar factura
   - `GET /order/:id/invoice-pdf` - Obtener PDF

---

## 📝 Notas Importantes

- ✅ Sin descuentos (según requerimiento)
- ✅ Solo servicios, no repuestos
- ✅ IVA fijo 13%
- ✅ Moneda local: Bolivianos (BOB)
- ✅ Sin información del mecánico en la factura
- ✅ Relación: 1 Order → 1 Reservate → N Services
